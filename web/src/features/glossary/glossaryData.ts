export interface GlossaryEntry {
  term: string;
  definition: string;
  unit: 1 | 2 | 3 | 4 | 5 | 6;
  relatedTerms?: string[];
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  frontier: {
    term: 'Frontier (Open List)',
    definition:
      'The set of all leaf nodes available for expansion at any given point in a search algorithm.',
    unit: 2,
    relatedTerms: ['explored set', 'fifo queue'],
  },
  'explored set': {
    term: 'Explored Set (Closed List)',
    definition:
      'The set of all states that have already been expanded, preventing the search algorithm from looping indefinitely on cycles.',
    unit: 2,
    relatedTerms: ['frontier', 'completeness'],
  },
  completeness: {
    term: 'Completeness',
    definition:
      'A search algorithm is complete if it is guaranteed to find a solution when one exists, or correctly report failure when none exists.',
    unit: 2,
    relatedTerms: ['optimality'],
  },
  optimality: {
    term: 'Optimality',
    definition:
      'A search algorithm is optimal if it finds the solution with the lowest path cost among all possible solutions.',
    unit: 2,
    relatedTerms: ['completeness', 'admissibility'],
  },
  'branching factor': {
    term: 'Branching Factor (b)',
    definition:
      'The maximum or average number of successor actions available from any given state in a search graph or tree.',
    unit: 2,
    relatedTerms: ['time complexity'],
  },
  heuristic: {
    term: 'Heuristic function h(n)',
    definition:
      'An estimate of the cost from node n to the closest goal state, leveraging domain-specific knowledge to guide search.',
    unit: 2,
    relatedTerms: ['admissibility', 'consistency'],
  },
  admissibility: {
    term: 'Admissibility',
    definition:
      'A heuristic h(n) is admissible if it never overestimates the true minimal cost to reach the goal: h(n) <= h*(n).',
    unit: 2,
    relatedTerms: ['optimality', 'consistency'],
  },
};
