import {
  GuildMember,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} from 'discord.js';

import { VoteSettings, VoteResult } from '../types/common.types';

import { parseVoteOptions, pickVoteWinner } from '../utils/voting';
import { EMOJI_FINISHED } from '../config/constants';
import { withVoteSetupLock } from '../utils';

export class VotingService {

  async startVote(
    channel: TextChannel,
    members: GuildMember[],
    rawOptions: [string, string][],
    settings: VoteSettings
  ): Promise<VoteResult> {
    return withVoteSetupLock(async () => {
      let message: any;
    const voteOptions = parseVoteOptions(rawOptions);

    const optionButtons = voteOptions.map((opt, idx) =>
      new ButtonBuilder()
        .setCustomId(`vote_${idx}`)
        .setEmoji(opt.emoji)
        .setLabel(opt.label)
        .setStyle(ButtonStyle.Secondary)
    );

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < optionButtons.length; i += 5) {
      rows.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...optionButtons.slice(i, i + 5)
        )
      );
    }

    const finishRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('finish')
        .setEmoji(EMOJI_FINISHED)
        .setLabel('Finish')
        .setStyle(ButtonStyle.Success)
    );
    rows.push(finishRow);

    message = await channel.send({
      content: `Voting started. Use the buttons below to vote.`,
      components: rows,
    });

    try {

      const votes = new Map<string, string>();
      const finished = new Set<string>();

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: settings.timeoutMs ?? 120000,
    });

      collector.on('collect', async i => {
        if (!members.some(m => m.id === i.user.id)) {
          await i.reply({ content: 'You are not part of this vote.', ephemeral: true });
          return;
        }

      if (i.customId === 'finish') {
        finished.add(i.user.id);
        await i.reply({ content: 'Vote recorded.', ephemeral: true });
        if (finished.size === members.length) collector.stop('finished');
        return;
      }

      const index = Number(i.customId.split('_')[1]);
      const choice = voteOptions[index];
      if (choice) {
        votes.set(i.user.id, choice.label);
      }
      await i.deferUpdate();
      });

      await new Promise(resolve => collector.once('end', resolve));

      const tally: Record<string, number> = {};
      for (const opt of voteOptions) tally[opt.label] = 0;
      for (const vote of votes.values()) {
        tally[vote] = (tally[vote] ?? 0) + 1;
      }

      const winner = pickVoteWinner(tally);

      return { winner, tally };
    } finally {
      await message.edit({ components: [] }).catch(() => {});
    }
    });
  }
}
