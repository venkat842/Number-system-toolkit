# Number System Toolkit

A modern, responsive browser-based tool for number base conversion, prime checking, and palindrome checking — ported directly from a C++ console application into React, TypeScript, and Tailwind CSS.

## Features

- **Base Conversion**:
  - Decimal → Binary, Octal, Hexadecimal (simultaneous 3-base output)
  - Binary → Decimal
  - Octal → Decimal
  - Hexadecimal → Decimal
  - Strict input validation per base with inline error handling.
  - Step-by-step mathematical explanations including repeated division and positional place-value expansion ($\sum d_i \times b^i$).

- **Prime Checker**:
  - Checks if a positive integer is prime or composite using trial division up to $\lfloor\sqrt{N}\rfloor$.
  - Displays prime/composite verdict, factorization proof, tested candidate factors, and mathematical explanations.

- **Palindrome Checker**:
  - **Number Mode**: Verifies integer reflection symmetry via modulo-10 digit reversal.
  - **Word / Phrase Mode**: Verifies phrase palindromes, normalizing text by ignoring case, spaces, and punctuation (e.g., *"A man a plan a canal Panama"*).
  - Displays step-by-step digit reversal arithmetic and bilateral two-pointer character pair matching.

- **Interactive Canvas Hero**:
  - Mouse-controlled live radix scrubber across viewport.
  - Per-digit visual highlight on value changes.

- **Session History**:
  - Persistent client-side session journal tracking the last 5 operations.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Fonts**: Space Grotesk, IBM Plex Sans, IBM Plex Mono

## Getting Started

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Credits

Number System Toolkit — C++ to Web Port
