// Redis wird jetzt über redisClient.js verwendet
// Die Maps hier sind nur noch für Fallback/legacy Code
// In Produktion wird Upstash Redis verwendet (siehe redisClient.js)

// Gewichtetes deutsches Alphabet
const weightedAlphabet = [
  'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', // E (20x)
  'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', // N (19x)
  'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', // I (18x)
  'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', // S (17x)
  'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', // R (16x)
  'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', // A (15x)
  'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', // T (14x)
  'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', // D (13x)
  'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', // H (12x)
  'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', // U (11x)
  'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', // L (10x)
  'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', // C (9x)
  'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', // G (8x)
  'M', 'M', 'M', 'M', 'M', 'M', 'M', // M (7x)
  'O', 'O', 'O', 'O', 'O', 'O', // O (6x)
  'B', 'B', 'B', 'B', 'B', // B (5x)
  'W', 'W', 'W', 'W', // W (4x)
  'F', 'F', 'F', // F (3x)
  'K', 'K', 'K', // K (3x)
  'Z', 'Z', 'Z', // Z (3x)
  'P', 'P', // P (2x)
  'V', 'V', // V (2x)
  'J', 'J', // J (2x)
  'Y', 'Y', // Y (2x)
  'X', // X (1x)
  'Q', // Q (1x)
];

export const DIFFICULTY_LEVELS = {
  easy: { letters: 12, time: 120, scrabsterLetters: 3 },
  medium: { letters: 10, time: 90, scrabsterLetters: 4 },
  hard: { letters: 8, time: 60, scrabsterLetters: 5 },
};

// Hilfsfunktionen
export function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateLetters(count) {
  const letters = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * weightedAlphabet.length);
    letters.push(weightedAlphabet[randomIndex]);
  }
  return letters;
}

export function validateWord(word, availableLetters) {
  const wordLetters = word.toUpperCase().split('');

  // Prüfen ob mindestens ein Buchstabe des Wortes in den verfügbaren Buchstaben enthalten ist
  for (const letter of wordLetters) {
    if (availableLetters.includes(letter)) {
      return true; // Mindestens ein Buchstabe ist verfügbar
    }
  }

  return false; // Kein Buchstabe des Wortes ist verfügbar
}

export function isScrabster(word, availableLetters, difficulty) {
  const wordLetters = word.toUpperCase().split('');
  const difficultyConfig = DIFFICULTY_LEVELS[difficulty];
  const requiredLetters = difficultyConfig.scrabsterLetters;

  // Zählen, wie viele Buchstaben aus der verfügbaren Liste verwendet wurden
  const availableLettersCopy = [...availableLetters];
  let usedLetters = 0;

  for (const letter of wordLetters) {
    const index = availableLettersCopy.indexOf(letter);
    if (index !== -1) {
      availableLettersCopy.splice(index, 1); // Buchstabe "verbrauchen"
      usedLetters++;
    }
  }

  // Scrabster wenn mindestens X Buchstaben aus der verfügbaren Liste verwendet wurden
  return usedLetters >= requiredLetters;
}

// CORS Helper
export function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  return response;
}
