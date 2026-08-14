import type { ASTNode, Assignment } from './types';

export function evaluate(node: ASTNode, assignment: Assignment): boolean {
  switch (node.type) {
    case 'VARIABLE': {
      const val = assignment[node.name];
      if (val === undefined) {
        throw new Error(`Unassigned variable: ${node.name}`);
      }
      return val;
    }
    case 'NOT':
      return !evaluate(node.operand, assignment);
    case 'BINARY': {
      const left = evaluate(node.left, assignment);
      const right = evaluate(node.right, assignment);
      switch (node.operator) {
        case 'AND':
          return left && right;
        case 'OR':
          return left || right;
        case 'IMPLIES':
          return !left || right;
        case 'IFF':
          return left === right;
      }
    }
  }
}

export function formatFormula(node: ASTNode): string {
  switch (node.type) {
    case 'VARIABLE':
      return node.name;
    case 'NOT': {
      const inner = formatFormula(node.operand);
      return node.operand.type === 'BINARY' ? `¬(${inner})` : `¬${inner}`;
    }
    case 'BINARY': {
      const leftStr =
        node.left.type === 'BINARY' ? `(${formatFormula(node.left)})` : formatFormula(node.left);
      const rightStr =
        node.right.type === 'BINARY' ? `(${formatFormula(node.right)})` : formatFormula(node.right);
      const opSymbol =
        node.operator === 'AND'
          ? '∧'
          : node.operator === 'OR'
            ? '∨'
            : node.operator === 'IMPLIES'
              ? '→'
              : '↔';
      return `${leftStr} ${opSymbol} ${rightStr}`;
    }
  }
}

export function extractVariables(node: ASTNode): string[] {
  const vars = new Set<string>();

  function walk(n: ASTNode) {
    if (n.type === 'VARIABLE') {
      vars.add(n.name);
    } else if (n.type === 'NOT') {
      walk(n.operand);
    } else if (n.type === 'BINARY') {
      walk(n.left);
      walk(n.right);
    }
  }

  walk(node);
  return Array.from(vars).sort();
}

/**
 * Returns sub-expressions ordered from simplest to overall formula.
 */
export function extractSubExpressions(node: ASTNode): ASTNode[] {
  const list: ASTNode[] = [];
  const seen = new Set<string>();

  function walk(n: ASTNode) {
    if (n.type === 'NOT') {
      walk(n.operand);
    } else if (n.type === 'BINARY') {
      walk(n.left);
      walk(n.right);
    }
    const str = formatFormula(n);
    if (!seen.has(str)) {
      seen.add(str);
      list.push(n);
    }
  }

  walk(node);
  return list;
}
