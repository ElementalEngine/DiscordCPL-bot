import { civ6Leaders } from '../data/civ6'
import { civ7Leaders, civ7Civs } from '../data/civ7'
import { DraftMode } from '../config/constants'

// Types
type GameType = 'civ6' | 'civ7'

export type Civ = {
  civ: string
  emoji_ID: string
  age_pool: 'Antiquity_Age' | 'Exploration_Age' | 'Modern_Age'
}

export type Leader = {
  leader: string
  emoji_ID: string
  Category?: string
}

export type DraftPick = {
  name: string
  emoji_ID: string
}

// Main Controller
export const draftmodeController = {
  generateDraftPool(
    game: GameType,
    mode: DraftMode,
    players: string[],
    data: {
      leaders?: Leader[]
      civs?: Civ[]
      bans?: string[]
      age?: Civ['age_pool']
      maxPerPlayer?: number
    }
  ): Record<string, DraftPick[]> {
    if (game === 'civ6') {
      const leaders = data.leaders ?? civ6Leaders
      return this._generateCiv6Pool(mode, players, leaders, data.bans ?? [], data.maxPerPlayer)
    } else {
      const civs = data.civs ?? civ7Civs
      const age = data.age ?? 'Antiquity_Age'
      return this._generateCiv7Pool(mode, players, civs, age, data.bans ?? [], data.maxPerPlayer)
    }
  },

  _generateCiv6Pool(
    mode: DraftMode,
    players: string[],
    leaders: Leader[],
    bans: string[],
    maxPerPlayer?: number
  ): Record<string, DraftPick[]> {
    const pool = leaders.filter(l => !bans.includes(l.leader))
    const max = maxPerPlayer ?? Math.floor(pool.length / players.length)

    return this._applyDraftMode(mode, players, pool, max, l => ({
      name: l.leader,
      emoji_ID: l.emoji_ID,
    }))
  },

  _generateCiv7Pool(
    mode: DraftMode,
    players: string[],
    civs: Civ[],
    age: Civ['age_pool'],
    bans: string[],
    maxPerPlayer?: number
  ): Record<string, DraftPick[]> {
    const pool = civs.filter(c => c.age_pool === age && !bans.includes(c.civ))
    const max = maxPerPlayer ?? Math.floor(pool.length / players.length)

    return this._applyDraftMode(mode, players, pool, max, c => ({
      name: c.civ,
      emoji_ID: c.emoji_ID,
    }))
  },

  _applyDraftMode<T>(
    mode: DraftMode,
    players: string[],
    pool: T[],
    maxPerPlayer: number,
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    switch (mode) {
      case DraftMode.RANDOM:
      case DraftMode.BLIND:
        return this._randomSplit(players, pool, maxPerPlayer, toPick)
      case DraftMode.DRAFT_2: {
        // For team draft, ignore the players array and split pool between two teams.
        const maxTeam = maxPerPlayer ?? Math.floor(pool.length / 2)
        return this._teamDraft(pool, maxTeam, toPick)
      }
      default: // Covers WITH_TRADE and NO_TRADE
        return this._fairSplit(players, pool, maxPerPlayer, toPick)
    }
  },

  _randomSplit<T>(
    players: string[],
    pool: T[],
    max: number,
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const result: Record<string, DraftPick[]> = {}
    players.forEach((p, i) => {
      result[p] = shuffled.slice(i * max, (i + 1) * max).map(toPick)
    })
    return result
  },

  _fairSplit<T>(
    players: string[],
    pool: T[],
    max: number,
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const result: Record<string, DraftPick[]> = {}
    players.forEach(p => (result[p] = []))

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    let i = 0
    while (shuffled.length > 0) {
      const item = shuffled.pop()
      if (item) {
        result[players[i % players.length]].push(toPick(item))
        i++
      }
    }

    players.forEach(p => {
      result[p] = result[p].slice(0, max)
    })

    return result
  },

  _snakeDraft<T>(
    players: string[],
    pool: T[],
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    // Placeholder for snake draft logic using random split.
    const max = Math.floor(pool.length / players.length)
    return this._randomSplit(players, pool, max, toPick)
  },

  _teamDraft<T>(
    pool: T[],
    maxPerTeam: number,
    toPick: (item: T) => DraftPick
  ): Record<string, DraftPick[]> {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const half = Math.ceil(shuffled.length / 2)
    const team1 = shuffled.slice(0, half).slice(0, maxPerTeam).map(toPick)
    const team2 = shuffled.slice(half).slice(0, maxPerTeam).map(toPick)
    return {
      "Team 1": team1,
      "Team 2": team2,
    }
  },
}
