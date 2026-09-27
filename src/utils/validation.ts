/**
 * Validation Module
 * Faithful TypeScript port of C++ validation routines:
 * isValidBinary, isValidOctal, isValidHex, and integer checking.
 */

export function isValidInteger(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed === '') return false;
  // Non-negative integer digits
  return /^\d+$/.test(trimmed);
}

export function isValidBinary(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed === '') return false;
  // Only 0 and 1
  return /^[01]+$/.test(trimmed);
}

export function isValidOctal(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed === '') return false;
  // Only 0-7
  return /^[0-7]+$/.test(trimmed);
}

export function isValidHex(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed === '') return false;
  // Only 0-9, A-F, a-f
  return /^[0-9A-Fa-f]+$/.test(trimmed);
}
