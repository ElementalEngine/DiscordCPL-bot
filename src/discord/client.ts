import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { deploy } from './deploy';

const client: any = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Load commands dynamically from both files and folders
client.commands = new Collection<string, { data: any; execute: any }>();
const commandsPath = path.join(__dirname, '../commands');
const entries = fs.readdirSync(commandsPath, { withFileTypes: true });

for (const entry of entries) {
  const fullPath = path.join(commandsPath, entry.name);

  if (entry.isDirectory()) {
    // Subdirectory: load each .ts file
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const { data, execute } = require(path.join(fullPath, file));
      if (data && execute) {
        client.commands.set(data.name, { data, execute });
      }
    }
  } else if (entry.isFile() && entry.name.endsWith('.ts')) {
    // Top-level .ts file
    const { data, execute } = require(fullPath);
    if (data && execute) {
      client.commands.set(data.name, { data, execute });
    }
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.ts'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
}

deploy();

export default client;
