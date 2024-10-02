import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { config } from '../../config'
import { VoteController } from '../../controllers'
import { addOptionalMentions } from '../../utils'

export const data = addOptionalMentions(
  //  @ts-ignore
  new SlashCommandBuilder()
    .setName('secretvote')
    .setDescription('Initiate a secret vote')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Choose type of vote options: cc, scrap, irrel, remap')
        .setRequired(true)
        .addChoices(
          { name: 'CC', value: 'cc' },
          { name: 'Scrap', value: 'scrap' },
          { name: 'Irrel', value: 'irrel' },
          { name: 'Remap', value: 'remap' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('params')
        .setDescription('Some vote options here...')
        .setRequired(true)
    )
)

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await VoteController.secretVote(interaction)
}
