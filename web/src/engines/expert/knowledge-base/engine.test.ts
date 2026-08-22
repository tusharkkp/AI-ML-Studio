import { describe, it, expect } from 'vitest';
import { validateKnowledgeBase } from './engine';
import type { RuleDefinition } from './types';

describe('Knowledge Base Validation & Acquisition Engine', () => {
  it('validates a clean expert system knowledge base with zero errors', () => {
    const cleanRules: RuleDefinition[] = [
      {
        id: 'R1',
        name: 'Blood Glucose',
        premises: ['FastingSugarHigh'],
        conclusion: 'DiabetesRisk',
      },
      {
        id: 'R2',
        name: 'HbA1c',
        premises: ['DiabetesRisk', 'HbA1cHigh'],
        conclusion: 'Type2Diabetes',
      },
    ];
    const report = validateKnowledgeBase(
      cleanRules,
      ['Type2Diabetes'],
      ['FastingSugarHigh', 'HbA1cHigh']
    );
    expect(report.isValid).toBe(true);
    expect(report.anomalies.filter((a) => a.severity === 'error')).toHaveLength(0);
  });

  it('detects duplicate and subsumed redundant rules', () => {
    const redundantRules: RuleDefinition[] = [
      { id: 'R1', name: 'Rule 1', premises: ['Fever', 'Cough'], conclusion: 'Flu' },
      { id: 'R2', name: 'Rule 2 (Dup)', premises: ['Fever', 'Cough'], conclusion: 'Flu' },
    ];
    const report = validateKnowledgeBase(redundantRules);
    const redundancy = report.anomalies.find((a) => a.type === 'REDUNDANCY');
    expect(redundancy).toBeDefined();
    expect(redundancy?.ruleIds).toEqual(['R1', 'R2']);
  });

  it('detects direct contradictions with opposite conclusions', () => {
    const contradictoryRules: RuleDefinition[] = [
      {
        id: 'R1',
        name: 'Approve',
        premises: ['HighIncome', 'GoodCredit'],
        conclusion: 'LoanApproved',
      },
      {
        id: 'R2',
        name: 'Deny',
        premises: ['HighIncome', 'GoodCredit'],
        conclusion: '~LoanApproved',
      },
    ];
    const report = validateKnowledgeBase(contradictoryRules);
    expect(report.isValid).toBe(false);
    const contradiction = report.anomalies.find((a) => a.type === 'CONTRADICTION');
    expect(contradiction).toBeDefined();
    expect(contradiction?.severity).toBe('error');
  });

  it('detects circular rule dependency cycles', () => {
    const circularRules: RuleDefinition[] = [
      { id: 'R1', name: 'Cycle A', premises: ['A'], conclusion: 'B' },
      { id: 'R2', name: 'Cycle B', premises: ['B'], conclusion: 'C' },
      { id: 'R3', name: 'Cycle C', premises: ['C'], conclusion: 'A' },
    ];
    const report = validateKnowledgeBase(circularRules);
    expect(report.isValid).toBe(false);
    const circularity = report.anomalies.find((a) => a.type === 'CIRCULARITY');
    expect(circularity).toBeDefined();
    expect(circularity?.severity).toBe('error');
  });
});
