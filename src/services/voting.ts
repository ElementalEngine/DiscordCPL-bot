import { ID, VoteSession, VoteChoice, VoteSettingOption, DraftMode } from '../types/service';
import {
  CIV6_VOTE_FFA,
  CIV6_VOTE_TEAM,
  CIV6_DEFAULT_VOTE_SETTINGS,
  CIV7_VOTE_FFA,
  CIV7_VOTE_TEAM,
  CIV7_DEFAULT_VOTE_SETTINGS,
} from '../config/voting.config';

/**
 * In-memory vote session storage
 */
const voteSessions: Map<ID, VoteSession> = new Map();

export class VotingService {
  /**
   * Start a new vote
   */
  static startVote(
    eventKey: string,
    options: string[],
    totalVoters: ID[]
  ): ID {
    const voteId = crypto.randomUUID();
    const session: VoteSession = { eventKey, options, votes: [], isActive: true, totalVoters };
    voteSessions.set(voteId, session);
    return voteId;
  }

  /**
   * Cast or update a user's vote
   */
  static castVote(
    voteId: ID,
    userId: ID,
    choice: string
  ): void {
    const sess = voteSessions.get(voteId);
    if (!sess || !sess.isActive) throw new Error('Vote not active');
    if (!sess.options.includes(choice)) throw new Error('Invalid choice');
    sess.votes = sess.votes.filter(v => v.userId !== userId);
    sess.votes.push({ userId, choice });
  }

  /**
   * Check for majority or completion, finalize if met
   */
  static finalizeIfNeeded(
    voteId: ID
  ): { passed: boolean; winner?: string; winners?: string[] } | null {
    const sess = voteSessions.get(voteId);
    if (!sess) throw new Error('Vote not found');

    const counts = sess.votes.reduce((acc, v) => {
      acc[v.choice] = (acc[v.choice] || 0) + 1; return acc;
    }, {} as Record<string, number>);

    const total = sess.totalVoters.length;
    const cast = sess.votes.length;
    const needed = Math.floor(total / 2) + 1;

    // Settings polls: single-winner logic
    if (sess.eventKey === 'CIV6_SETTINGS' || sess.eventKey === 'CIV7_SETTINGS') {
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const top = sorted[0]?.[1] ?? 0;
      const second = sorted[1]?.[1] ?? 0;
      const remaining = total - cast;
      if (remaining > 0 && top > second + remaining) {
        sess.isActive = false;
        return { passed: true, winner: sorted[0][0] };
      }
      if (top >= needed || cast === total) {
        sess.isActive = false;
        const topOptions = sorted.filter(([_, c]) => c === top).map(([o]) => o);
        const winner = topOptions.length > 1
          ? topOptions[Math.floor(Math.random() * topOptions.length)]
          : topOptions[0];
        return { passed: true, winner };
      }
      return null;
    }

    // Leader bans: multi-winner when majority reached
    const banned = sess.options.filter(opt => (counts[opt] || 0) >= needed);
    if (banned.length > 0) {
      sess.isActive = false;
      return { passed: true, winners: banned };
    }
    return null;
  }

  /**
   * Cancel a vote session
   */
  static clearVote(voteId: ID): void {
    voteSessions.delete(voteId);
  }
}

/**
 * Helper to retrieve vote settings by version & mode
 */
export class VotingConfigService {
  static getOptions(
    civVersion: 'civ6' | 'civ7',
    mode: 'ffa' | 'team' | 'duel'
  ): Record<string, VoteSettingOption[]> {
    return civVersion === 'civ6'
      ? (mode === 'team' ? CIV6_VOTE_TEAM : CIV6_VOTE_FFA)
      : (mode === 'team' ? CIV7_VOTE_TEAM : CIV7_VOTE_FFA);
  }

  static getDefaults(civVersion: 'civ6' | 'civ7'): Record<string, string> {
    return civVersion === 'civ6'
      ? CIV6_DEFAULT_VOTE_SETTINGS
      : CIV7_DEFAULT_VOTE_SETTINGS;
  }
}