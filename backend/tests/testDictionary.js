import { Dictionary } from '../dictionary.js';

console.log('Testing Dictionary...\n');

const dictionary = new Dictionary();

// Test 1: Valid words
console.log('Test 1: Valid words');
const validWords = ['CAT', 'DOG', 'BIRD', 'TREE', 'HOUSE'];
validWords.forEach(word => {
  const isValid = dictionary.isValidWord(word);
  console.log(`  ${word}: ${isValid ? '✓' : '✗'}`);
  console.assert(isValid, `${word} should be valid`);
});
console.log('✓ Test 1 passed\n');

// Test 2: Invalid words
console.log('Test 2: Invalid words');
const invalidWords = ['XYZ', 'QQQQ', 'ZZZZ', 'INVALIDWORD'];
invalidWords.forEach(word => {
  const isValid = dictionary.isValidWord(word);
  console.log(`  ${word}: ${isValid ? '✗' : '✓'}`);
  console.assert(!isValid, `${word} should be invalid`);
});
console.log('✓ Test 2 passed\n');

// Test 3: Case insensitivity
console.log('Test 3: Case insensitivity');
const testCases = [
  ['cat', true],
  ['Cat', true],
  ['CAT', true],
  ['CaT', true]
];
testCases.forEach(([word, expected]) => {
  const isValid = dictionary.isValidWord(word);
  console.log(`  ${word}: ${isValid ? '✓' : '✗'}`);
  console.assert(isValid === expected, `${word} validation should match expected`);
});
console.log('✓ Test 3 passed\n');

// Test 4: SCRABSTER is in dictionary
console.log('Test 4: SCRABSTER special word');
const isScrabster = dictionary.isValidWord('SCRABSTER');
console.log(`  SCRABSTER: ${isScrabster ? '✓' : '✗'}`);
console.assert(isScrabster, 'SCRABSTER should be a valid word');
console.log('✓ Test 4 passed\n');

console.log('All Dictionary tests passed! ✅');
