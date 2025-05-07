import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  GuildMember,
  Message,
  TextBasedChannel,
} from 'discord.js';
import { collectParticipants } from '../handlers/collectParticipants.handler';
import {
  EMOJI_SPY,
  EMOJI_QUESTION,
  EMOJI_YES,
  EMOJI_NO,
  EMOJI_RESULTS,
  EMOJI_ID,
  EMOJI_PARTICIPANTS,
  EMOJI_READY,
  VOTE_TIMER_SV,
  VOTE_TIMER_DRAFT,
  CIV7_VOTE_SETTINGS
} from '../config/constants';

let voteInProgress = false;

export const VoteService = {
  canVote(interaction: ChatInputCommandInteraction): boolean {
    if (voteInProgress) {
      interaction.reply({ content: 'A vote is already in progress.', ephemeral: true });
      return false;
    }
    return true;
  },

  async secretVote(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.canVote(interaction)) return;
    voteInProgress = true;

    const voteId = Math.random().toString(36).substring(2, 8).toUpperCase();
    await interaction.deferReply({ ephemeral: true });

    const members = await collectParticipants(interaction);

    if (members.length < 2) {
      await interaction.editReply({
        content: 'Cannot start vote: need at least two participants.',
        embeds: [],
      });
      voteInProgress = false;
      return;
    }

    const type     = interaction.options.getString('type', true);
    const params   = interaction.options.getString('params', true);
    const question = `${type} ${params}`;
    const mentions = members.map(m => `<@${m.id}>`).join(' ');

    const channel = interaction.channel as TextBasedChannel | null;

    if (channel?.isTextBased()) {
      const startEmbed = new EmbedBuilder()
        .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
        .addFields(
          { name: `${EMOJI_QUESTION} Question`, value: question },
          { name: `${EMOJI_ID} Vote ID`,       value: voteId },
        )
        .setDescription(`${EMOJI_PARTICIPANTS} Participants: ${mentions}`)
        .setTimestamp();
      (channel as any).send({ embeds: [startEmbed] });
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
      .addFields(
        { name: `${EMOJI_QUESTION} Question`, value: question },
        { name: `${EMOJI_ID} Vote ID`,       value: voteId },
      )
      .setTimestamp();

    const yes = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setEmoji(EMOJI_YES)
      .setStyle(ButtonStyle.Secondary);
    const no  = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setEmoji(EMOJI_NO)
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(yes, no);

    const dmResults: { member: GuildMember; dm: Message }[] = []; 
    const unreachable: GuildMember[] = [];
    for (const member of members) {
      try {
        const dm = await member.send({ embeds: [dmEmbed], components: [row.toJSON()] });
        dmResults.push({ member, dm });
      } catch (err: any) {
        if (err.code === 50007) unreachable.push(member);
      }
    }

    const votes = { yes: 0, no: 0 };
    await Promise.all(
      dmResults.map(async ({ dm }) => {
        try {
          const resp = await dm.awaitMessageComponent({ time: VOTE_TIMER_SV });
          votes[resp.customId as 'yes' | 'no']++;
          await dm.edit({ content: `You voted **${resp.customId}**`, embeds: [], components: [] });
        } catch {
          votes.yes++;
        }
      })
    );

    if (channel?.isTextBased()) {
      const resultEmbed = new EmbedBuilder()
        .setTitle(`${EMOJI_SPY} Secret Vote Results ${EMOJI_SPY}`)
        .addFields(
          { name: `${EMOJI_ID} Vote ID`,             value: voteId },
          { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentions },
          {
            name: `${EMOJI_RESULTS} Results`,
            value: `${EMOJI_YES} Yes\n${votes.yes}\n${EMOJI_NO} No\n${votes.no}`,
          }
        )
        .setTimestamp();
      (channel as any).send({ embeds: [resultEmbed] });
    }

    if (unreachable.length && channel?.isTextBased()) {
      const list = unreachable.map(m => `<@${m.id}>`).join(', ');
      (channel as any).send(`Could not DM: ${list}. They were excluded.`);
    }

    await interaction.editReply({ content: '✅ Vote completed!', embeds: [] });
    voteInProgress = false;
  },



  // /**
  //  * Starts a draft vote: gathers participants and returns them for draft logic.
  //  */
  // async civilization6DraftVote(
  //   interaction: ChatInputCommandInteraction
  // ): Promise<GuildMember[]> {
  //   if (!this.canVote(interaction)) return [];
  //   voteInProgress = true;
  //   const members = await getUsersInVoiceChannel(interaction);
  //   return toggleMentionedUsers(interaction, members);
  // },

  async civilization7DraftVote(
    interaction: ChatInputCommandInteraction
  ): Promise<GuildMember[]> {
    if (voteInProgress) {
      await interaction.reply({ content: 'A vote is already in progress.', ephemeral: true });
      return [];
    }
    voteInProgress = true;

    // 1️⃣ Defer reply
    await interaction.deferReply();

    // 2️⃣ Collect participants (voice + mentions + self)
    const members = await collectParticipants(interaction);
    if (members.length < 2) {
      await interaction.editReply('Cannot start draft: need at least two participants.');
      voteInProgress = false;
      return [];
    }
    const playerTags = members.map(m => m.user.tag).join(', ');

    // 3️⃣ Ensure text channel
    const channel = interaction.channel as TextBasedChannel | null;
    if (!channel?.isTextBased()) {
      await interaction.editReply('Drafts must be run in a text channel.');
      voteInProgress = false;
      return [];
    }

    // 4️⃣ Send all setting polls
    type Poll = {
      category: string;
      options: typeof CIV7_VOTE_SETTINGS[string];
      message: Message;
    };
    const polls: Poll[] = [];
    for (const [category, options] of Object.entries(CIV7_VOTE_SETTINGS)) {
      const embed = new EmbedBuilder()
        .setTitle(category)
        .setDescription(options.map(o => `${o.emoji}  ${o.label}`).join('\n'))
        .setFooter({ text: `React within ${VOTE_TIMER_DRAFT/1000}s` })
        .setTimestamp();

      const msg = await channel.send({ embeds: [embed] });
      for (const opt of options) {
        await msg.react(opt.emoji);
      }
      polls.push({ category, options, message: msg });
    }

    // 5️⃣ Send “Ban Leaders” poll
    const banEmbed = new EmbedBuilder()
      .setTitle('Ban Leaders')
      .setDescription(civ7Leaders.map(l => `<:${l.emoji_ID}>  ${l.leader}`).join('\n'))
      .setFooter({ text: `React within ${VOTE_TIMER_DRAFT/1000}s` })
      .setTimestamp();

    const banMsg = await channel.send({ embeds: [banEmbed] });
    for (const leader of civ7Leaders) {
      await banMsg.react(leader.emoji_ID);
    }

    // 6️⃣ Collect all reactions in parallel
    const pollPromises = polls.map(poll =>
      poll.message.awaitReactions({
        time: VOTE_TIMER_DRAFT,
        filter: (reaction, user) =>
          !user.bot && poll.options.some(o => o.emoji === reaction.emoji.name),
      })
    );
    const banPromise = banMsg.awaitReactions({
      time: VOTE_TIMER_DRAFT,
      filter: (reaction, user) =>
        !user.bot && civ7Leaders.some(l => l.emoji_ID === reaction.emoji.name),
    });

    const pollResults = await Promise.all(pollPromises);
    const banReactions = await banPromise;

    // 7️⃣ Tally each poll (majority threshold)
    const majorityThreshold = Math.floor(members.length / 2) + 1;
    const chosenSettings: Record<string,string> = {};

    pollResults.forEach((reactions, idx) => {
      const { category, options } = polls[idx];
      const counts = options.map(o => ({
        label: o.label,
        count: (reactions.get(o.emoji)?.count ?? 1) - 1,
      }));

      // find any with majority
      const majority = counts.filter(c => c.count >= majorityThreshold);
      let winner: string;
      if (majority.length === 1) {
        winner = majority[0].label;
      } else {
        // fall back to highest count
        const top = counts.reduce((a, b) => (b.count > a.count ? b : a), counts[0]);
        winner = top.label;
      }

      chosenSettings[category] = winner;
      channel.send(`**${category}** → **${winner}**`);
    });

    // 8️⃣ Tally bans (majority threshold)
    const bans = civ7Leaders
      .filter(l => ((banReactions.get(l.emoji_ID)?.count ?? 1) - 1) >= majorityThreshold)
      .map(l => l.leader);

    if (bans.length) {
      await channel.send(`Banned leaders (≥${majorityThreshold} votes): ${bans.join(', ')}`);
    } else {
      await channel.send('No leaders banned.');
    }

    // 9️⃣ “Ready?” phase: wait for all participants to react ➕
    const notReady = new Set(members.map(m => m.id));
    const readyEmbed = new EmbedBuilder()
      .setTitle('Confirm Ready')
      .setDescription(
        `Players not yet ready:\n${members.map(m => `<@${m.id}>`).join('\n')}`
      )
      .setFooter({ text: `React with ${EMOJI_READY} to continue` })
      .setTimestamp();

    const readyMsg = await channel.send({ embeds: [readyEmbed] });
    await readyMsg.react(EMOJI_READY);

    await new Promise<void>(resolve => {
      const collector = readyMsg.createReactionCollector({
        filter: (reaction, user) =>
          reaction.emoji.name === EMOJI_READY && notReady.has(user.id),
      });

      collector.on('collect', (_, user) => {
        notReady.delete(user.id);
        readyMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle('Confirm Ready')
              .setDescription(
                notReady.size
                  ? `Players not yet ready:\n${[...notReady].map(id => `<@${id}>`).join('\n')}`
                  : 'All players ready! Generating draft…'
              )
              .setTimestamp(),
          ],
        });

        if (notReady.size === 0) collector.stop();
      });

      collector.on('end', () => resolve());
    });

    // 🔟 Derive mode & age, generate pools
    const modeLabel = chosenSettings['Draft Mode'];
    const draftMode: DraftMode =
      modeLabel === DraftMode.DRAFT_2   ? DraftMode.DRAFT_2  :
      modeLabel === DraftMode.SNAKE     ? DraftMode.SNAKE    :
      modeLabel === DraftMode.NO_TRADE  ? DraftMode.NO_TRADE :
      DraftMode.WITH_TRADE;

    const startingAge = interaction.options.getString('startingage', true) as
      | 'Antiquity_Age'
      | 'Exploration_Age'
      | 'Modern_Age';

    const pools = draftmodeController.generateDraftPool(
      'civ7',
      draftMode,
      members.map(m => m.user.tag),
      { civs: civ7Civs, age: startingAge, bans }
    );

    // 1️⃣1️⃣ Send final picks
    const resultEmbed = new EmbedBuilder()
      .setTitle('Civ VII Draft Picks')
      .addFields(
        { name: 'Players',       value: playerTags },
        { name: 'Draft Mode',    value: draftMode,    inline: true },
        { name: 'Starting Age',  value: startingAge,  inline: true }
      )
      .setTimestamp();

    for (const [player, picks] of Object.entries(pools)) {
      const list = picks.map(p => `${p.emoji_ID} ${p.name}`).join('\n') || '—';
      resultEmbed.addFields({ name: player, value: list, inline: true });
    }

    await channel.send({ embeds: [resultEmbed] });

    // 1️⃣2️⃣ Finalize slash reply
    await interaction.editReply({ content: '🎉 Civ VII draft complete!', embeds: [] });
    voteInProgress = false;
    return members;
  },
};
