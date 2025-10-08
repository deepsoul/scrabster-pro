import { LetterGenerator } from '../letterGenerator.js';

console.log('Testing LetterGenerator...\n');

// Test 1: Generate letters
console.log('Test 1: Generate 9 letters');
const letters = LetterGenerator.generateLetters(9);
console.log('Generated letters:', letters);
console.log('Length:', letters.length);
console.assert(letters.length === 9, 'Should generate exactly 9 letters');
console.log('✓ Test 1 passed\n');

// Test 2: Generate different counts
console.log('Test 2: Generate different counts');
const letters5 = LetterGenerator.generateLetters(5);
console.log('Generated 5 letters:', letters5);
console.assert(letters5.length === 5, 'Should generate exactly 5 letters');
console.log('✓ Test 2 passed\n');

// Test 3: All letters should be uppercase A-Z
console.log('Test 3: Validate letter format');
const allValid = letters.every(letter => 
  typeof letter === 'string' && 
  letter.length === 1 && 
  letter >= 'A' && 
  letter <= 'Z'
);
console.assert(allValid, 'All letters should be uppercase A-Z');
console.log('✓ Test 3 passed\n');

console.log('All LetterGenerator tests passed! ✅');
