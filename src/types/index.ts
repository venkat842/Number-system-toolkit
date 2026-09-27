export type ToolType = 'landing' | 'base-conversion' | 'prime-checker' | 'palindrome-checker';

export type BaseConversionMode =
  | 'dec-to-all'
  | 'bin-to-dec'
  | 'oct-to-dec'
  | 'hex-to-dec';

export type PalindromeMode = 'number' | 'text';

export interface HistoryItem {
  id: string;
  timestamp: Date;
  tool: 'Base Conversion' | 'Prime Checker' | 'Palindrome Checker';
  summary: string;
  detail: string;
  badgeType?: 'success' | 'warning' | 'info';
}
