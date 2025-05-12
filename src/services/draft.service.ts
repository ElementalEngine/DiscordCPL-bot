import { DraftMode } from '../config/constants';
import { civ7Leaders, civ7Civs,  Civ7Civ  } from '../data/civ7';
import { civ6Leaders} from '../data/civ6';

export interface DraftPick {
  name:     string;
  emoji_ID: string;
}

export class DraftService {
  static generateDraftPool(
    game: 'civ6' | 'civ7',
    mode: DraftMode,
    players: string[],
    opts: {
      age?: Civ7Civ['age_pool'],
      bans?: string[]
    }
  ): Record<string, DraftPick[]> {
    // ─── Civ 7 + Snake dual-phase ─────────────────────────────
    if (game === 'civ7' && mode === DraftMode.SNAKE) {
      const leaderPool = civ7Leaders.filter(l => !opts.bans?.includes(l.leader));
      const perLeader  = Math.floor(leaderPool.length / players.length);

      const civPool     = civ7Civs
        .filter(c => c.age_pool === opts.age)
        .filter(c => !opts.bans?.includes(c.civ));
      const perCiv      = Math.floor(civPool.length / players.length);

      return this._snakeDualPhase(
        players,
        leaderPool,
        civPool,
        perLeader,
        perCiv,
        l => ({ name: l.leader, emoji_ID: l.emoji_ID }),
        c => ({ name: c.civ,    emoji_ID: c.emoji_ID    })
      );
    }

    // ─── Civ 6 (only leaders) ──────────────────────────────────
    if (game === 'civ6') {
      const pool      = civ6Leaders.filter(l => !opts.bans?.includes(l.leader));
      const perPlayer = Math.floor(pool.length / players.length);

      switch (mode) {
        case DraftMode.RANDOM:
          return this._randomSplit(players, pool, perPlayer, l => ({
            name:     l.leader,
            emoji_ID: l.emoji_ID,
          }));
        case DraftMode.SNAKE:
          return this._snakeSplit(players, pool, perPlayer, l => ({
            name:     l.leader,
            emoji_ID: l.emoji_ID,
          }));
        default:
          return this._fairSplit(players, pool, perPlayer, l => ({
            name:     l.leader,
            emoji_ID: l.emoji_ID,
          }));
      }
    }
    {
      const pool      = civ7Civs
        .filter(c => c.age_pool === opts.age)
        .filter(c => !opts.bans?.includes(c.civ));
      const perPlayer = Math.floor(pool.length / players.length);

      switch (mode) {
        case DraftMode.RANDOM:
          return this._randomSplit(players, pool, perPlayer, c => ({
            name:     c.civ,
            emoji_ID: c.emoji_ID,
          }));
        case DraftMode.SNAKE:
          return this._snakeSplit(players, pool, perPlayer, c => ({
            name:     c.civ,
            emoji_ID: c.emoji_ID,
          }));
        default:
          return this._fairSplit(players, pool, perPlayer, c => ({
            name:     c.civ,
            emoji_ID: c.emoji_ID,
          }));
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  // Single‐pool strategies 
  // ────────────────────────────────────────────────────────────
  private static _randomSplit<T>(
    players:    string[],
    pool:       T[],
    max:        number,
    toPick:     (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const result: Record<string, DraftPick[]> = {};
    players.forEach((p, i) => {
      result[p] = shuffled
        .slice(i * max, (i + 1) * max)
        .map(toPick);
    });
    return result;
  }

  private static _fairSplit<T>(
    players: string[],
    pool:    T[],
    max:     number,
    toPick:  (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const result: Record<string, DraftPick[]> = {};
    players.forEach(p => (result[p] = []));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    let idx = 0;
    while (shuffled.length) {
      const item = shuffled.pop()!;
      result[players[idx % players.length]].push(toPick(item));
      idx++;
    }
    players.forEach(p => (result[p] = result[p].slice(0, max)));
    return result;
  }

  private static _snakeSplit<T>(
    players: string[],
    pool:    T[],
    max:     number,
    toPick:  (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const result: Record<string, DraftPick[]> = {};
    players.forEach(p => (result[p] = []));
    const rounds = Math.ceil(pool.length / max);

    for (let r = 0; r < rounds; r++) {
      const slice = pool.slice(r * max, (r + 1) * max);
      const order = (r % 2 === 0) ? players : [...players].reverse();
      order.forEach((p, i) => {
        if (slice[i]) result[p].push(toPick(slice[i]));
      });
    }

    return result;
  }

  // ────────────────────────────────────────────────────────────
  // Dual‐phase Snake 
  // ────────────────────────────────────────────────────────────
  private static _snakeDualPhase<L, C>(
    players:     string[],
    leaderPool:  L[],
    civPool:     C[],
    perLeader:   number,
    perCiv:      number,
    toLeaderPick:(l: L) => DraftPick,
    toCivPick:   (c: C) => DraftPick
  ): Record<string, DraftPick[]> {
    const result: Record<string, DraftPick[]> = {};
    players.forEach(p => (result[p] = []));

    const leaderRounds = Math.ceil(leaderPool.length / perLeader);
    for (let r = 0; r < leaderRounds; r++) {
      const slice = leaderPool.slice(r * perLeader, (r + 1) * perLeader);
      const order = (r % 2 === 0) ? players : [...players].reverse();
      order.forEach((p, i) => {
        if (slice[i]) result[p].push(toLeaderPick(slice[i]));
      });
    }

    const totalCivs   = perCiv * players.length;
    const randomCivs  = Array.from({ length: totalCivs }, () =>
      civPool[Math.floor(Math.random() * civPool.length)]
    );
    const civRounds   = Math.ceil(randomCivs.length / perCiv);

    for (let r = 0; r < civRounds; r++) {
      const slice = randomCivs.slice(r * perCiv, (r + 1) * perCiv);
      const order = (r === 0)
        ? [...players].reverse()
        : ((r % 2 === 1) ? players : [...players].reverse());

      order.forEach((p, i) => {
        if (slice[i]) result[p].push(toCivPick(slice[i]));
      });
    }
    return result;
  }
}
