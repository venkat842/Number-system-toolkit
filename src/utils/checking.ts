/**
 * Checking Module
 * Direct TypeScript port of C++ Checking Functions:
 * - isPrime
 * - isPalindrome (numeric)
 * - isPalindromeString (word / phrase)
 */

export interface PrimeCheckResult {
  isPrime: boolean;
  checkedNumber: string;
  sqrtLimit: string;
  testedCount: number;
  testedCandidates: string[];
  reason: string;
  explanation: string;
  firstDivisor?: string;
  complementFactor?: string;
}

/**
 * Prime Number Check
 */
export function isPrime(n: bigint | number): PrimeCheckResult {
  const num = typeof n === 'bigint' ? n : BigInt(Math.floor(n));

  if (num < 2n) {
    return {
      isPrime: false,
      checkedNumber: num.toString(),
      sqrtLimit: '0',
      testedCount: 0,
      testedCandidates: [],
      reason: num < 0n ? 'Negative integers cannot be prime.' : `${num} is not prime by definition.`,
      explanation: num < 0n
        ? 'Prime numbers are defined exclusively for positive integers greater than 1.'
        : num === 0n
        ? '0 is not a prime number because it has an infinite number of divisors (0 ÷ k = 0 for any non-zero k).'
        : '1 is not a prime number because a prime must have exactly two distinct positive divisors: 1 and itself. The number 1 has only one divisor (itself).',
    };
  }

  if (num === 2n) {
    return {
      isPrime: true,
      checkedNumber: '2',
      sqrtLimit: '1',
      testedCount: 1,
      testedCandidates: ['2'],
      reason: '2 is the smallest prime number and the only even prime.',
      explanation: 'The only positive divisors of 2 are 1 and 2. Since it has exactly two distinct divisors, it satisfies the definition of a prime number.',
    };
  }

  // Check even numbers
  if (num % 2n === 0n) {
    const quotient = num / 2n;
    return {
      isPrime: false,
      checkedNumber: num.toString(),
      sqrtLimit: (num < 1000000000000n ? Math.floor(Math.sqrt(Number(num))) : '√N').toString(),
      testedCount: 1,
      testedCandidates: ['2'],
      firstDivisor: '2',
      complementFactor: quotient.toString(),
      reason: `Composite number: divisible by 2 (${num} = 2 × ${quotient}).`,
      explanation: `${num} is an even integer greater than 2. It can be factored as 2 × ${quotient}, meaning it has at least three positive divisors (1, 2, and ${num}), so it is composite (not prime).`,
    };
  }

  // Calculate integer sqrt limit
  let approxSqrt = 1n;
  if (num < 100000000000000n) {
    approxSqrt = BigInt(Math.floor(Math.sqrt(Number(num))));
  } else {
    let x0 = num / 2n;
    if (x0 !== 0n) {
      let x1 = (x0 + num / x0) / 2n;
      while (x1 < x0) {
        x0 = x1;
        x1 = (x0 + num / x0) / 2n;
      }
      approxSqrt = x0;
    }
  }

  const tested: string[] = ['2'];
  let i = 3n;
  let tests = 1;

  while (i * i <= num) {
    tests++;
    if (tested.length < 15) {
      tested.push(i.toString());
    }
    if (num % i === 0n) {
      const quotient = num / i;
      return {
        isPrime: false,
        checkedNumber: num.toString(),
        sqrtLimit: approxSqrt.toString(),
        testedCount: tests,
        testedCandidates: tested,
        firstDivisor: i.toString(),
        complementFactor: quotient.toString(),
        reason: `Composite number: divisible by ${i} (${num} = ${i} × ${quotient}).`,
        explanation: `Trial division checked factors up to ⌊√${num}⌋ = ${approxSqrt}. When testing candidate divisor ${i}, ${num} ÷ ${i} = ${quotient} with remainder 0. Because ${num} has factors other than 1 and itself, it is not prime.`,
      };
    }
    i += 2n;
  }

  return {
    isPrime: true,
    checkedNumber: num.toString(),
    sqrtLimit: approxSqrt.toString(),
    testedCount: tests,
    testedCandidates: tested,
    reason: `Prime number: no divisors found in range [2 .. ${approxSqrt}].`,
    explanation: `We only need to test divisors up to ⌊√${num}⌋ = ${approxSqrt} because if ${num} had any factor larger than √${num}, its corresponding factor pair would have to be smaller than √${num}. Since no candidate divisor in [2 .. ${approxSqrt}] divides ${num} with remainder 0, ${num} is proven to be PRIME.`,
  };
}

