const express = require('express');
const cors = require('cors');
const app = express();

// CORS für alle API-Routen
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// In-memory storage für Spiele (in Produktion würde man Redis verwenden)
const gameRooms = new Map();
const playerConnections = new Map();

// Gewichtetes deutsches Alphabet
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

const DIFFICULTY_LEVELS = {
  easy: { letters: 12, time: 120 },
  medium: { letters: 10, time: 90 },
  hard: { letters: 8, time: 60 },
};

// Hilfsfunktionen
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateLetters(count) {
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

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production'
      ? 'https://scrabster-pro.vercel.app'
      : 'http://localhost:5173'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Spiel erstellen
app.post('/game/create', (req, res) => {
  const { username, difficulty } = req.body;

  if (!username || !difficulty) {
    return res
      .status(400)
      .json({ error: 'Username und Schwierigkeit erforderlich' });
  }

  const gameCode = generateGameCode();
  const difficultyConfig = DIFFICULTY_LEVELS[difficulty];

  const gameRoom = {
    code: gameCode,
    difficulty: difficulty,
    letters: generateLetters(difficultyConfig.letters),
    timeLeft: difficultyConfig.time,
    players: new Map(),
    gameState: 'waiting',
    gameStartTime: null,
    lastUpdate: Date.now(),
  };

  const playerId = `player_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const player = {
    id: playerId,
    username: username,
    words: [],
    score: 0,
  };

  gameRoom.players.set(playerId, player);
  gameRooms.set(gameCode, gameRoom);
  playerConnections.set(playerId, gameCode);

  res.json({
    gameCode: gameCode,
    difficulty: difficulty,
    letters: gameRoom.letters,
    timeLeft: gameRoom.timeLeft,
    playerId: playerId,
    players: [player],
  });
});

// Spiel beitreten
app.post('/game/join', (req, res) => {
  const { gameCode, username } = req.body;

  if (!gameCode || !username) {
    return res
      .status(400)
      .json({ error: 'Spielcode und Username erforderlich' });
  }

  const gameRoom = gameRooms.get(gameCode);
  if (!gameRoom) {
    return res.status(404).json({ error: 'Spiel nicht gefunden' });
  }

  if (gameRoom.gameState !== 'waiting') {
    return res.status(400).json({ error: 'Spiel bereits gestartet' });
  }

  if (gameRoom.players.size >= 8) {
    return res.status(400).json({ error: 'Spiel ist voll' });
  }

  const playerId = `player_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const player = {
    id: playerId,
    username: username,
    words: [],
    score: 0,
  };

  gameRoom.players.set(playerId, player);
  playerConnections.set(playerId, gameCode);
  gameRoom.lastUpdate = Date.now();

  res.json({
    gameCode: gameCode,
    difficulty: gameRoom.difficulty,
    letters: gameRoom.letters,
    timeLeft: gameRoom.timeLeft,
    playerId: playerId,
    players: Array.from(gameRoom.players.values()),
  });
});

// Spiel starten
app.post('/game/start', (req, res) => {
  const { gameCode, playerId } = req.body;

  const gameRoom = gameRooms.get(gameCode);
  if (!gameRoom || !gameRoom.players.has(playerId)) {
    return res.status(400).json({ error: 'Nicht autorisiert' });
  }

  if (gameRoom.players.size < 2) {
    return res.status(400).json({ error: 'Mindestens 2 Spieler erforderlich' });
  }

  gameRoom.gameState = 'playing';
  gameRoom.gameStartTime = Date.now();
  gameRoom.lastUpdate = Date.now();

  res.json({
    success: true,
    letters: gameRoom.letters,
    timeLeft: gameRoom.timeLeft,
    players: Array.from(gameRoom.players.values()),
  });
});

// Wort einreichen
app.post('/game/submit-word', (req, res) => {
  const { gameCode, playerId, word } = req.body;

  const gameRoom = gameRooms.get(gameCode);
  if (!gameRoom || gameRoom.gameState !== 'playing') {
    return res.status(400).json({ error: 'Spiel nicht aktiv' });
  }

  const player = gameRoom.players.get(playerId);
  if (!player) {
    return res.status(400).json({ error: 'Spieler nicht gefunden' });
  }

  // Wort validieren
  if (!validateWord(word, gameRoom.letters)) {
    return res.status(400).json({ error: 'Wort enthält ungültige Buchstaben' });
  }

  // Prüfen ob Wort bereits verwendet wurde
  if (player.words.includes(word.toUpperCase())) {
    return res.status(400).json({ error: 'Wort bereits verwendet' });
  }

  // Wort hinzufügen
  player.words.push(word.toUpperCase());

  // Punkte basierend auf verwendeten Buchstaben berechnen
  const wordLetters = word.toUpperCase().split('');
  const availableLetters = [...gameRoom.letters];
  let usedLetters = 0;

  // Zählen, wie viele Buchstaben aus der verfügbaren Liste verwendet wurden
  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      usedLetters++;
      availableLetters.splice(index, 1); // Buchstabe "verbrauchen"
    }
  }

  // Punkte basierend auf verwendeten Buchstaben (mindestens 1 Punkt pro Wort)
  const wordScore = Math.max(1, usedLetters);
  player.score += wordScore;
  gameRoom.lastUpdate = Date.now();

  // Prüfen auf Scrabster
  if (isScrabster(word, gameRoom.letters)) {
    player.score += 2;
    gameRoom.gameState = 'finished';
    
    // Bei Scrabster gewinnt der Spieler automatisch
    gameRoom.winner = player;
    gameRoom.isDraw = false;

    return res.json({
      success: true,
      scrabster: true,
      scrabsterWord: word.toUpperCase(),
      players: Array.from(gameRoom.players.values()),
      winner: gameRoom.winner,
      isDraw: gameRoom.isDraw,
    });
  }

  res.json({
    success: true,
    word: word.toUpperCase(),
    players: Array.from(gameRoom.players.values()),
  });
});

