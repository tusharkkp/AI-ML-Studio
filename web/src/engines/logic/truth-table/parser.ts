import type { ASTNode } from './types';

type TokenType = 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];
    if (ch === undefined) break;

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(', pos: i });
      i++;
    } else if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')', pos: i });
      i++;
    } else if (input.slice(i, i + 3) === '<=>' || input.slice(i, i + 3) === '<->') {
      tokens.push({ type: 'IFF', value: '<->', pos: i });
      i += 3;
    } else if (ch === '↔') {
      tokens.push({ type: 'IFF', value: '<->', pos: i });
      i++;
    } else if (input.slice(i, i + 2) === '->' || input.slice(i, i + 2) === '=>') {
      tokens.push({ type: 'IMPLIES', value: '->', pos: i });
      i += 2;
    } else if (ch === '→') {
      tokens.push({ type: 'IMPLIES', value: '->', pos: i });
      i++;
    } else if (ch === '~' || ch === '!' || ch === '¬') {
      tokens.push({ type: 'NOT', value: '~', pos: i });
      i++;
    } else if (ch === '&' || ch === '^' || ch === '∧') {
      tokens.push({ type: 'AND', value: '∧', pos: i });
      i++;
    } else if (ch === '|' || ch === '∨') {
      tokens.push({ type: 'OR', value: '∨', pos: i });
      i++;
    } else if (/[A-Za-z]/.test(ch)) {
      let word = '';
      const start = i;
      while (i < n && /[A-Za-z0-9_]/.test(input[i] ?? '')) {
        word += input[i];
        i++;
      }
      const lower = word.toLowerCase();
      if (lower === 'not') {
        tokens.push({ type: 'NOT', value: '~', pos: start });
      } else if (lower === 'and') {
        tokens.push({ type: 'AND', value: '∧', pos: start });
      } else if (lower === 'or') {
        tokens.push({ type: 'OR', value: '∨', pos: start });
      } else if (lower === 'implies' || lower === 'then') {
        tokens.push({ type: 'IMPLIES', value: '->', pos: start });
      } else if (lower === 'iff') {
        tokens.push({ type: 'IFF', value: '<->', pos: start });
      } else if (word === 'v' && tokens.length > 0 && tokens[tokens.length - 1]?.type === 'VAR') {
        // Disambiguate single 'v' as OR if immediately following a variable
        tokens.push({ type: 'OR', value: '∨', pos: start });
      } else {
        tokens.push({ type: 'VAR', value: word.toUpperCase(), pos: start });
      }
    } else {
      throw new Error(`Unexpected character '${ch}' at index ${i}`);
    }
  }

  tokens.push({ type: 'EOF', value: '', pos: n });
  return tokens;
}

/**
 * Precedence hierarchy (lowest to highest):
 * 1. IFF (<->)
 * 2. IMPLIES (->)
 * 3. OR (∨)
 * 4. AND (∧)
 * 5. NOT (~)
 * 6. Primary (Variable, (Formula))
 */
export class FormulaParser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const node = this.parseIff();
    if (!this.isAtEnd()) {
      const tok = this.peek();
      throw new Error(`Unexpected token '${tok.value}' at index ${tok.pos}`);
    }
    return node;
  }

  private parseIff(): ASTNode {
    let expr = this.parseImplies();

    while (this.match('IFF')) {
      const right = this.parseImplies();
      expr = { type: 'BINARY', operator: 'IFF', left: expr, right };
    }

    return expr;
  }

  private parseImplies(): ASTNode {
    let expr = this.parseOr();

    // IMPLIES is right-associative in standard formal logic: A -> B -> C is A -> (B -> C)
    if (this.match('IMPLIES')) {
      const right = this.parseImplies();
      expr = { type: 'BINARY', operator: 'IMPLIES', left: expr, right };
    }

    return expr;
  }

  private parseOr(): ASTNode {
    let expr = this.parseAnd();

    while (this.match('OR')) {
      const right = this.parseAnd();
      expr = { type: 'BINARY', operator: 'OR', left: expr, right };
    }

    return expr;
  }

  private parseAnd(): ASTNode {
    let expr = this.parseNot();

    while (this.match('AND')) {
      const right = this.parseNot();
      expr = { type: 'BINARY', operator: 'AND', left: expr, right };
    }

    return expr;
  }

  private parseNot(): ASTNode {
    if (this.match('NOT')) {
      const operand = this.parseNot();
      return { type: 'NOT', operand };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    if (this.match('VAR')) {
      const prev = this.previous();
      return { type: 'VARIABLE', name: prev.value };
    }

    if (this.match('LPAREN')) {
      const expr = this.parseIff();
      if (!this.match('RPAREN')) {
        throw new Error('Unclosed parenthesis, expected ")"');
      }
      return expr;
    }

    const tok = this.peek();
    throw new Error(
      `Expected variable or expression at index ${tok.pos}, found '${tok.value || 'EOF'}'`
    );
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current] ?? { type: 'EOF', value: '', pos: -1 };
  }

  private previous(): Token {
    const prev = this.tokens[this.current - 1];
    if (!prev) throw new Error('Attempted to access previous token out of bounds');
    return prev;
  }
}

export function parseFormula(input: string): ASTNode {
  const tokens = tokenize(input);
  const parser = new FormulaParser(tokens);
  return parser.parse();
}
