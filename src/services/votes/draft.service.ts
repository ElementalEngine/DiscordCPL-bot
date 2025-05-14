import { DraftMode }      from '../../config/constants';
import { civ7Leaders, civ7Civs, Civ7Civ } from '../../data/civ7';
import { civ6Leaders }   from '../../data/civ6';

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
    if (game === 'civ6') {
      // Only leaders pool
      const pool = civ6Leaders.filter(l => !opts.bans?.includes(l.leader));
      return this._splitSinglePool(players, pool, mode, l => ({
        name:     l.leader,
        emoji_ID: l.emoji_ID
      }));
    }

    // Civ VII: two pools (leaders + age-filtered civs)
    const leaderPool = civ7Leaders.filter(l => !opts.bans?.includes(l.leader));
    const civPool    = civ7Civs
      .filter(c => c.age_pool === opts.age)
      .filter(c => !opts.bans?.includes(c.civ));

    if (mode === DraftMode.SNAKE) {
      const perLeader = Math.floor(leaderPool.length / players.length);
      const perCiv    = Math.floor(civPool.length    / players.length);
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

    const leaderPicks = this._splitSinglePool(
      players,
      leaderPool,
      mode,
      l => ({ name: l.leader, emoji_ID: l.emoji_ID })
    );
    const civPicks = this._splitSinglePool(
      players,
      civPool,
      mode,
      c => ({ name: c.civ, emoji_ID: c.emoji_ID })
    );

    return players.reduce((acc, p) => {
      acc[p] = [...leaderPicks[p], ...civPicks[p]];
      return acc;
    }, {} as Record<string, DraftPick[]>);
  }

  /** split one pool according to mode */
  private static _splitSinglePool<T>(
    players: string[],
    pool: T[],
    mode: DraftMode,
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const perPlayer = Math.floor(pool.length / players.length);
    switch (mode) {
      case DraftMode.RANDOM:
        return this._randomSplit(players, pool, perPlayer, toPick);
      case DraftMode.SNAKE:
        return this._snakeSplit(players, pool, perPlayer, toPick);
      default:
        return this._fairSplit(players, pool, perPlayer, toPick);
    }
  }

  // ── single-phase random shuffle ───────────────────────────────────────────
  private static _randomSplit<T>(
    players:    string[],
    pool:       T[],
    max:        number,
    toPick:     (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return players.reduce((acc, p, i) => {
      acc[p] = shuffled.slice(i * max, (i + 1) * max).map(toPick);
      return acc;
    }, {} as Record<string, DraftPick[]>);
  }

  // ── single-phase “fair” round-robin ────────────────────────────────────────
  private static _fairSplit<T>(
    players: string[],
    pool:    T[],
    max:     number,
    toPick:  (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const result = players.reduce((acc, p) => {
      acc[p] = [];
      return acc;
    }, {} as Record<string, DraftPick[]>);

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    let idx = 0;
    while (shuffled.length) {
      const item = shuffled.pop()!;
      result[players[idx % players.length]].push(toPick(item));
      idx++;
    }
    // trim extras
    players.forEach(p => {
      result[p] = result[p].slice(0, max);
    });
    return result;
  }

  // ── single-phase snake draft ───────────────────────────────────────────────
  private static _snakeSplit<T>(
    players: string[],
    pool:    T[],
    max:     number,
    toPick:  (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const result = players.reduce((acc, p) => {
      acc[p] = [];
      return acc;
    }, {} as Record<string, DraftPick[]>);

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

  // ── dual-phase snake: leaders then randomized civ-pool ────────────────────
  private static _snakeDualPhase<L, C>(
    players:      string[],
    leaderPool:   L[],
    civPool:      C[],
    perLeader:    number,
    perCiv:       number,
    toLeaderPick: (l: L) => DraftPick,
    toCivPick:    (c: C) => DraftPick
  ): Record<string, DraftPick[]> {
    const result = players.reduce((acc, p) => {
      acc[p] = [];
      return acc;
    }, {} as Record<string, DraftPick[]>);

    // leaders
    const leaderRounds = Math.ceil(leaderPool.length / perLeader);
    for (let r = 0; r < leaderRounds; r++) {
      const slice = leaderPool.slice(r * perLeader, (r + 1) * perLeader);
      const order = (r % 2 === 0) ? players : [...players].reverse();
      order.forEach((p, i) => {
        if (slice[i]) result[p].push(toLeaderPick(slice[i]));
      });
    }

    // civs: pick a random sample of size perCiv*players.length
    const totalCivs  = perCiv * players.length;
    const randomCivs = Array.from({ length: totalCivs }, () =>
      civPool[Math.floor(Math.random() * civPool.length)]
    );
    const civRounds = Math.ceil(randomCivs.length / perCiv);
    for (let r = 0; r < civRounds; r++) {
      const slice = randomCivs.slice(r * perCiv, (r + 1) * perCiv);
      // snake: reverse on odd rounds
      const order = (r % 2 === 1) ? players : [...players].reverse();
      order.forEach((p, i) => {
        if (slice[i]) result[p].push(toCivPick(slice[i]));
      });
    }

    return result;
  }
}