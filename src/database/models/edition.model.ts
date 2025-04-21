export type Edition = 'civ6' | 'civ7';
export const EDITIONS: Edition[] = ['civ6', 'civ7'];
export function isValidEdition(value: string): value is Edition {
  return EDITIONS.includes(value as Edition);
}