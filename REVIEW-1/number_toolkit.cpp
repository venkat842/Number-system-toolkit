/*
    PROJECT      : Number System Toolkit
    LANGUAGE     : C++
    DESCRIPTION  : A menu-driven console application that performs:
                   1) Number base conversions (Decimal, Binary, Octal, Hexadecimal)
                   2) Prime number checking
                   3) Palindrome number checking
                   Includes input validation and loop-driven menu navigation.
*/

#include <iostream>
#include <string>
#include <cmath>
#include <cctype>
#include <algorithm>
using namespace std;

// ---------------------- Function Prototypes ----------------------
long long decimalToBinaryValue(long long n);
long long decimalToOctalValue(long long n);
string   decimalToHexValue(long long n);
long long binaryToDecimal(long long n);
long long octalToDecimal(long long n);
long long hexToDecimal(string hex);

bool isPrime(long long n);
bool isPalindrome(long long n);
bool isPalindromeString(string s);

int  getValidInt(const string &prompt);
bool isValidBinary(long long n);
bool isValidOctal(long long n);
bool isValidHex(const string &s);

void showMenu();
void conversionMenu();
void checkingMenu();

// ---------------------- main() ----------------------
int main() {
    int choice;
    do {
        showMenu();
        choice = getValidInt("Enter your choice: ");

        switch (choice) {
            case 1: conversionMenu(); break;
            case 2: checkingMenu();   break;
            case 3: cout << "\nThank you for using Number System Toolkit!\n"; break;
            default: cout << "\nInvalid choice! Please select between 1 and 3.\n";
        }
    } while (choice != 3);

    return 0;
}

// ---------------------- Menus ----------------------
void showMenu() {
    cout << "\n==================================================\n";
    cout << "            NUMBER SYSTEM TOOLKIT\n";
    cout << "==================================================\n";
    cout << " 1. Number Base Conversion\n";
    cout << " 2. Prime / Palindrome Checker\n";
    cout << " 3. Exit\n";
    cout << "==================================================\n";
}

void conversionMenu() {
    int ch;
    cout << "\n----- Number Base Conversion -----\n";
    cout << " 1. Decimal to Binary/Octal/Hexadecimal\n";
    cout << " 2. Binary to Decimal\n";
    cout << " 3. Octal to Decimal\n";
    cout << " 4. Hexadecimal to Decimal\n";
    ch = getValidInt("Enter your choice: ");

    if (ch == 1) {
        long long n = getValidInt("Enter a decimal number: ");
        cout << "Binary      : " << decimalToBinaryValue(n) << "\n";
        cout << "Octal       : " << decimalToOctalValue(n) << "\n";
        cout << "Hexadecimal : " << decimalToHexValue(n) << "\n";
    } else if (ch == 2) {
        long long n;
        do {
            n = getValidInt("Enter a binary number: ");
            if (!isValidBinary(n)) cout << "Invalid binary number! Digits must be 0/1 only.\n";
        } while (!isValidBinary(n));
        cout << "Decimal equivalent : " << binaryToDecimal(n) << "\n";
    } else if (ch == 3) {
        long long n;
        do {
            n = getValidInt("Enter an octal number: ");
            if (!isValidOctal(n)) cout << "Invalid octal number! Digits must be 0-7 only.\n";
        } while (!isValidOctal(n));
        cout << "Decimal equivalent : " << octalToDecimal(n) << "\n";
    } else if (ch == 4) {
        string h;
        cout << "Enter a hexadecimal number: ";
        cin >> h;
        while (!isValidHex(h)) {
            cout << "Invalid hexadecimal number! Use digits 0-9, A-F only.\n";
            cout << "Enter a hexadecimal number: ";
            cin >> h;
        }
        cout << "Decimal equivalent : " << hexToDecimal(h) << "\n";
    } else {
        cout << "Invalid choice!\n";
    }
}

