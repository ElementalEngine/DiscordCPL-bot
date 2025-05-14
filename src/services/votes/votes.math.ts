import { Collection, MessageReaction } from 'discord.js';
import { VoteSettingOption }          from '../../config/constants';
import { Civ7Leader }                 from '../../data/civ7';
import { Civ6Leader }                 from '../../data/civ6';

export interface VoteResult {
  label: string;
  emoji: string;
  count: number;
}

export function countOptions(
  reactions: Collection<string, MessageReaction>,
  options: VoteSettingOption[]
): VoteResult[] {
  return options.map(opt => {
    const react = reactions.get(opt.emoji);
    const raw   = react?.count ?? 0;
    const count = Math.max(raw - 1, 0);
    return { label: opt.label, emoji: opt.emoji, count };
  });
}

export function pickWinner(
  results: VoteResult[],
  threshold: number
): VoteResult {
  // 1) majority winners
  const majority = results.filter(r => r.count >= threshold);
  if (majority.length === 1) return majority[0];

  // 2) find highest count
  const maxCount = Math.max(...results.map(r => r.count));
  const top      = results.filter(r => r.count === maxCount);

  // 3) if tie, choose randomly
  return top[Math.floor(Math.random() * top.length)];
}

export function tallyCategory(
  reactions: Collection<string, MessageReaction>,
  options: VoteSettingOption[],
  threshold: number
): string {
  const counts = countOptions(reactions, options);
  const win    = pickWinner(counts, threshold);
  return `${win.emoji} ${win.label}`;
}

export function tallyBans(
  reactions: Collection<string, MessageReaction>,
  leaders: Civ7Leader[],
  threshold: number
): string[] {
  return leaders
    .filter(l => {
      const raw   = reactions.get(l.emoji_ID)?.count ?? 0;
      const count = Math.max(raw - 1, 0);
      return count >= threshold;
    })
    .map(l => `<:${l.leader}:${l.emoji_ID}> ${l.leader}`);
}


export function tallyCiv6Bans(
  reactions: Collection<string, MessageReaction>,
  leaders: Civ6Leader[],
  threshold: number
): string[] {
  return leaders
    .filter(l => {
      const raw   = reactions.get(l.emoji_ID)?.count ?? 0;
      const count = Math.max(raw - 1, 0);
      return count >= threshold;
    })
    .map(l => `<:${l.leader}:${l.emoji_ID}> ${l.leader}`);
}
