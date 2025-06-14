import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { config } from '../../config';
import { collectParticipants } from '../../handlers';      
import { addMentionOptions, shuffleArray } from '../../utils';

export const data = addMentionOptions(
  new SlashCommandBuilder()
    .setName('teamgen')
    .setDescription('Send a randomly generated team suggestion')
);

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const members = await collectParticipants(interaction);

  if (members.length < 2) {
    await interaction.reply({
      content: 'You need at least two participants (voice channel or @mentions).',
      ephemeral: true,
    });
    return;
  }

  if (members.length % 2 !== 0) {
    await interaction.reply({
      content: 'Cannot split an odd number of players into two even teams. Please add or remove one participant.',
      ephemeral: true,
    });
    return;
  }

  const shuffled = shuffleArray(members);
  const half     = members.length / 2;
  const team1    = shuffled.slice(0, half);
  const team2    = shuffled.slice(half);

  const embed = new EmbedBuilder()
    .setTitle('Team Generator')
    .setColor(0x006dff)
    .addFields(
      { name: 'Team 1', value: team1.map(m => m.user.tag).join('\n'), inline: true },
      { name: 'Team 2', value: team2.map(m => m.user.tag).join('\n'), inline: true }
    );

  await interaction.reply({ embeds: [embed] });
};
