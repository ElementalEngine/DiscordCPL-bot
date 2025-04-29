import {
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';
import { getUsersInVoiceChannel } from './voice.handler';
import { toggleMentionedUsers } from './mentions.handler';


export async function collectParticipants(
  interaction: ChatInputCommandInteraction
): Promise<GuildMember[]> {
  const voiceMembers = await getUsersInVoiceChannel(interaction);

  const originalVoiceIds = new Set(voiceMembers.map(m => m.id));

  let members = await toggleMentionedUsers(interaction, [...voiceMembers]);

  const invokerId = interaction.user.id;
  if (
    !originalVoiceIds.has(invokerId) &&                       
    !members.some(m => m.id === invokerId)                   
  ) {
    const invoker = interaction.guild?.members.cache.get(invokerId);
    if (invoker) members.push(invoker);
  }

  return members;
}