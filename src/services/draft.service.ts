import {
  ChatInputCommandInteraction,
  GuildMember,
  TextChannel
} from 'discord.js';
import {
  CIV6_VOTE_SETTINGS,
  CIV7_VOTE_SETTINGS,
  VOTE_TIMER_DRAFT
} from '../config';
import { civ7Leaders } from '../data/civ7';
import { collectParticipants } from '../handlers';
import { findGuildEmoji } from './emoji.service';
import { VotingService } from './voting.service';
import { GameType } from '../types/common.types';
import {
  acquireVoteLock,
  releaseVoteLock,
  acquireUserLock,
  releaseUserLock
} from '../utils';

export default class DraftService {
  private voting = new VotingService();

  public async startDraft(
    interaction: ChatInputCommandInteraction,
    game: GameType
  ): Promise<void> {
    if (!acquireVoteLock()) {
      await interaction.reply({
        content: `<@${interaction.user.id}> is already part of an ongoing vote – vote aborted.`,
        ephemeral: true
      });
      return;
    }
    const lockedIds: string[] = [];
    try {
      const guild = interaction.guild;
      const channel = interaction.channel as TextChannel | null;
      if (!guild || !channel) return;

      const participants: GuildMember[] = await collectParticipants(interaction);
      if (participants.length === 0) {
        await interaction.reply({ content: 'No participants found.', ephemeral: true });
        return;
      }

      let blocked: GuildMember | undefined;
      for (const member of participants) {
        if (!acquireUserLock(member.id)) {
          blocked = member;
          break;
        }
        lockedIds.push(member.id);
      }
      if (blocked) {
        lockedIds.forEach(releaseUserLock);
        releaseVoteLock();
        await interaction.reply({
          content: `<@${blocked.id}> is already part of an ongoing vote – vote aborted.`,
          ephemeral: true
        });
        return;
      }

      const settings = game === 'civ6' ? CIV6_VOTE_SETTINGS : CIV7_VOTE_SETTINGS;
      await interaction.reply({ content: 'Draft voting in progress...', ephemeral: true });

      const results: Record<string, string> = {};

      for (const question of Object.keys(settings)) {
        const opts = settings[question];
        let rawOptions: [string, string][] = [];

      if (question === 'Leader Ban' && game === 'civ7') {
        rawOptions = civ7Leaders.map(l => {
          const emoji = findGuildEmoji(guild, l.emoji_ID) ?? l.emoji_ID;
          return [emoji, l.leader];
        });
      } else {
        rawOptions = opts.map(o => [o.emoji, o.label]);
      }

        const result = await this.voting.startVote(
          channel,
          participants,
          rawOptions,
          {
            options: opts,
            timeoutMs: VOTE_TIMER_DRAFT,
            maxVotesPerUser:
              question === 'Leader Ban' && game === 'civ7' ? 20 : 1,
            skipTieBreak: question === 'Leader Ban' && game === 'civ7'
          }
        );

        results[question] = result.winner;
      }

      const summary = Object.keys(results)
        .map(k => `**${k}:** ${results[k]}`)
        .join('\n');

      await channel.send({ content: `Voting complete:\n${summary}` });
    } finally {
      lockedIds.forEach(releaseUserLock);
      releaseVoteLock();
    }
  }
}

