import { Events } from 'discord.js'

export const name = Events.InteractionCreate
const test = Events.MessageCreate

export const execute = async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return
  const command = interaction.client.commands.get(interaction.commandName)

  if (!command)
    return console.error(
      `No command matching ${interaction.commandName} was found.`
    )

  await command.execute(interaction).catch((error: any) => {
    console.error(`Error executing ${interaction.commandName}`)
    console.error(error)
  })
}
