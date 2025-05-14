// src/services/votes/votes.service.ts
import {
  ChatInputCommandInteraction,
  TextChannel,
  GuildMember,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

import { collectParticipants } from '../../handlers/collectParticipants.handler';
import { VoteGuards }          from '../../utils/voteGuards';
import { DraftService }        from './draft.service';
import {
  VOTE_TIMER_SV,
  VOTE_TIMER_DRAFT,
  EMOJI_FINISHED,
  CIV7_VOTE_SETTINGS,
} from '../../config/constants';

import {
  buildSecretStartEmbed,
  buildSecretDmEmbed,
  buildSecretResultEmbed,
  buildCiv7MasterEmbed,
  createYesNoRow,
  buildCategoryButtons,
} from './votes.embeds';

import {
  collectSecretDMs,
  collectCategoryClicks,
  collectBanReactions,
  collectFinishClicks,
} from './votes.interactions';

import {
  tallyCategory,
  tallyBans,
} from './votes.math';

import { civ7Leaders } from '../../data/civ7';

export class VoteService {
  /** Secret yes/no vote via DMs */
  public static async secretVote(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    // narrow to a guild‐text channel
    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) return;
    const channel = interaction.channel;

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
      const mentions = members.map(m => `<@${m.id}>`).join(', ');

      // 1️⃣ announce publicly
      await channel.send({ embeds: [buildSecretStartEmbed(voteId, question, mentions)] });

      // 2️⃣ DM + collect DMs
      const dms = await Promise.all(
        members.map(async (m: GuildMember) => {
          const dm = await m.user.send({
            embeds: [buildSecretDmEmbed(voteId, question)],
            components: [createYesNoRow()],
          });
          return { member: m, dm };
        })
      );

      // 3️⃣ gather all DM votes
      const votes = await collectSecretDMs(dms);

      // 4️⃣ publish results
      await channel.send({ embeds: [buildSecretResultEmbed(voteId, mentions, votes)] });
      await interaction.editReply('✅ Secret vote complete!');
    } finally {
      VoteGuards.release(interaction.channelId);
    }
  }

  /** Civ VII Draft: live buttons + bans + finish */
  public static async civ7Draft(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) return;
    const ch = interaction.channel;

    if (!VoteGuards.tryAcquire(ch.id)) {
      await interaction.reply({ content: '⏳ A draft vote is already running here.', ephemeral: true });
      return;
    }
    await interaction.deferReply();

    try {
      const members     = await collectParticipants(interaction);
      if (members.length < 2) {
        await interaction.editReply('❌ Need at least two participants.');
        return;
      }
      const memberIds   = new Set(members.map(m => m.id));
      const mentions    = members.map(m => `<@${m.id}>`).join(', ');
      const startingAge = interaction.options.getString('startingage', true)!;
      const threshold   = Math.floor(members.length / 2) + 1;
      const voteId      = Math.random().toString(36).slice(2, 8).toUpperCase();

      // master embed
      const master    = buildCiv7MasterEmbed(voteId, mentions, startingAge);
      const masterMsg = await ch.send({ embeds: [master] });

      // per‐category polls
      const panelMap = new Map<string, Awaited<ReturnType<typeof ch.send>>>();
      const jobs: Promise<void>[] = [];

      for (const [category, opts] of Object.entries(CIV7_VOTE_SETTINGS)) {
        const panel = await ch.send({
          content: `**${category}**`,
          components: buildCategoryButtons(category, opts),
        });
        panelMap.set(category, panel);

        jobs.push(
          collectCategoryClicks(
            panel,
            opts,
            threshold,
            async win => {
              const idx = master.data.fields!.findIndex(f => f.name === category);
              master.data.fields![idx].value = `${win.emoji} ${win.label}`;
              await masterMsg.edit({ embeds: [master] });
            }
          )
        );
      }

      // leader bans
      const banPrompt = await ch.send({ content: '**Leader Bans:** react to ban.' });
      jobs.push(
        collectBanReactions(
          banPrompt,
          civ7Leaders,
          threshold,
          async banned => {
            const idx = master.data.fields!.findIndex(f => f.name === 'Leader Bans');
            master.data.fields![idx].value = banned.length ? banned.join('\n') : '—';
            await masterMsg.edit({ embeds: [master] });
          }
        )
      );

      // finish button
      const finishRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`${voteId}|FINISH`)
          .setEmoji(EMOJI_FINISHED)
          .setLabel('Finish Vote')
          .setStyle(ButtonStyle.Primary)
      );
      const finishMsg = await ch.send({
        content: `Waiting for: ${mentions}`,
        components: [finishRow],
      });
      jobs.push(
        collectFinishClicks(
          finishMsg,
          members,
          async remaining => {
            const txt = remaining.length
              ? `Waiting for: ${remaining.map(m => `<@${m.id}>`).join(', ')}`
              : 'All players finished!';
            await finishMsg.edit({ content: txt, components: [finishRow] });
          }
        )
      );

      // wait for all
      await Promise.all(jobs);

      // final tally
      const finalSettings: Record<string,string> = {};
      for (const [category, opts] of Object.entries(CIV7_VOTE_SETTINGS)) {
        const panel = panelMap.get(category)!;
        finalSettings[category] = tallyCategory(panel.reactions.cache, opts, threshold);
      }
      const finalBans = tallyBans(banPrompt.reactions.cache, civ7Leaders, threshold);

      // update master to complete
      master
        .setTitle('🎉 Civ VII Draft Complete 🎉')
        .setTimestamp()
        .spliceFields(
          master.data.fields!.findIndex(f => f.name === 'Leader Bans'),
          1,
          { name: 'Leader Bans', value: finalBans.join(', ') || 'None' }
        );

      // generate & append picks
      const pools = DraftService.generateDraftPool(
        'civ7',
        finalSettings['Draft Mode'] as any,
        members.map(m => m.user.tag),
        { age: startingAge as any, bans: finalBans.map(s => s.split(' ').pop()!) }
      );
      for (const [player, picks] of Object.entries(pools)) {
        const list = picks.map(p => `${p.emoji_ID} ${p.name}`).join('\n') || '—';
        master.addFields({ name: player, value: list, inline: true });
      }

      await masterMsg.edit({ embeds: [master] });
      await interaction.editReply('✅ Civ VII draft complete!');
    } finally {
      VoteGuards.release(ch.id);
    }
  }
}