// Spielstatus abrufen
app.get('/game/status/:gameCode', (req, res) => {
  const { gameCode } = req.params;
  const gameRoom = gameRooms.get(gameCode);

  if (!gameRoom) {
    return res.status(404).json({ error: 'Spiel nicht gefunden' });
  }

  // Timer aktualisieren
  if (gameRoom.gameState === 'playing' && gameRoom.gameStartTime) {
    const elapsed = Math.floor((Date.now() - gameRoom.gameStartTime) / 1000);
    const difficultyConfig = DIFFICULTY_LEVELS[gameRoom.difficulty];
    gameRoom.timeLeft = Math.max(0, difficultyConfig.time - elapsed);

    if (gameRoom.timeLeft <= 0) {
      gameRoom.gameState = 'finished';
      // Gewinner ermitteln (höchste Punktzahl, aber nur Spieler mit Wörtern)
      const players = Array.from(gameRoom.players.values());
      
      // Nur Spieler mit mindestens einem Wort berücksichtigen
      const playersWithWords = players.filter(p => p.words && p.words.length > 0);
      
      if (playersWithWords.length === 0) {
        // Kein Spieler hat Wörter eingegeben
        gameRoom.winner = null;
        gameRoom.isDraw = false;
      } else {
        const maxScore = Math.max(...playersWithWords.map(p => p.score));
        const winners = playersWithWords.filter(p => p.score === maxScore);
        
        // Gewinner-Information hinzufügen
        gameRoom.winner = winners.length === 1 ? winners[0] : null; // Bei Gleichstand: kein Gewinner
        gameRoom.isDraw = winners.length > 1;
      }
    }
  }

  res.json({
    gameCode: gameRoom.code,
    difficulty: gameRoom.difficulty,
    letters: gameRoom.letters,
    timeLeft: gameRoom.timeLeft,
    gameState: gameRoom.gameState,
    players: Array.from(gameRoom.players.values()),
    lastUpdate: gameRoom.lastUpdate,
    winner: gameRoom.winner || null,
    isDraw: gameRoom.isDraw || false,
  });
});

// Spiel verlassen
app.post('/game/leave', (req, res) => {
  const { gameCode, playerId } = req.body;

  const gameRoom = gameRooms.get(gameCode);
  if (gameRoom && gameRoom.players.has(playerId)) {
    gameRoom.players.delete(playerId);
    playerConnections.delete(playerId);
    gameRoom.lastUpdate = Date.now();

    if (gameRoom.players.size === 0) {
      gameRooms.delete(gameCode);
    }
  }

  res.json({ success: true });
});

module.exports = app;
