import {
  Message,
  GuildMember,
  MessageReaction,
  MessageComponentInteraction,
  ComponentType,
  User
} from 'discord.js';
import {
  VOTE_TIMER_SV,
  VOTE_TIMER_DRAFT,
  VoteSettingOption
} from '../../config/constants';
import { Civ7Leader } from '../../data/civ7';
import { Civ6Leader } from '../../data/civ6';
import {
  pickWinner,
  tallyBans,
  tallyCiv6Bans,
  VoteResult
} from './votes.math';

/* -------------------------------------------------------------------------- */
/*                          Secret Vote interactions                          */
/* -------------------------------------------------------------------------- */

export async function collectSecretDMs(
  dms: { member: GuildMember; dm: Message }[]
): Promise<{ yes: number; no: number }> {
  const votes = { yes: 0, no: 0 };
  await Promise.all(
    dms.map(async ({ dm }) => {
      try {
        const resp = await dm.awaitMessageComponent({ time: VOTE_TIMER_SV });
        votes[resp.customId as 'yes' | 'no']++;
        await dm.edit({ content: `You voted **${resp.customId}**`, embeds: [], components: [] });
      } catch {
        // timeout → default “yes”
        votes.yes++;
      }
    })
  );
  return votes;
}

/* -------------------------------------------------------------------------- */
/*                       Civ VI + Civ VII interactions                        */
/* -------------------------------------------------------------------------- */

export function collectCategoryClicks(
  panel: Message,
  options: VoteSettingOption[],
  threshold: number,
  onUpdate: (winner: { emoji: string; label: string }) => Promise<void>
): Promise<void> {
  return new Promise(resolve => {
    const counts: Record<string, number> = {};
    const collector = panel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: VOTE_TIMER_DRAFT
    });

    collector.on('collect', async (btn: MessageComponentInteraction) => {
      if (btn.user.bot) return;
      const [, label] = btn.customId.split('|');
      counts[label] = (counts[label] || 0) + 1;

      // build VoteResult[] for pickWinner
      const results: VoteResult[] = options.map(o => ({
        label: o.label,
        emoji: o.emoji,
        count: counts[o.label] ?? 0
      }));

      const win = pickWinner(results, threshold);
      await onUpdate({ emoji: win.emoji, label: win.label });
      await btn.deferUpdate();
    });

    collector.on('end', () => resolve());
  });
}

export function collectBanReactions<T extends Civ7Leader | Civ6Leader>(
  banMsg: Message,
  leaders: T[],
  threshold: number,
  onUpdate: (banned: string[]) => Promise<void>
): Promise<void> {
  return new Promise(resolve => {
    const collector = banMsg.createReactionCollector({
      time: VOTE_TIMER_DRAFT,
      filter: (reaction: MessageReaction, user: User) =>
        !user.bot && leaders.some(l => l.emoji_ID === reaction.emoji.id)
    });

    collector.on('collect', async () => {
      // choose which tally function to use
      const bannedList =
        (leaders[0] as any).emoji_ID && (leaders[0] as Civ7Leader).leader
          ? tallyBans(banMsg.reactions.cache, (leaders as Civ7Leader[]), threshold)
          : tallyCiv6Bans(banMsg.reactions.cache, (leaders as Civ6Leader[]), threshold);

      await onUpdate(bannedList);
    });

    collector.on('end', () => resolve());
  });
}

export function collectFinishClicks(
  finishMsg: Message,
  members: GuildMember[],
  onUpdate: (remaining: GuildMember[]) => Promise<void>
): Promise<void> {
  return new Promise(resolve => {
    const remaining = new Set(members.map(m => m.id));
    const collector = finishMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: VOTE_TIMER_DRAFT
    });

    collector.on('collect', async (btn: MessageComponentInteraction) => {
      if (btn.user.bot) return;
      if (remaining.delete(btn.user.id)) {
        await onUpdate(members.filter(m => remaining.has(m.id)));
      }
      await btn.deferUpdate();
      if (remaining.size === 0) collector.stop();
    });

    collector.on('end', () => resolve());
  });
}