import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { config } from '../config';

const commands: any[] = [];
const commandsPath = path.join(__dirname, '../commands');
const entries = fs.readdirSync(commandsPath, { withFileTypes: true });

for (const entry of entries) {
  const fullPath = path.join(commandsPath, entry.name);

  if (entry.isDirectory()) {
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  } else if (entry.isFile() && entry.name.endsWith('.ts')) {
    const command = require(fullPath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(config.discord.token);

export const deploy = async () => {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        config.discord.clientId,
        config.discord.guildId
      ),
      { body: commands }
    );
    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
};

/// testing webhook