export interface PalindromeNumberResult {
  isPalindrome: boolean;
  original: string;
  reversed: string;
  reversalSteps: { step: number; digit: number; remaining: string; currentReversed: string }[];
  mismatchIndex?: number;
  explanation: string;
}

/**
 * Numeric Palindrome Check
 */
export function isPalindromeNumber(n: bigint | number): PalindromeNumberResult {
  let num = typeof n === 'bigint' ? n : BigInt(Math.floor(n));
  const isNegative = num < 0n;
  if (isNegative) num = -num;

  const originalStr = num.toString();
  let temp = num;
  let reversed = 0n;
  const reversalSteps: { step: number; digit: number; remaining: string; currentReversed: string }[] = [];

  let stepCount = 0;
  while (temp > 0n) {
    stepCount++;
    const digit = Number(temp % 10n);
    reversed = reversed * 10n + BigInt(digit);
    temp = temp / 10n;
    if (reversalSteps.length < 10) {
      reversalSteps.push({
        step: stepCount,
        digit,
        remaining: temp.toString(),
        currentReversed: reversed.toString(),
      });
    }
  }

  const reversedStr = reversed.toString();
  const matches = originalStr === reversedStr && !isNegative;

  let mismatchIndex: number | undefined;
  if (!matches && !isNegative) {
    for (let i = 0; i < originalStr.length; i++) {
      if (originalStr[i] !== reversedStr[i]) {
        mismatchIndex = i;
        break;
      }
    }
  }

  let explanation = '';
  if (isNegative) {
    explanation = `Negative numbers like -${originalStr} are not palindromes because the leading negative sign '-' cannot be mirrored at the end.`;
  } else if (matches) {
    explanation = `The number ${originalStr} reads identically forward (${originalStr}) and backward (${reversedStr}). Every digit at position i equals the digit at the mirrored position (length - 1 - i).`;
  } else {
    explanation = `Reading forward gives ${originalStr}, but reversing the digits gives ${reversedStr}. They differ${
      mismatchIndex !== undefined ? ` at index ${mismatchIndex} ('${originalStr[mismatchIndex]}' ≠ '${reversedStr[mismatchIndex]}')` : ''
    }, so it is not a palindrome.`;
  }

  return {
    isPalindrome: matches,
    original: (isNegative ? '-' : '') + originalStr,
    reversed: reversedStr,
    reversalSteps,
    mismatchIndex,
    explanation,
  };
}

export interface SymmetryPair {
  leftIndex: number;
  rightIndex: number;
  leftChar: string;
  rightChar: string;
  matches: boolean;
}

export interface PalindromeStringResult {
  isPalindrome: boolean;
  original: string;
  cleaned: string;
  reversedCleaned: string;
  pairs: SymmetryPair[];
  mismatchPair?: SymmetryPair;
  explanation: string;
}

/**
 * Word/Phrase Palindrome Check (ignores spaces, punctuation, case-insensitive)
 */
export function isPalindromeString(s: string): PalindromeStringResult {
  let clean = '';
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (/[a-zA-Z0-9]/.test(char)) {
      clean += char.toLowerCase();
    }
  }

  let left = 0;
  let right = clean.length - 1;
  let matches = true;
  const pairs: SymmetryPair[] = [];
  let mismatchPair: SymmetryPair | undefined;

  while (left <= right) {
    const isPairMatch = clean[left] === clean[right];
    const pair: SymmetryPair = {
      leftIndex: left,
      rightIndex: right,
      leftChar: clean[left],
      rightChar: clean[right],
      matches: isPairMatch,
    };
    pairs.push(pair);

    if (!isPairMatch) {
      matches = false;
      if (!mismatchPair) mismatchPair = pair;
    }
    left++;
    right--;
  }

  const reversedCleaned = clean.split('').reverse().join('');

  let explanation = '';
  if (clean.length === 0) {
    explanation = 'The input string contains no alphanumeric characters after removing punctuation and whitespace.';
  } else if (matches) {
    explanation = `After stripping spaces and punctuation and converting to lowercase, the normalized text "${clean}" matches its exact reverse "${reversedCleaned}". All ${pairs.length} mirrored character pairs match.`;
  } else {
    explanation = `After normalization, the text "${clean}" differs from its reverse "${reversedCleaned}". A mismatch was found between character '${mismatchPair?.leftChar}' at position ${mismatchPair?.leftIndex} and '${mismatchPair?.rightChar}' at position ${mismatchPair?.rightIndex}.`;
  }

  return {
    isPalindrome: matches,
    original: s,
    cleaned: clean,
    reversedCleaned,
    pairs,
    mismatchPair,
    explanation,
  };
}
