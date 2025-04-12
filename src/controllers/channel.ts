import { CommandInteraction } from 'discord.js';

export const ChannelController = {
  isChannel: (interaction: CommandInteraction, channelId: string): boolean => {
    return interaction.channel?.id === channelId;
  },
};
