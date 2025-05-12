import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  GuildMember,
  Message
} from 'discord.js';
import {
  EMOJI_SPY,
  EMOJI_QUESTION,
  EMOJI_ID,
  EMOJI_PARTICIPANTS,
  EMOJI_YES,
  EMOJI_NO,
  EMOJI_RESULTS
} from '../config/constants';

export function buildStartEmbed(voteId: string, question: string, mentions: string) {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_QUESTION} Question`,   value: question },
      { name: `${EMOJI_ID} Vote ID`,           value: voteId   },
    )
    .setDescription(`${EMOJI_PARTICIPANTS} Participants: ${mentions}`)
    .setTimestamp();
}

export function buildDmEmbed(voteId: string, question: string) {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_QUESTION} Question`, value: question },
      { name: `${EMOJI_ID} Vote ID`,       value: voteId   },
    )
    .setTimestamp();
}

export function buildResultEmbed(voteId: string, mentions: string, votes: {yes: number, no: number}) {
  return new EmbedBuilder()
    .setTitle(`${EMOJI_SPY} Secret Vote Results ${EMOJI_SPY}`)
    .addFields(
      { name: `${EMOJI_ID} Vote ID`,              value: voteId    },
      { name: `${EMOJI_PARTICIPANTS} Participants`, value: mentions },
      {
        name: `${EMOJI_RESULTS} Results`,
        value: `${EMOJI_YES} Yes\n${votes.yes}\n${EMOJI_NO} No\n${votes.no}`,
      }
    )
    .setTimestamp();
}

export function createYesNoRow() {
  const yesBtn = new ButtonBuilder()
    .setCustomId('yes')
    .setLabel('Yes')
    .setEmoji(EMOJI_YES)
    .setStyle(ButtonStyle.Secondary);

  const noBtn = new ButtonBuilder()
    .setCustomId('no')
    .setLabel('No')
    .setEmoji(EMOJI_NO)
    .setStyle(ButtonStyle.Secondary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(yesBtn, noBtn);
}

export async function dmAllParticipants(
  members: GuildMember[],
  dmEmbed: EmbedBuilder,
  row: ActionRowBuilder<ButtonBuilder>
): Promise<{ dmResults: {member: GuildMember; dm: Message}[]; unreachable: GuildMember[] }> {
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

  return { dmResults, unreachable };
}

export async function collectVotes(
  dmResults: { member: GuildMember; dm: Message }[],
  timeout: number
): Promise<{ yes: number; no: number }> {
  const votes = { yes: 0, no: 0 };

  await Promise.all(
    dmResults.map(async ({ dm }) => {
      try {
        const resp = await dm.awaitMessageComponent({ time: timeout });
        votes[resp.customId as 'yes' | 'no']++;
        await dm.edit({ content: `You voted **${resp.customId}**`, embeds: [], components: [] });
      } catch {
        votes.yes++;
      }
    })
  );

  return votes;
}
