import type { Term } from './types';

export function isVariable(s: string): boolean {
  return s.startsWith('?') || (/^[a-z][a-zA-Z0-9_]*$/.test(s) && !['true', 'false'].includes(s));
}

export function formatTerm(term: Term): string {
  switch (term.type) {
    case 'VARIABLE':
      return term.name.startsWith('?') ? term.name : `?${term.name}`;
    case 'CONSTANT':
      return term.name;
    case 'COMPOUND':
      return `${term.name}(${term.args.map(formatTerm).join(', ')})`;
  }
}

export function parseTerm(input: string): Term {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Empty term input');
  }

  // Check if compound: Name(...)
  const parenOpen = trimmed.indexOf('(');
  if (parenOpen !== -1) {
    if (!trimmed.endsWith(')')) {
      throw new Error(`Unmatched parenthesis in compound term: ${trimmed}`);
    }
    const name = trimmed.slice(0, parenOpen).trim();
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error(`Invalid compound functor name: ${name}`);
    }

    const inside = trimmed.slice(parenOpen + 1, -1).trim();
    if (inside.length === 0) {
      return { type: 'COMPOUND', name, args: [] };
    }

    // Split args respecting nested parentheses
    const rawArgs: string[] = [];
    let depth = 0;
    let current = '';

    for (let i = 0; i < inside.length; i++) {
      const ch = inside[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;

      if (ch === ',' && depth === 0) {
        rawArgs.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) {
      rawArgs.push(current.trim());
    }

    const args = rawArgs.map(parseTerm);
    return { type: 'COMPOUND', name, args };
  }

  // Atom: variable or constant
  if (trimmed.startsWith('?')) {
    return { type: 'VARIABLE', name: trimmed };
  }

  if (isVariable(trimmed)) {
    return { type: 'VARIABLE', name: trimmed.startsWith('?') ? trimmed : `?${trimmed}` };
  }

  return { type: 'CONSTANT', name: trimmed };
}
