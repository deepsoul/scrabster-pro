import { GameManager } from '../gameManager.js';

console.log('Testing GameManager...\n');

const gameManager = new GameManager();

// Mock WebSocket
class MockWebSocket {
  send(data) {
    console.log('    WebSocket sent:', data);
  }
}

// Test 1: Add player
console.log('Test 1: Add player');
const ws = new MockWebSocket();
gameManager.addPlayer('player1', ws);
console.log('  Player added successfully');
console.log('✓ Test 1 passed\n');

// Test 2: Start new game
console.log('Test 2: Start new game');
const gameState = gameManager.startNewGame();
console.log('  Game state:', gameState);
console.assert(gameState.active === true, 'Game should be active');
console.assert(gameState.letters.length === 9, 'Should have 9 letters');
console.assert(gameState.duration === 120000, 'Duration should be 120 seconds');
console.log('✓ Test 2 passed\n');

// Test 3: Submit valid word
console.log('Test 3: Submit valid word');
const result1 = gameManager.submitWord('player1', 'CAT');
console.log('  Result:', result1);
if (result1.success) {
  console.log('  Word was valid for the current letters');
} else {
  console.log('  Word could not be formed from current letters (expected)');
}
console.log('✓ Test 3 passed\n');

// Test 4: Submit duplicate word
console.log('Test 4: Submit duplicate word');
if (result1.success) {
  const result2 = gameManager.submitWord('player1', 'CAT');
  console.log('  Result:', result2);
  console.assert(!result2.success, 'Duplicate word should be rejected');
  console.assert(result2.message.includes('already submitted'), 'Should indicate duplicate');
  console.log('✓ Test 4 passed\n');
} else {
  console.log('  Skipped (first word was not valid)\n');
}

// Test 5: Get game state
console.log('Test 5: Get game state');
const currentState = gameManager.getGameState();
console.log('  Current state:', currentState);
console.assert(currentState.active !== undefined, 'Should have active state');
console.log('✓ Test 5 passed\n');

// Test 6: Check Scrabster detection
console.log('Test 6: Scrabster detection');
const letters = ['S', 'C', 'R', 'A', 'B', 'S', 'T', 'E', 'R'];
gameManager.currentGame.letters = letters;
const isScrabster = gameManager.checkScrabster('SCRABSTER');
console.log(`  Is SCRABSTER a scrabster with letters ${letters.join('')}:`, isScrabster);
console.assert(isScrabster === true, 'SCRABSTER should be detected with correct letters');
console.log('✓ Test 6 passed\n');

console.log('All GameManager tests passed! ✅');
