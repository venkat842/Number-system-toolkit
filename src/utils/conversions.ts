/**
 * Conversion Module
 * Direct TypeScript port of the C++ Conversion Functions:
 * - decimalToBinaryValue
 * - decimalToOctalValue
 * - decimalToHexValue
 * - binaryToDecimal
 * - octalToDecimal
 * - hexToDecimal
 *
 * Includes positional decomposition and step-by-step division helpers for clear mathematical explanations.
 */

export interface PositionalTerm {
  digitChar: string;
  digitValue: bigint;
  placeIndex: number;
  baseWeight: bigint; // base^placeIndex
  evaluatedTerm: bigint; // digitValue * baseWeight
}

export interface DecompositionResult {
  base: number;
  baseLabel: string;
  terms: PositionalTerm[];
  totalValue: bigint;
  formulaString: string;
  expandedSumString: string;
}

export interface DivisionStep {
  quotientBefore: bigint;
  divisor: number;
  quotientAfter: bigint;
  remainder: number;
  remainderChar: string;
}

/**
 * Decimal -> Binary
 */
export function decimalToBinaryValue(n: bigint | number): string {
  let num = typeof n === 'bigint' ? n : BigInt(Math.floor(n));
  if (num === 0n) return '0';
  if (num < 0n) num = -num;

  let binary = '';
  while (num > 0n) {
    const rem = num % 2n;
    binary = rem.toString() + binary;
    num = num / 2n;
  }
  return binary || '0';
}

/**
 * Decimal -> Octal
 */
export function decimalToOctalValue(n: bigint | number): string {
  let num = typeof n === 'bigint' ? n : BigInt(Math.floor(n));
  if (num === 0n) return '0';
  if (num < 0n) num = -num;

  let octal = '';
  while (num > 0n) {
    const rem = num % 8n;
    octal = rem.toString() + octal;
    num = num / 8n;
  }
  return octal || '0';
}

/**
 * Decimal -> Hexadecimal (uppercase string)
 */
export function decimalToHexValue(n: bigint | number): string {
  let num = typeof n === 'bigint' ? n : BigInt(Math.floor(n));
  if (num === 0n) return '0';
  if (num < 0n) num = -num;

  const digits = '0123456789ABCDEF';
  let hex = '';
  while (num > 0n) {
    const rem = Number(num % 16n);
    hex = digits[rem] + hex;
    num = num / 16n;
  }
  return hex || '0';
}

/**
 * Binary -> Decimal
 */
export function binaryToDecimal(binaryStr: string): string {
  const clean = binaryStr.trim();
  if (!clean) return '0';

  let decimal = 0n;
  let base = 1n;
  for (let i = clean.length - 1; i >= 0; i--) {
    const digit = BigInt(clean[i]);
    decimal += digit * base;
    base *= 2n;
  }
  return decimal.toString();
}

/**
 * Octal -> Decimal
 */
export function octalToDecimal(octalStr: string): string {
  const clean = octalStr.trim();
  if (!clean) return '0';

  let decimal = 0n;
  let base = 1n;
  for (let i = clean.length - 1; i >= 0; i--) {
    const digit = BigInt(clean[i]);
    decimal += digit * base;
    base *= 8n;
  }
  return decimal.toString();
}

/**
 * Hexadecimal -> Decimal
 */
export function hexToDecimal(hexStr: string): string {
  const clean = hexStr.trim();
  if (!clean) return '0';

  let decimal = 0n;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i].toUpperCase();
    let value = 0n;
    if (c >= '0' && c <= '9') {
      value = BigInt(c.charCodeAt(0) - '0'.charCodeAt(0));
    } else if (c >= 'A' && c <= 'F') {
      value = BigInt(c.charCodeAt(0) - 'A'.charCodeAt(0) + 10);
    } else {
      throw new Error(`Invalid hexadecimal character: ${c}`);
    }
    decimal = decimal * 16n + value;
  }
  return decimal.toString();
}

/**
 * Generates the repeated division steps for Decimal to other bases (for step-by-step explanations)
 */
export function getDivisionSteps(decimalNumber: bigint | number, targetBase: 2 | 8 | 16): DivisionStep[] {
  let num = typeof decimalNumber === 'bigint' ? decimalNumber : BigInt(Math.floor(decimalNumber));
  if (num === 0n) {
    return [{
      quotientBefore: 0n,
      divisor: targetBase,
      quotientAfter: 0n,
      remainder: 0,
      remainderChar: '0',
    }];
  }

  const baseBig = BigInt(targetBase);
  const hexChars = '0123456789ABCDEF';
  const steps: DivisionStep[] = [];

  while (num > 0n) {
    const quotientAfter = num / baseBig;
    const rem = Number(num % baseBig);
    steps.push({
      quotientBefore: num,
      divisor: targetBase,
      quotientAfter,
      remainder: rem,
      remainderChar: targetBase === 16 ? hexChars[rem] : rem.toString(),
    });
    num = quotientAfter;
  }

  return steps;
}

/**
 * Generates the mathematical positional terms for any base representation
 */
export function getPositionalDecomposition(
  valueStr: string,
  base: 2 | 8 | 10 | 16
): DecompositionResult {
  const clean = valueStr.trim().toUpperCase();
  const terms: PositionalTerm[] = [];
  const baseBig = BigInt(base);
  let total = 0n;

  const len = clean.length;
  for (let i = 0; i < len; i++) {
    const c = clean[i];
    const placeIndex = len - 1 - i;
    let digitValue = 0n;

    if (c >= '0' && c <= '9') {
      digitValue = BigInt(c.charCodeAt(0) - '0'.charCodeAt(0));
    } else if (c >= 'A' && c <= 'F') {
      digitValue = BigInt(c.charCodeAt(0) - 'A'.charCodeAt(0) + 10);
    }

    let baseWeight = 1n;
    for (let p = 0; p < placeIndex; p++) {
      baseWeight *= baseBig;
    }

    const evaluatedTerm = digitValue * baseWeight;
    total += evaluatedTerm;

    terms.push({
      digitChar: c,
      digitValue,
      placeIndex,
      baseWeight,
      evaluatedTerm,
    });
  }

  const formulaParts = terms.map((t) => `(${t.digitChar} × ${base}^${t.placeIndex})`);
  const formulaString = formulaParts.join(' + ');
  const expandedParts = terms.map((t) => t.evaluatedTerm.toString());
  const expandedSumString = expandedParts.join(' + ') + ` = ${total.toString()}`;

  const baseLabels: Record<number, string> = {
    2: 'Binary (Base 2)',
    8: 'Octal (Base 8)',
    10: 'Decimal (Base 10)',
    16: 'Hexadecimal (Base 16)',
  };

  return {
    base,
    baseLabel: baseLabels[base] || `Base ${base}`,
    terms,
    totalValue: total,
    formulaString,
    expandedSumString,
  };
}
