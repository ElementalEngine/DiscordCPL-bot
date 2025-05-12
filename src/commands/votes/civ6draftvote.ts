import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ensurePermissions, ensureChannel } from '../../services/commandGuards.service';
import { VoteService } from '../../services/vote.service';
import { config } from '../../config';
import { addOptionalMentions } from '../../utils';

export const data = addOptionalMentions(
  new SlashCommandBuilder()
    .setName('civ6draft')
    .setDescription('Start a Civ 6 draft vote')
    .addStringOption((opt) =>
      opt
        .setName('gamemode')
        .setDescription('Select game mode: FFA, Duel, 2v2 or Team')
        .setRequired(true)
        .addChoices(
          { name: 'FFA',  value: 'ffa' },
          { name: 'Duel', value: 'duel' },
          { name: '2v2',  value: '2v2' },
          { name: 'Team', value: 'team' },
        )
    )
    .addStringOption((opt) =>
      opt
        .setName('params')
        .setDescription('Optional parameters (e.g. exclusions)')
        .setRequired(false)
    ) as SlashCommandBuilder
);

export const execute = async (interaction: ChatInputCommandInteraction) => {

  if (!ensurePermissions(interaction, [config.discord.roles.Civ6Rank])) return;


  const mode = interaction.options.getString('gamemode', true);
  const channelMap: Record<string, string> = {
    ffa:  config.discord.channels.civ6ffavoting,
    duel: config.discord.channels.civ6teamvoting,
    '2v2': config.discord.channels.civ6teamvoting,
    team: config.discord.channels.civ6teamvoting,
  };
  if (!ensureChannel(interaction, [channelMap[mode]])) return;

  // await VoteService.civilization6DraftVote(interaction);
  // (interaction);
};
