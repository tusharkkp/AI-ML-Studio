import { describe, it, expect } from 'vitest';
import { runUnification, applySubst } from './engine';
import { formatTerm } from './parser';

describe('First-Order Logic Robinson Unification Engine', () => {
  it('unifies standard family tree terms from FamilyTree.pl', () => {
    const res = runUnification('Parent(?x, Bob)', 'Parent(Pam, ?y)');
    expect(res.success).toBe(true);
    expect(res.mguFormatted['?x']).toBe('Pam');
    expect(res.mguFormatted['?y']).toBe('Bob');
    expect(res.unifiedTermFormatted).toBe('Parent(Pam, Bob)');
  });

  it('unifies nested compound function terms', () => {
    const res = runUnification('Knows(John, f(?x))', 'Knows(?y, f(Mary))');
    expect(res.success).toBe(true);
    expect(res.mguFormatted['?y']).toBe('John');
    expect(res.mguFormatted['?x']).toBe('Mary');
    expect(res.unifiedTermFormatted).toBe('Knows(John, f(Mary))');
  });

  it('fails with constant clash', () => {
    const res = runUnification('Parent(John, Bob)', 'Parent(Mary, Bob)');
    expect(res.success).toBe(false);
    expect(res.failureReason).toContain('Constant symbol clash');
  });

  it('fails with functor mismatch', () => {
    const res = runUnification('Mother(Mary, Bob)', 'Father(John, Bob)');
    expect(res.success).toBe(false);
    expect(res.failureReason).toContain('Functor clash');
  });

  it('fails with arity mismatch', () => {
    const res = runUnification('Parent(?x)', 'Parent(?x, Bob)');
    expect(res.success).toBe(false);
    expect(res.failureReason).toContain('Arity mismatch');
  });

  it('strictly detects occurs-check violations to prevent infinite cycles', () => {
    // Direct occurs check: ?x = f(?x)
    const res1 = runUnification('?x', 'f(?x)');
    expect(res1.success).toBe(false);
    expect(res1.failureReason).toContain('Occurs-check failure');

    // Indirect occurs check: Parent(?x, ?x) and Parent(?y, f(?y))
    const res2 = runUnification('Parent(?x, ?x)', 'Parent(?y, f(?y))');
    expect(res2.success).toBe(false);
    expect(res2.failureReason).toContain('Occurs-check failure');
  });

  it('satisfies idempotence property: theta(term1) === theta(term2)', () => {
    const res = runUnification('Likes(?who, IceCream)', 'Likes(Alice, ?what)');
    expect(res.success).toBe(true);
    expect(res.mgu).not.toBeNull();

    if (res.mgu) {
      const substituted1 = applySubst(res.mgu, res.term1Parsed);
      const substituted2 = applySubst(res.mgu, res.term2Parsed);
      expect(formatTerm(substituted1)).toBe(formatTerm(substituted2));
      expect(formatTerm(substituted1)).toBe('Likes(Alice, IceCream)');
    }
  });
});
