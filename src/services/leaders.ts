import { getLeadersConfig } from '../config/leaders.config';
import { LeaderConfig, SessionLeaderState } from '../types/service';
import { ID } from '../types/common';

const sessionLeaders: Map<ID, SessionLeaderState> = new Map();

export class LeadersService {
  static initSession(draftId: ID, version: 'civ6' | 'civ7') {
    sessionLeaders.set(draftId, { version, banned: new Set(), picked: new Set() });
  }

  static findByName(name: string, version?: 'civ6' | 'civ7'): LeaderConfig | null {
    const key = name.trim().toLowerCase();
    const all = version
      ? getLeadersConfig(version)
      : [...getLeadersConfig('civ6'), ...getLeadersConfig('civ7')];
    return all.find(l => l.name.toLowerCase() === key) || null;
  }

  static findByEmoji(emojiId: string, version?: 'civ6' | 'civ7'): LeaderConfig | null {
    const all = version
      ? getLeadersConfig(version)
      : [...getLeadersConfig('civ6'), ...getLeadersConfig('civ7')];
    return all.find(l => l.emojiId === emojiId) || null;
  }

  static banLeader(draftId: ID, leaderName: string): void {
    sessionLeaders.get(draftId)?.banned.add(leaderName);
  }

  static pickLeader(draftId: ID, leaderName: string): void {
    sessionLeaders.get(draftId)?.picked.add(leaderName);
  }

  static getAvailable(draftId: ID): LeaderConfig[] {
    const st = sessionLeaders.get(draftId);
    if (!st) return [];
    return getLeadersConfig(st.version)
      .filter(l => !st.banned.has(l.name) && !st.picked.has(l.name));
  }

  static clearSession(draftId: ID): void {
    sessionLeaders.delete(draftId);
  }
}