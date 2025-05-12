// src/services/vote.service.ts
import {
  ChatInputCommandInteraction,
  TextBasedChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageComponentInteraction,
  Message,
  User,
} from 'discord.js';

import { collectParticipants } from '../handlers/collectParticipants.handler';
import { VoteGuards }          from './voteGuards.service';
import { DraftService }        from './draft.service';
import {
  VOTE_TIMER_SV,
  VOTE_TIMER_DRAFT,
  EMOJI_READY,
  CIV7_VOTE_SETTINGS,
} from '../config/constants';

import {
  buildStartEmbed,
  buildDmEmbed,
  buildResultEmbed,
  createYesNoRow,
  dmAllParticipants,
  collectVotes,
} from './secretVote.helpers';

import {
  buildMasterEmbed,
  buildCategoryButtons,
} from './civ7Draft.helpers';

export class VoteService {
  /** Secret yes/no vote via DMs (unchanged) */
  static async secretVote(interaction: ChatInputCommandInteraction) {
    const raw = interaction.channel;
    if (!raw?.isTextBased()) return;
    const channel = raw as TextBasedChannel & { send: Function };

    if (!VoteGuards.tryAcquire(channel.id)) {
      await interaction.reply({ content: '⏳ A vote is already running here.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });

    try {
      const members = await collectParticipants(interaction);
      if (members.length < 2) {
        await interaction.editReply('❌ Need at least two participants.');
        return;
      }

      const voteId   = Math.random().toString(36).slice(2, 8).toUpperCase();
      const type     = interaction.options.getString('type', true);
      const params   = interaction.options.getString('params', true);
      const question = `**Secret Vote:** ${type} ${params}`;
      const mentions = members.map(m => `<@${m.id}>`).join(' ');

      // 1️⃣ announce publicly
      await channel.send({ embeds: [buildStartEmbed(voteId, question, mentions)] });

      // 2️⃣ DM + buttons
      const dmEmbed = buildDmEmbed(voteId, question);
      const row     = createYesNoRow();
      const { dmResults, unreachable } = await dmAllParticipants(members, dmEmbed, row);

      // 3️⃣ collect (timeout → yes)
      const votes = await collectVotes(dmResults, VOTE_TIMER_SV);

      // 4️⃣ publish results
      await channel.send({ embeds: [buildResultEmbed(voteId, mentions, votes)] });

      // 5️⃣ unreachable warning
      if (unreachable.length) {
        const list = unreachable.map(m => `<@${m.id}>`).join(', ');
        await channel.send(`⚠️ Could not DM: ${list}`);
      }

      await interaction.editReply('✅ Secret vote complete!');
    } finally {
      VoteGuards.release(channel.id);
    }
  }

  /** `/civ7draft` live-updating button vote */
  static async civ7Draft(interaction: ChatInputCommandInteraction) {
    const raw = interaction.channel;
    if (!raw?.isTextBased()) return;
    const ch = raw as TextBasedChannel & { send: Function };

    if (!VoteGuards.tryAcquire(ch.id)) {
      return interaction.reply({ content: '⏳ A draft vote is already running here.', ephemeral: true });
    }
    await interaction.deferReply();

    try {
      // 1️⃣ gather participants
      const members     = await collectParticipants(interaction);
      if (members.length < 2) {
        return interaction.editReply('❌ Need at least two participants.');
      }
      const mentions    = members.map(m => `<@${m.id}>`).join(', ');
      const startingAge = interaction.options.getString('startingage', true)!;
      const threshold   = Math.floor(members.length / 2) + 1;

      // **NEW** generate Vote ID
      const voteId = Math.random().toString(36).slice(2, 8).toUpperCase();

      // 2️⃣ send master embed (now passing voteId)
      const master    = buildMasterEmbed(voteId, mentions, startingAge);
      const masterMsg = await ch.send({ embeds: [master] });

      // 3️⃣ per-category button panels
      type Counts = Record<string, number>;
      const allCounts: Record<string, Counts> = {};
      const panelCollectors: Promise<void>[]   = [];

      for (const [category, opts] of Object.entries(CIV7_VOTE_SETTINGS)) {
        // a) initial counts
        allCounts[category] = opts.reduce(
          (c,p) => ({ ...c, [p.label]: 0 }),
          {} as Counts
        );

        // b) send buttons
        const rows = buildCategoryButtons(category, opts);
        const panel = await ch.send({ content: `**${category}**`, components: rows });

        // c) collector
        const collector = panel.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: VOTE_TIMER_DRAFT,
        });

        collector.on('collect', async (btn: MessageComponentInteraction) => {
          if (btn.user.bot) return;
          const [cat, label] = btn.customId.split('|');
          allCounts[cat][label]++;

          // compute top
          const counts = Object.entries(allCounts[cat])
            .map(([lab, cnt]) => ({ lab, cnt }))
            .sort((a,b) => b.cnt - a.cnt);
          const top = counts[0];

          // update master embed
          const idx = master.data.fields!.findIndex(f => f.name === category);
          if (idx !== -1) {
            const emoji = opts.find(o => o.label === top.lab)!.emoji;
            master.data.fields![idx].value = `${emoji} ${top.lab}`;
            await masterMsg.edit({ embeds: [master] });
          }

          await btn.deferUpdate();
        });

        panelCollectors.push(
          new Promise(res => collector.on('end', () => res()))
        );
      }

      // 4️⃣ leader-bans prompt
      await ch.send({
        content: '**Leader Bans**\nReact with any leader emoji below to ban them (no buttons).',
      });

      // 5️⃣ “Ready” button
      const readyRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('ready_all')
          .setEmoji(EMOJI_READY)
          .setLabel('I’m Ready')
          .setStyle(ButtonStyle.Primary)
      );
      const readyMsg = await ch.send({
        content: 'When done with all categories, click Ready:',
        components: [readyRow],
      });

      // 6️⃣ await all panels + ready
      await Promise.all(panelCollectors);
      const remaining = new Set(members.map(m => m.id));
      const readyCollector = readyMsg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: VOTE_TIMER_DRAFT,
      });
      await new Promise(res => {
        readyCollector.on('collect', (btn: MessageComponentInteraction) => {
          if (remaining.delete(btn.user.id)) {
            btn.deferUpdate();
            if (remaining.size === 0) readyCollector.stop();
          }
        });
        readyCollector.on('end', () => res(undefined));
      });

