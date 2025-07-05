import { CivConfig, AgePool } from '../types/service';
import { civ7Civs } from '../config/civs.config';
import { ID } from '../types/common';

export class CivService {
  static getAvailableCivs(agePool: AgePool): CivConfig[] {
    return civ7Civs.filter(civ => civ.agePool === agePool);
  }

  /** Distribute shuffled civs among players */
  static generateCivPools(
    playerIds: ID[],
    picksPerPlayer: number,
    agePool: AgePool
  ): Map<ID, CivConfig[]> {
    const available = this.getAvailableCivs(agePool).slice();
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    const pools = new Map<ID, CivConfig[]>();
    playerIds.forEach(id => pools.set(id, []));
    let idx = 0;

    for (const civ of available) {
      const uid = playerIds[idx % playerIds.length];
      const arr = pools.get(uid)!;
      if (arr.length < picksPerPlayer) arr.push(civ);
      idx++;
    }

    return pools;
  }
}
