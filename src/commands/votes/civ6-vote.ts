import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel
} from 'discord.js';
import { addMentionOptions }                  from '../../utils';
import { collectParticipants }                from '../../handlers';
import { VotingConfigService, VotingService } from '../../services';
import { DraftService }                       from '../../services';
import { buildSettingsVoteEmbed }             from '../../ui';
import { buildSettingsVoteButtons }           from '../../ui';
import crypto                                  from 'crypto';

export const data = new SlashCommandBuilder()
  .setName('civ6draft')
  .setDescription('Initiate a Civ6 draft vote')
  .addStringOption(opt =>
    opt
      .setName('gamemode')
      .setDescription('Select game mode: ffa, team, or duel')
      .setRequired(true)
      .addChoices(
        { name: 'ffa',  value: 'ffa'  },
        { name: 'team', value: 'team' },
        { name: 'duel', value: 'duel' },
      )
  )
  .addBooleanOption(opt =>
    opt
      .setName('blind_mode')
      .setDescription('Enable blind voting via DM')
      .setRequired(false)
  );

addMentionOptions(data);

export async function execute(interaction: ChatInputCommandInteraction) {
  // 1) Gather participants
  const members = await collectParticipants(interaction);
  const players = members.map(m => m.id);

  // 2) Validate mode & counts
  const mode = interaction.options.getString('gamemode', true) as 'ffa'|'team'|'duel';
  if (mode === 'duel' && players.length !== 2) {
    return interaction.reply({ content: '❌ Duel requires exactly 2 players.', ephemeral: true });
  }
  if (mode === 'ffa' && players.length < 3) {
    return interaction.reply({ content: '❌ FFA requires at least 3 players.', ephemeral: true });
  }
  if (mode === 'team' && players.length < 4) {
    return interaction.reply({ content: '❌ Team requires at least 4 players.', ephemeral: true });
  }

  // 3) Start draft session (Civ6 has no second phase)
  const draftId = crypto.randomUUID();
  DraftService.createDraft(draftId, players, 'civ6');

  // 4) Load vote settings & defaults
  const settings = VotingConfigService.getOptions('civ6', mode);
  const defaults = VotingConfigService.getDefaults('civ6');

  // 5) Initialize vote session
  const voteId = VotingService.startVote('CIV6_SETTINGS', Object.keys(settings), players);

  // 6) Build & send UI
  const embed      = buildSettingsVoteEmbed('Civ6 Game Settings Vote', settings, defaults);
  const components = buildSettingsVoteButtons(settings);

  const channel = interaction.channel as TextChannel;
  await channel.send({ embeds: [embed], components });

  await interaction.reply({ content: '✅ Civ6 vote started!', ephemeral: true });
}
