import { SeededRNG } from '@/utils/rng';
import type { ElizaRule, ElizaResponse } from './types';

const PRONOUN_MAP: Record<string, string> = {
  i: 'you',
  my: 'your',
  me: 'you',
  am: 'are',
  myself: 'yourself',
  you: 'I',
  your: 'my',
  are: 'am',
  was: 'were',
  "i'm": 'you are',
  "i'd": 'you would',
  "i've": 'you have',
  "i'll": 'you will',
};

export function transposePronouns(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/);
  const transposed = words.map((w) => PRONOUN_MAP[w] ?? w);
  return transposed.join(' ');
}

export const ELIZA_RULES: ElizaRule[] = [
  {
    pattern: /\b(?:i am|i'm)\b\s+(.*)/i,
    responses: [
      'Did you come to me because you are $1?',
      'How long have you been $1?',
      'Do you believe it is normal to be $1?',
      'In what way does being $1 affect your day-to-day life?',
    ],
  },
  {
    pattern: /\b(?:i feel|i'm feeling)\b\s+(.*)/i,
    responses: [
      'Do you often feel $1?',
      'What specifically triggers you to feel $1?',
      'When you feel $1, what do you usually do?',
      'Tell me more about feeling $1.',
    ],
  },
  {
    pattern: /\b(?:my mother|my father|my parents|my family|my brother|my sister)\b/i,
    responses: [
      'Tell me more about your family background.',
      'How does your family relationship connect to what you are experiencing now?',
      'Did someone in your family influence that feeling?',
      'What comes to mind when you reflect on your family?',
    ],
  },
  {
    pattern: /\bbecause\b\s+(.*)/i,
    responses: [
      'Is that the real fundamental reason?',
      'What other factors might also explain that?',
      'Does that reason seem to explain anything else?',
      'If that reason changed, how would things be different?',
    ],
  },
  {
    pattern: /\b(?:always|everyone|nobody|never)\b/i,
    responses: [
      'Can you think of a specific exception?',
      'Really, without any exception?',
      'Does thinking in absolutes like that help or hinder you?',
    ],
  },
  {
    pattern: /\b(?:why don't you|why can't you)\b\s+(.*)/i,
    responses: [
      'Do you believe I should be able to $1?',
      'Perhaps you would prefer to $1 yourself?',
      'Why does it matter whether I can $1?',
    ],
  },
  {
    pattern: /\b(?:hello|hi|hey)\b/i,
    responses: [
      'Hello. How are you feeling today?',
      'Greetings. What is on your mind today?',
      'Hello. Please tell me what brings you here.',
    ],
  },
  {
    pattern: /\b(?:sorry|apologize)\b/i,
    responses: [
      'Please do not apologize; feelings are natural.',
      'Apologies are not necessary here. Please continue.',
      'What feelings prompted you to apologize just now?',
    ],
  },
];

const DEFAULT_RESPONSES = [
  'Please continue, I am listening.',
  'Tell me more about that.',
  'How does that make you feel?',
  'Why do you say that in this context?',
  'Can you elaborate on that thought?',
  'Does that evoke any particular memories?',
];

export class ElizaEngine {
  private rng: SeededRNG;

  constructor(seed = 42) {
    this.rng = new SeededRNG(seed);
  }

  process(userInput: string): ElizaResponse {
    const trimmed = userInput.trim();
    if (!trimmed) {
      return {
        reply: 'I cannot hear anything. Please speak your mind.',
        matchedPattern: 'EMPTY_INPUT',
        transposedInput: '',
      };
    }

    // Try rules in order
    for (const rule of ELIZA_RULES) {
      const match = rule.pattern.exec(trimmed);
      if (match) {
        // Pick response using seeded RNG
        const choiceIdx = Math.floor(this.rng.next() * rule.responses.length);
        const template = rule.responses[choiceIdx] ?? rule.responses[0]!;

        // Captured group
        let reply = template;
        if (match[1]) {
          const transposed = transposePronouns(match[1]);
          reply = reply.replace('$1', transposed);
          return {
            reply,
            matchedPattern: rule.pattern.source,
            transposedInput: transposed,
          };
        }

        return {
          reply,
          matchedPattern: rule.pattern.source,
          transposedInput: trimmed,
        };
      }
    }

    // Default fallback
    const fallbackIdx = Math.floor(this.rng.next() * DEFAULT_RESPONSES.length);
    const reply = DEFAULT_RESPONSES[fallbackIdx] ?? DEFAULT_RESPONSES[0]!;

    return {
      reply,
      matchedPattern: 'FALLBACK_DEFAULT',
      transposedInput: transposePronouns(trimmed),
    };
  }
}
