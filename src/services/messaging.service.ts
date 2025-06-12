import { Client, User, TextChannel, MessagePayload } from 'discord.js';

export async function sendDirectMessage(
  user: User,
  content: string | MessagePayload
): Promise<boolean> {
  try {
    await user.send(content as any);
    return true;
  } catch {
    return false;
  }
}

export async function sendToChannel(
  client: Client,
  channelId: string,
  content: string | MessagePayload
): Promise<boolean> {
  try {
    const raw = await client.channels.fetch(channelId);
    if (!raw || !raw.isTextBased()) return false;
    const channel = raw as TextChannel;
    await channel.send(content as any);
    return true;
  } catch {
    return false;
  }
}
