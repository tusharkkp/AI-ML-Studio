import { describe, it, expect } from 'vitest';
import { generateTruthTable, checkEntailment } from './engine';
import { parseFormula } from './parser';
import { formatFormula } from './evaluator';

describe('Propositional Logic Parser & Evaluator', () => {
  it('parses and respects operator precedence', () => {
    // AND binds tighter than OR
    const ast = parseFormula('P & Q | R');
    expect(formatFormula(ast)).toBe('(P ∧ Q) ∨ R');

    // NOT binds tighter than AND
    const ast2 = parseFormula('~P & Q');
    expect(formatFormula(ast2)).toBe('¬P ∧ Q');

    // Right-associative implication
    const ast3 = parseFormula('P -> Q -> R');
    expect(formatFormula(ast3)).toBe('P → (Q → R)');
  });

  it('classifies tautologies correctly', () => {
    const lawOfExcludedMiddle = generateTruthTable('P | ~P');
    expect(lawOfExcludedMiddle.classification).toBe('tautology');
    expect(lawOfExcludedMiddle.satisfyingCount).toBe(2);
    expect(lawOfExcludedMiddle.totalRows).toBe(2);

    const deMorgan = generateTruthTable('~(P & Q) <-> (~P | ~Q)');
    expect(deMorgan.classification).toBe('tautology');
    expect(deMorgan.satisfyingCount).toBe(4);
  });

  it('classifies contradictions correctly', () => {
    const table = generateTruthTable('P & ~P');
    expect(table.classification).toBe('contradiction');
    expect(table.satisfyingCount).toBe(0);
    expect(table.totalRows).toBe(2);
  });

  it('classifies contingent formulas correctly', () => {
    const table = generateTruthTable('P -> Q');
    expect(table.classification).toBe('contingent');
    expect(table.satisfyingCount).toBe(3);
    expect(table.totalRows).toBe(4);
  });
});

describe('Entailment Verification (KB ⊨ α)', () => {
  it('verifies Modus Ponens valid entailment: {P, P -> Q} ⊨ Q', () => {
    const result = checkEntailment(['P', 'P -> Q'], 'Q');
    expect(result.isEntailed).toBe(true);
    expect(result.counterExamples).toHaveLength(0);
    expect(result.kbModelsCount).toBe(1); // Only row P=T, Q=T satisfies KB
  });

  it('detects Affirming the Consequent fallacy: {Q, P -> Q} ⊭ P with countermodel', () => {
    const result = checkEntailment(['Q', 'P -> Q'], 'P');
    expect(result.isEntailed).toBe(false);
    expect(result.counterExamples.length).toBeGreaterThan(0);

    // Countermodel must have P = false, Q = true
    const cm = result.counterExamples[0];
    expect(cm).toBeDefined();
    expect(cm?.assignment['P']).toBe(false);
    expect(cm?.assignment['Q']).toBe(true);
  });

  it('verifies Modus Tollens valid entailment: {~Q, P -> Q} ⊨ ~P', () => {
    const result = checkEntailment(['~Q', 'P -> Q'], '~P');
    expect(result.isEntailed).toBe(true);
    expect(result.counterExamples).toHaveLength(0);
  });

  it('detects Denying the Antecedent fallacy: {~P, P -> Q} ⊭ ~Q', () => {
    const result = checkEntailment(['~P', 'P -> Q'], '~Q');
    expect(result.isEntailed).toBe(false);
    // Counterexample where P=F, Q=T
    const cm = result.counterExamples.find(
      (r) => r.assignment['P'] === false && r.assignment['Q'] === true
    );
    expect(cm).toBeDefined();
  });
});
