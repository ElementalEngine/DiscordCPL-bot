export type GameType = 'FFA' | 'Duel' | '2v2' | 'Teamer';
export const GAMETYPES: GameType[] = ['FFA', 'Duel', '2v2', 'Teamer'];
export function isValidGameType(value: string): value is GameType {
  return GAMETYPES.includes(value as GameType);
}