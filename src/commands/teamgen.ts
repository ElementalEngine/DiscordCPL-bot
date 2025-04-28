import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { ensureChannel } from '../services/commandGuards.service';
import { config } from '../config';
import { toggleMentionedUsers } from '../handlers/mentions.handler';
import { getUsersInVoiceChannel } from '../handlers/voice.handler';
import { addOptionalMentions, shuffleArray } from '../utils';

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('teamgen')
    .setDescription('Send a randomly generated team suggestion')
);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (
    !ensureChannel(interaction, [
      config.discord.channels.civ6commands,
      config.discord.channels.civ7commands,
    ])
  )
    return;

  let members = await getUsersInVoiceChannel(interaction);
  members     = await toggleMentionedUsers(interaction, members);

  if (members.length < 2) {
    await interaction.reply({
      content: 'You cannot generate teams with less than 2 players.',
      ephemeral: true,
    });
    return;
  }

  const shuffled = shuffleArray(members);
  const mid      = Math.ceil(shuffled.length / 2);
  const team1    = shuffled.slice(0, mid);
  const team2    = shuffled.slice(mid);

  const embed = new EmbedBuilder()
    .setTitle('Team Generator')
    .setColor(0x006dff)
    .addFields(
      { name: 'Team 1', value: team1.map(m => m.user.tag).join('\n'), inline: true },
      { name: 'Team 2', value: team2.map(m => m.user.tag).join('\n'), inline: true }
    );

  const channel = interaction.channel;
  if (channel?.isTextBased() && 'send' in channel) {
    channel.send({ embeds: [embed] });
  }

  await interaction.reply({ content: 'Teams generated!', ephemeral: true });
};
