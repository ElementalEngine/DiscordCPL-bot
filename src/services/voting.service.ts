import {
  GuildMember,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction
} from 'discord.js';

import { VoteSettings, VoteResult } from '../types/common.types';

import { parseVoteOptions, pickVoteWinner } from '../utils/voting';
import { EMOJI_FINISHED } from '../config/constants';
import { withVoteSetupLock } from '../utils';

export class VotingService {

  private blindMode = false;

  enableBlindMode() {
    this.blindMode = true;
  }

  disableBlindMode() {
    this.blindMode = false;
  }

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

    const disabledRows: ActionRowBuilder<ButtonBuilder>[] = rows.map(row => {
      const r = new ActionRowBuilder<ButtonBuilder>();
      for (const c of row.components as ButtonBuilder[]) {
        r.addComponents(ButtonBuilder.from(c).setDisabled(true));
      }
      return r;
    });

    message = await channel.send({
      content: `Voting started. Use the buttons below to vote.` +
        (this.blindMode ? ' Check your DMs to participate.' : ''),
      components: this.blindMode ? disabledRows : rows,
    });

    try {

      const votes = new Map<string, Set<string>>();
      const finished = new Set<string>();

    if (this.blindMode) {
      await Promise.all(
        members.map(async member => {
          const dm = await member.createDM();
          const dmMessage = await dm.send({
            content: `Voting started in **${channel.name}**. Use the buttons below to vote.`,
            components: rows,
          });

          const dmCollector = dmMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: settings.timeoutMs ?? 120000,
          });

          dmCollector.on('collect', async (i: ButtonInteraction) => {
            if (i.user.id !== member.id) {
              await i.reply({ content: 'You are not part of this vote.', ephemeral: true });
              return;
            }

            if (i.customId === 'finish') {
              finished.add(i.user.id);
              await i.reply({ content: 'Vote recorded.', ephemeral: true });
              dmCollector.stop();
              return;
            }

            const index = Number(i.customId.split('_')[1]);
            const choice = voteOptions[index];
            if (choice) {
              const maxVotes = settings.maxVotesPerUser ?? 1;
              const userVotes = votes.get(i.user.id) ?? new Set<string>();
              if (userVotes.has(choice.label)) {
                await i.reply({ content: 'You already voted for this option.', ephemeral: true });
                return;
              }
              if (userVotes.size >= maxVotes) {
                await i.reply({ content: 'You have no votes remaining for this category.', ephemeral: true });
                return;
              }
              userVotes.add(choice.label);
              votes.set(i.user.id, userVotes);
              await i.reply({ content: 'Vote recorded.', ephemeral: true });
            } else {
              await i.deferUpdate();
            }
          });

          await new Promise(resolve => dmCollector.once('end', resolve));
          await dmMessage.edit({ components: [] }).catch(() => {});
        })
      );
    } else {
      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: settings.timeoutMs ?? 120000,
      });

      collector.on('collect', async (i: ButtonInteraction) => {
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
          const maxVotes = settings.maxVotesPerUser ?? 1;
          const userVotes = votes.get(i.user.id) ?? new Set<string>();
          if (userVotes.has(choice.label)) {
            await i.reply({ content: 'You already voted for this option.', ephemeral: true });
            return;
          }
          if (userVotes.size >= maxVotes) {
            await i.reply({ content: 'You have no votes remaining for this category.', ephemeral: true });
            return;
          }
          userVotes.add(choice.label);
          votes.set(i.user.id, userVotes);
          await i.reply({ content: 'Vote recorded.', ephemeral: true });
        } else {
          await i.deferUpdate();
        }
      });

      await new Promise(resolve => collector.once('end', resolve));
    }

      const tally: Record<string, number> = {};
      for (const opt of voteOptions) tally[opt.label] = 0;
      for (const voteSet of votes.values()) {
        for (const vote of voteSet) {
          tally[vote] = (tally[vote] ?? 0) + 1;
        }
      }

      const winner = pickVoteWinner(tally, !(settings.skipTieBreak));

      return { winner, tally };
    } finally {
      await message.edit({ components: [] }).catch(() => {});
    }
    });
  }
}
