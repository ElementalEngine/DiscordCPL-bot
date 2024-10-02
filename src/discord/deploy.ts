import { REST, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'

import { config } from '../config'

const commands: any = []
const foldersPath = path.join(__dirname, '../commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }
}

const rest = new REST().setToken(config.discord.token)

export const deploy = async () => {
  console.log(`Started refreshing ${commands.length} application (/) commands.`)
  rest
    .put(
      Routes.applicationGuildCommands(
        config.discord.clientId,
        config.discord.guildId
      ),
      { body: commands }
    )
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}
