import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { config } from '../../config';
import DraftService from '../../services/draft.service';
import { addMentionOptions } from '../../utils';

const builder = new SlashCommandBuilder()
  .setName('civ6draft')
  .setDescription('Initiate a Civ6 draft vote')
  .addStringOption(option =>
    option
      .setName('gamemode')
      .setDescription('Select game mode: FFA or Team')
      .setRequired(true)
      .addChoices(
        { name: 'ffa',   value: 'ffa'   },
        { name: 'team',  value: 'team'  },
        { name: 'duel',  value: 'duel'  }
      )
  )
  .addStringOption(option =>
    option
      .setName('Blind Mode')
      .setDescription('Draft/Voting iva DMs')
      .setRequired(true)
  );

addMentionOptions(builder as SlashCommandBuilder);

export const data = builder as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  await new DraftService(interaction.client).startDraft(interaction, 'civ6');
}
