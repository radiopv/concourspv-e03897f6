export const RANKS = [
  { value: 'NOVATO', label: 'Novato' },
  { value: 'HAVANA', label: 'Havana' },
  { value: 'SANTIAGO', label: 'Santiago' },
  { value: 'RIO', label: 'Rio' },
  { value: 'CARNIVAL', label: 'Carnival' },
  { value: 'ELDORADO', label: 'El Dorado' }
] as const;

export const RANK_POINTS = {
  'NOVATO': 0,
  'HAVANA': 1000,
  'SANTIAGO': 2500,
  'RIO': 5000,
  'CARNIVAL': 10000,
  'ELDORADO': 25000
} as const;