import { Client } from 'discord.js';
import {
  DraftSession,
  LeaderConfig,
  CivVersion,
  CivConfig,
  AgePool
} from '../types/service';
import { LeadersService } from './leaders';
import { CivService }    from './civs';
import { ID }            from '../types/common';

interface ExtendedDraftSession extends DraftSession {
  version: CivVersion;
  agePool?: AgePool;
  phase: 'civ' | 'leader' | 'done';
  civPools?: Map<ID, CivConfig[]>;
  leaderPools?: Map<ID, LeaderConfig[]>;
}

const draftSessions: Map<ID, ExtendedDraftSession> = new Map();

export class DraftService {
  static createDraft(
    draftId: ID,
    playerIds: ID[],
    version: CivVersion,
    agePool?: AgePool
  ): void {
    if (version === 'civ7' && !agePool) {
      throw new Error('Age pool required for Civ7 drafts');
    }
    const session: ExtendedDraftSession = {
      players: [...playerIds],
      completed: false,
      version,
      agePool,
      phase: version === 'civ7' ? 'civ' : 'leader'
    };
    LeadersService.initSession(draftId, version);
    draftSessions.set(draftId, session);
  }

  static generateCivDraft(draftId: ID, picksPerPlayer: number): Map<ID, CivConfig[]> {
    const sess = draftSessions.get(draftId);
    if (!sess || sess.version !== 'civ7' || sess.phase !== 'civ') {
      throw new Error('Civ draft not available');
    }
    const pools = CivService.generateCivPools(sess.players, picksPerPlayer, sess.agePool!);
    sess.civPools = pools;
    sess.phase = 'leader';
    return pools;
  }

  static generateLeaderDraft(draftId: ID, picksPerPlayer: number): Map<ID, LeaderConfig[]> {
    const sess = draftSessions.get(draftId);
    if (!sess || sess.phase !== 'leader') {
      throw new Error('Leader draft not available');
    }
    const available = LeadersService.getAvailable(draftId);
    const shuffled = available.sort(() => Math.random() - 0.5);
    const pools = new Map<ID, LeaderConfig[]>();
    sess.players.forEach(id => pools.set(id, []));
    let idx = 0;
    for (const leader of shuffled) {
      const uid = sess.players[idx % sess.players.length];
      const arr = pools.get(uid)!;
      if (arr.length < picksPerPlayer) arr.push(leader);
      idx++;
    }
    sess.leaderPools = pools;
    sess.phase = 'done';
    return pools;
  }

  static applyPicks(draftId: ID, picks: Record<ID, string>): void {
    const sess = draftSessions.get(draftId);
    if (!sess) throw new Error('Session not found');

    if (sess.phase === 'leader' || sess.version === 'civ6') {
      Object.entries(picks).forEach(([uid, name]) =>
        LeadersService.pickLeader(draftId, name)
      );
    }
    if (sess.phase === 'done') sess.completed = true;
  }

  static async sendBlindDraft(client: Client, draftId: ID): Promise<void> {
    const sess = draftSessions.get(draftId);
    if (!sess) throw new Error('Session not found');

    // explicitly narrow poolMap so TS knows it's defined
    let poolMap: Map<ID, LeaderConfig[]> | Map<ID, CivConfig[]>;
    if (sess.phase === 'civ') {
      if (!sess.civPools) throw new Error('Civ pools unavailable');
      poolMap = sess.civPools;
    } else if (sess.phase === 'leader') {
      if (!sess.leaderPools) throw new Error('Leader pools unavailable');
      poolMap = sess.leaderPools;
    } else {
      throw new Error('No draft phase active');
    }

    for (const [uid, list] of poolMap) {
      const user = await client.users.fetch(uid);
      const dm = await user.createDM();
      const lines = list.map(item =>
        `<:${item.emojiName}:${item.emojiId}> ${
          'name' in item ? (item as LeaderConfig).name : (item as CivConfig).civ
        }`
      );
      await dm.send({ content: `Your draft pool:\n${lines.join('\n')}` });
    }
  }

  static clearDraft(draftId: ID): void {
    draftSessions.delete(draftId);
    LeadersService.clearSession(draftId);
  }
}