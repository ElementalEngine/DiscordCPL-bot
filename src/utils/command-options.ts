import {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandUserOption
} from 'discord.js';
import { MAX_MENTIONS } from '../config/constants';

export function addMentionOptions<
  T extends SlashCommandOptionsOnlyBuilder
>(
  builder: T,
  { prefix = 'user', count = MAX_MENTIONS }: { prefix?: string; count?: number } = {}
): T {
  const existing  = builder.options?.length ?? 0;
  const available = 25 - existing;
  const maxPairs  = Math.min(count, Math.floor(available / 2));

  for (let i = 1; i <= maxPairs; i++) {
    const suffix = i === 1 ? '' : String(i);
    for (const action of ['include', 'exclude'] as const) {
      const name = `${action}${prefix}${suffix}`.toLowerCase();
      const verb = action === 'include' ? 'include in' : 'exclude from';
      builder.addUserOption((opt: SlashCommandUserOption) =>
        opt
          .setName(name)
          .setDescription(`User to ${verb} vote${suffix ? ` #${suffix}` : ''}`)
          .setRequired(false)
      );
    }
  }

  return builder;
}