      // 7️⃣ derive final settings
      const finalSettings: Record<string,string> = {};
      for (const [category, opts] of Object.entries(CIV7_VOTE_SETTINGS)) {
        const counts = Object.entries(allCounts[category]).map(([lab,cnt]) => ({ lab, cnt }));
        const maj    = counts.filter(c => c.cnt >= threshold);
        const winner = maj.length === 1
          ? maj[0]
          : counts.sort((a,b) => b.cnt - a.cnt)[0];
        finalSettings[category] = `${opts.find(o => o.label === winner.lab)!.emoji} ${winner.lab}`;
      }

      // 8️⃣ generate draft pools
      const bans  : string[] = []; // implement reaction-based ban collection as needed
      const pools = DraftService.generateDraftPool(
        'civ7',
        finalSettings['Draft Mode'] as any,
        members.map(m => m.user.tag),
        { age: startingAge as any, bans }
      );

      // 🔟 final picks embed
      const result = new EmbedBuilder()
        .setTitle('🎉 Civ VII Draft Complete 🎉')
        .addFields(
          { name: 'Players',      value: mentions,               inline: false },
          { name: 'Starting Age', value: startingAge,            inline: true  },
          { name: 'Draft Mode',   value: finalSettings['Draft Mode'], inline: true }
        )
        .setTimestamp();

      for (const [pl, picks] of Object.entries(pools)) {
        const txt = picks.map(p => `${p.emoji_ID} ${p.name}`).join('\n') || '—';
        result.addFields({ name: pl, value: txt, inline: true });
      }

      await ch.send({ embeds: [result] });
      await interaction.editReply('✅ Civ VII draft complete!');
    } finally {
      VoteGuards.release(ch.id);
    }
  }
}
