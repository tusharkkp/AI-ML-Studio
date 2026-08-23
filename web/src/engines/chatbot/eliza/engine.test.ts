import { describe, it, expect } from 'vitest';
import { ElizaEngine, transposePronouns } from './engine';

describe('ELIZA Rogerian Psychotherapist Chatbot Engine (eliza.pl)', () => {
  it('correctly transposes first-person and second-person pronouns', () => {
    expect(transposePronouns('I am happy with my life')).toBe('you are happy with your life');
    expect(transposePronouns('You are telling me what I should do')).toBe(
      'I am telling you what you should do'
    );
  });

  it('matches "I am" patterns and substitutes transposed predicate', () => {
    const eliza = new ElizaEngine(12345);
    const res = eliza.process('I am worried about my exams');

    expect(res.matchedPattern).toContain('i am');
    expect(res.reply).toContain('worried about your exams');
  });

  it('detects family keywords and redirects conversation', () => {
    const eliza = new ElizaEngine(12345);
    const res = eliza.process('My mother always told me to work hard');

    expect(res.matchedPattern).toContain('mother');
    expect(res.reply).toContain('family');
  });

  it('handles absolute statements (always, never, everyone)', () => {
    const eliza = new ElizaEngine(99);
    const res = eliza.process('Everyone is always ignoring my ideas');

    expect(res.reply).toMatch(/exception|absolutes/i);
  });

  it('falls back gracefully to non-directive prompts when no keyword matches', () => {
    const eliza = new ElizaEngine(42);
    const res = eliza.process('The weather is cloudy and grey');

    expect(res.matchedPattern).toBe('FALLBACK_DEFAULT');
    expect(res.reply.length).toBeGreaterThan(5);
  });

  it('produces 100% deterministic outputs across identical seeds', () => {
    const eliza1 = new ElizaEngine(555);
    const eliza2 = new ElizaEngine(555);

    const r1 = eliza1.process('I feel alone');
    const r2 = eliza2.process('I feel alone');

    expect(r1.reply).toBe(r2.reply);
  });
});
