import { SlashCommandBuilder, SlashCommandUserOption } from 'discord.js'

import { MAX_MENTIONS } from '../config'

export const addOptionalMentions = (
  data: SlashCommandBuilder,
  count: number = MAX_MENTIONS
) => {
  for (let i = 0; i < count; i++) {
    data.addUserOption((option: SlashCommandUserOption) =>
      option
        .setName(i === 0 ? `user` : `user${Number(i) + 1}`)
        .setDescription('The user to ping')
    )
  }
  return data
}
