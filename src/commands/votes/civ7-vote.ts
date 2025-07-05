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
import { AgePool }                            from '../../types/service';
import crypto                                 from 'crypto';

export const data = new SlashCommandBuilder()
  .setName('civ7-vote')
  .setDescription('Initiate a Civ7 draft vote')
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
  .addStringOption(opt =>
    opt
      .setName('startingage')
      .setDescription('Select starting age')
      .setRequired(true)
      .addChoices(
        { name: 'Antiquity',   value: 'Antiquity_Age'    },
        { name: 'Exploration', value: 'Exploration_Age'  },
        { name: 'Modern',      value: 'Modern_Age'       },
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
  // 1) Participants
  const members = await collectParticipants(interaction);
  const players = members.map(m => m.id);

  // 2) Validate counts
  const mode     = interaction.options.getString('gamemode', true) as 'ffa'|'team'|'duel';
  const startAge = interaction.options.getString('startingage', true) as AgePool;
  if (mode === 'duel' && players.length !== 2) {
    return interaction.reply({ content: '❌ Duel requires exactly 2 players.', ephemeral: true });
  }
  if (mode === 'ffa' && players.length < 3) {
    return interaction.reply({ content: '❌ FFA requires at least 3 players.', ephemeral: true });
  }
  if (mode === 'team' && players.length < 4) {
    return interaction.reply({ content: '❌ Team requires at least 4 players.', ephemeral: true });
  }

  // 3) Start two-phase draft session
  const draftId = crypto.randomUUID();
  DraftService.createDraft(draftId, players, 'civ7', startAge);

  // 4) Load vote settings & defaults
  const settings = VotingConfigService.getOptions('civ7', mode);
  const defaults = VotingConfigService.getDefaults('civ7');

  // 5) Kick off vote
  const voteId = VotingService.startVote('CIV7_SETTINGS', Object.keys(settings), players);

  // 6) Send UI
  const embed      = buildSettingsVoteEmbed('Civ7 Game Settings Vote', settings, defaults);
  const components = buildSettingsVoteButtons(settings);

  const channel = interaction.channel as TextChannel;
  await channel.send({ embeds: [embed], components });

  await interaction.reply({ content: '✅ Civ7 vote started!', ephemeral: true });
}
