import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { config } from '../../config';
import DraftService from '../../services/draft.service';
import { addMentionOptions } from '../../utils';

const builder = new SlashCommandBuilder()
  .setName('civ7draft')
  .setDescription('Initiate a Civ7 draft vote')
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
      .setName('startingage')
      .setDescription('Select starting age')
      .setRequired(true)
      .addChoices(
        { name: 'Antiquity',   value: 'Antiquity_Age'    },
        { name: 'Exploration', value: 'Exploration_Age'  },
        { name: 'Modern',      value: 'Modern_Age'       }
      )
  )
  .addStringOption(option =>
    option
      .setName('Blind Mode')
      .setDescription('Draft/Vote iva DMs')
      .setRequired(true)
  );

addMentionOptions(builder as SlashCommandBuilder);

export const data = builder as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  await new DraftService(interaction.client).startDraft(interaction, 'civ7');
}
