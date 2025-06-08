import { Guild, Snowflake, Collection } from 'discord.js';

export function findGuildEmoji(guild: Guild, nameOrId: string): string | null {
  const emoji = guild.emojis.cache.get(nameOrId as Snowflake) ??
                guild.emojis.cache.find((e) => e.name === nameOrId);
  return emoji ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : null;
}

export function listEmojiNameToIdMap(guild: Guild): Collection<string, Snowflake> {
  return guild.emojis.cache.reduce((map, e) => {
    map.set(e.name || '', e.id);
    return map;
  }, new Collection<string, Snowflake>());
}
