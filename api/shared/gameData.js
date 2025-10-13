// Globaler Speicher für Spiele (funktioniert nur innerhalb einer Vercel-Instanz)
// In Produktion sollte man Redis oder eine Datenbank verwenden
let gameRooms = new Map();
let playerConnections = new Map();

// Hilfsfunktionen
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateLetters(count) {
  const weightedAlphabet = [
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E', // E (20x)
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N', // N (19x)
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I', // I (18x)
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S',
    'S', // S (17x)
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R', // R (16x)
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A', // A (15x)
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T', // T (14x)
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D',
    'D', // D (13x)
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H',
    'H', // H (12x)
    'U',
    'U',
    'U',
    'U',
    'U',
    'U',
    'U',
    'U',
    'U',
    'U',
    'U', // U (11x)
    'L',
    'L',
    'L',
    'L',
    'L',
    'L',
    'L',
    'L',
    'L',
    'L', // L (10x)
    'C',
    'C',
    'C',
    'C',
    'C',
    'C',
    'C',
    'C',
    'C', // C (9x)
    'G',
    'G',
    'G',
    'G',
    'G',
    'G',
    'G',
    'G', // G (8x)
    'M',
    'M',
    'M',
    'M',
    'M',
    'M',
    'M', // M (7x)
    'O',
    'O',
    'O',
    'O',
    'O',
    'O', // O (6x)
    'B',
    'B',
    'B',
    'B',
    'B', // B (5x)
    'W',
    'W',
    'W',
    'W', // W (4x)
    'F',
    'F',
    'F', // F (3x)
    'K',
    'K',
    'K', // K (3x)
    'Z',
    'Z',
    'Z', // Z (3x)
    'P',
    'P', // P (2x)
    'V',
    'V', // V (2x)
    'J',
    'J', // J (2x)
    'Y',
    'Y', // Y (2x)
    'X', // X (1x)
    'Q', // Q (1x)
  ];

  const letters = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * weightedAlphabet.length);
    letters.push(weightedAlphabet[randomIndex]);
  }
  return letters;
}

function validateWord(word, availableLetters) {
  const wordLetters = word.toUpperCase().split('');

  // Prüfen ob mindestens ein Buchstabe des Wortes in den verfügbaren Buchstaben enthalten ist
  for (const letter of wordLetters) {
    if (availableLetters.includes(letter)) {
      return true; // Mindestens ein Buchstabe ist verfügbar
    }
  }

  return false; // Kein Buchstabe des Wortes ist verfügbar
}

function isScrabster(word, availableLetters) {
  const wordLetters = word.toUpperCase().split('');

  // Scrabster: Alle verfügbaren Buchstaben müssen verwendet werden
  if (wordLetters.length !== availableLetters.length) {
    return false;
  }

  // Prüfen ob alle Buchstaben des Wortes in den verfügbaren Buchstaben enthalten sind
  const availableLettersCopy = [...availableLetters];
  for (const letter of wordLetters) {
    const index = availableLettersCopy.indexOf(letter);
    if (index === -1) {
      return false; // Buchstabe nicht verfügbar
    }
    availableLettersCopy.splice(index, 1); // Buchstabe "verbrauchen"
  }

  return true; // Alle Buchstaben wurden verwendet
}

module.exports = {
  gameRooms,
  playerConnections,
  generateGameCode,
  generateLetters,
  validateWord,
  isScrabster,
};