void checkingMenu() {
    int ch;
    cout << "\n----- Prime / Palindrome Checker -----\n";
    cout << " 1. Check Prime Number\n";
    cout << " 2. Check Palindrome Number\n";
    cout << " 3. Check Palindrome Word/Phrase\n";
    ch = getValidInt("Enter your choice: ");

    if (ch == 1) {
        long long n = getValidInt("Enter a number: ");
        if (isPrime(n)) cout << n << " is a PRIME number.\n";
        else            cout << n << " is NOT a prime number.\n";
    } else if (ch == 2) {
        long long n = getValidInt("Enter a number: ");
        if (isPalindrome(n)) cout << n << " is a PALINDROME number.\n";
        else                 cout << n << " is NOT a palindrome number.\n";
    } else if (ch == 3) {
        string word;
        cout << "Enter a word or phrase: ";
        cin.ignore();
        getline(cin, word);
        if (isPalindromeString(word)) cout << "\"" << word << "\" is a PALINDROME.\n";
        else                          cout << "\"" << word << "\" is NOT a palindrome.\n";
    } else {
        cout << "Invalid choice!\n";
    }
}

// ---------------------- Conversion Functions ----------------------
// Decimal -> Binary (returned as a number made only of 0/1 digits)
long long decimalToBinaryValue(long long n) {
    if (n == 0) return 0;
    long long binary = 0, place = 1;
    while (n > 0) {
        binary += (n % 2) * place;
        place *= 10;
        n /= 2;
    }
    return binary;
}

// Decimal -> Octal
long long decimalToOctalValue(long long n) {
    if (n == 0) return 0;
    long long octal = 0, place = 1;
    while (n > 0) {
        octal += (n % 8) * place;
        place *= 10;
        n /= 8;
    }
    return octal;
}

// Decimal -> Hexadecimal (string)
string decimalToHexValue(long long n) {
    if (n == 0) return "0";
    string hex = "";
    const char digits[] = "0123456789ABCDEF";
    while (n > 0) {
        hex = digits[n % 16] + hex;
        n /= 16;
    }
    return hex;
}

// Binary (entered as digits) -> Decimal
long long binaryToDecimal(long long n) {
    long long decimal = 0, base = 1;
    while (n > 0) {
        long long lastDigit = n % 10;
        decimal += lastDigit * base;
        base *= 2;
        n /= 10;
    }
    return decimal;
}

// Octal -> Decimal
long long octalToDecimal(long long n) {
    long long decimal = 0, base = 1;
    while (n > 0) {
        long long lastDigit = n % 10;
        decimal += lastDigit * base;
        base *= 8;
        n /= 10;
    }
    return decimal;
}

// Hexadecimal (string) -> Decimal
long long hexToDecimal(string hex) {
    long long decimal = 0;
    for (char c : hex) {
        c = toupper(c);
        int value = (c >= '0' && c <= '9') ? (c - '0') : (c - 'A' + 10);
        decimal = decimal * 16 + value;
    }
    return decimal;
}

// ---------------------- Checking Functions ----------------------
bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

bool isPalindrome(long long n) {
    long long original = n, reversed = 0;
    if (n < 0) n = -n;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return original == reversed;
}

// Checks if a word/phrase is a palindrome (case-insensitive, ignores spaces & punctuation)
bool isPalindromeString(string s) {
    string clean = "";
    for (char c : s) {
        if (isalnum((unsigned char)c)) {
            clean += tolower(c);
        }
    }
    int left = 0, right = clean.length() - 1;
    while (left < right) {
        if (clean[left] != clean[right]) return false;
        left++;
        right--;
    }
    return true;
}

// ---------------------- Input Validation ----------------------
int getValidInt(const string &prompt) {
    long long value;
    cout << prompt;
    while (!(cin >> value)) {
        cout << "Invalid input! Please enter a valid integer: ";
        cin.clear();
        cin.ignore(10000, '\n');
    }
    return value;
}

bool isValidBinary(long long n) {
    while (n > 0) {
        long long digit = n % 10;
        if (digit != 0 && digit != 1) return false;
        n /= 10;
    }
    return true;
}

bool isValidOctal(long long n) {
    while (n > 0) {
        long long digit = n % 10;
        if (digit < 0 || digit > 7) return false;
        n /= 10;
    }
    return true;
}

bool isValidHex(const string &s) {
    if (s.empty()) return false;
    for (char c : s) {
        if (!isxdigit((unsigned char)c)) return false;
    }
    return true;
}
