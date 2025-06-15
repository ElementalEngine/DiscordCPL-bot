import { EmbedBuilder, ColorResolvable } from 'discord.js';
import {
  EMOJI_PARTICIPANTS,
  EMOJI_ID,
  EMOJI_WAITINGVOTES,
} from '../config/constants';
import { createBaseEmbed } from './embeds';

export interface VoteEmbedData {
  title: string;
  participants: string[];
  voteId: string;
  options: Record<string, string>;
  defaults: Record<string, string>;
  banned: string[];
  waitingFor: string[];
  status: string;
  timeRemaining: string;
  botName?: string;
  color?: ColorResolvable;
}

export function createVoteEmbed(data: VoteEmbedData): EmbedBuilder {
  const embed = createBaseEmbed(data.botName, data.color).setTitle(data.title);

  if (data.participants.length) {
    embed.addFields({
      name: `${EMOJI_PARTICIPANTS} Participants`,
      value: data.participants.join(' '),
    });
  }

  embed.addFields({ name: `${EMOJI_ID} Vote ID`, value: data.voteId });

  if (Object.keys(data.options).length) {
    const opts = Object.entries(data.options)
      .map(([k, v]) => `**${k}:** ${v}`)
      .join('\n');
    embed.addFields({ name: 'Vote Options', value: opts });
  }

  if (Object.keys(data.defaults).length) {
    const defs = Object.entries(data.defaults)
      .map(([k, v]) => `**${k}:** ${v}`)
      .join('\n');
    embed.addFields({ name: 'Default Settings', value: defs });
  }

  if (data.banned.length) {
    embed.addFields({ name: 'Leader Ban', value: data.banned.join(', ') });
  }

  if (data.waitingFor.length) {
    embed.addFields({
      name: `${EMOJI_WAITINGVOTES} Waiting For`,
      value: data.waitingFor.join(' '),
    });
  }

  embed.setFooter({
    text: `Status: ${data.status} • Time Remaining: ${data.timeRemaining}`,
  });

  return embed;
}
