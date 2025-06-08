import { Guild, User, Client } from 'discord.js';

export function extractIdFromMention(mention: string): string | null {
  const match = mention.match(/^<@!?(\d+)>$/);
  return match ? match[1] : null;
}

export async function fetchMemberByIdOrMention(
  guild: Guild,
  mentionOrId: string
): Promise<string | null> {
  const id = extractIdFromMention(mentionOrId) ?? mentionOrId;
  try {
    await guild.members.fetch(id);
    return id;
  } catch {
    return null;
  }
}

export async function fetchUserByIdOrMention(
  client: Client,
  mentionOrId: string
): Promise<string | null> {
  const id = extractIdFromMention(mentionOrId) ?? mentionOrId;
  try {
    await client.users.fetch(id);
    return id;
  } catch {
    return null;
  }
}

export function formatSnowflake(id: string): string {
  return id.replace(/(\d{4})(?=\d)/g, '$1-');
}
