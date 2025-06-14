import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { config } from '../../config';

export const data = new SlashCommandBuilder()
  .setName('lobbylink')
  .setDescription('Send a link to the current lobby')
  .addStringOption((opt) =>
    opt
      .setName('steamlink')
      .setDescription('Steam lobby link (steam://joinlobby/...)')
      .setRequired(true)
  )
  .addStringOption((opt) =>
    opt.setName('hostrules').setDescription('Include host rules')
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const steamlink = interaction.options.getString('steamlink', true);
  if (!steamlink.startsWith('steam://joinlobby/')) {
    await interaction.reply({
      content: 'Invalid lobby link. It must start with `steam://joinlobby/`.',
      ephemeral: true,
    });
    return;
  }

  // Convert to HTTP proxy URL
  const payload = steamlink.slice('steam://joinlobby/'.length);
  const link = `http://${config.host}:${config.port}/join/${payload}`;

  const embed = new EmbedBuilder()
    .setTitle(`Join ${interaction.user.username}'s Lobby`)
    .setDescription(`[Steam Lobby Link](${link})`)
    .setURL(link)
    .setColor(0x00ff00);

  const hostrules = interaction.options.getString('hostrules');
  if (hostrules) {
    embed.addFields({ name: 'Host Rules', value: hostrules });
  }

  const channel = interaction.channel;
  if (channel?.isTextBased() && 'send' in channel) {
    channel.send({ embeds: [embed] });
  }

  await interaction.reply({ content: 'Lobby link sent!', ephemeral: true });
  await interaction.deleteReply();
};
