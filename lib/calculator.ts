/**
 * Minimal recursive-descent evaluator for arithmetic expressions.
 * Supports + - * / ^, parentheses, unary minus, and decimal numbers.
 * Used by the agent demo's `calculate` tool so nothing is ever eval'd.
 */
export function evaluateExpression(input: string): number {
  let pos = 0;
  const expr = input.replace(/\s+/g, "");

  function peek(): string {
    return expr[pos] ?? "";
  }

  function parseNumber(): number {
    const match = /^\d+(\.\d+)?/.exec(expr.slice(pos));
    if (!match) throw new Error(`Expected a number at position ${pos}`);
    pos += match[0].length;
    return parseFloat(match[0]);
  }

  function parsePrimary(): number {
    if (peek() === "(") {
      pos++;
      const value = parseAdditive();
      if (peek() !== ")") throw new Error("Missing closing parenthesis");
      pos++;
      return value;
    }
    if (peek() === "-") {
      pos++;
      return -parsePrimary();
    }
    return parseNumber();
  }

  function parsePower(): number {
    const base = parsePrimary();
    if (peek() === "^") {
      pos++;
      // Right-associative: 2^3^2 === 2^(3^2)
      return Math.pow(base, parsePower());
    }
    return base;
  }

  function parseMultiplicative(): number {
    let value = parsePower();
    while (peek() === "*" || peek() === "/") {
      const op = expr[pos++];
      const rhs = parsePower();
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  }

  function parseAdditive(): number {
    let value = parseMultiplicative();
    while (peek() === "+" || peek() === "-") {
      const op = expr[pos++];
      const rhs = parseMultiplicative();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  const result = parseAdditive();
  if (pos !== expr.length) {
    throw new Error(`Unexpected character "${expr[pos]}" at position ${pos}`);
  }
  if (!Number.isFinite(result)) throw new Error("Result is not a finite number");
  return result;
}
