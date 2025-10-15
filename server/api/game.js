const express = require('express');
const cors = require('cors');
const app = express();

// CORS wird in server.js konfiguriert - hier entfernt

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
  easy: { letters: 12, time: 120, scrabsterLetters: 3 },
  medium: { letters: 10, time: 90, scrabsterLetters: 4 },
  hard: { letters: 8, time: 60, scrabsterLetters: 5 },
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

function isScrabster(word, availableLetters, difficulty) {
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

// Middleware
app.use(express.json());

// CORS wird in server.js konfiguriert - hier entfernt

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
  if (isScrabster(word, gameRoom.letters, gameRoom.difficulty)) {
    // Scrabster: 10 Extrapunkte + Badge
    player.score += 10;

    // Scrabster-Badge hinzufügen (falls noch nicht vorhanden)
    if (!player.scrabsters) {
      player.scrabsters = 0;
    }
    player.scrabsters += 1;

    gameRoom.lastUpdate = Date.now();

    return res.json({
      success: true,
      scrabster: true,
      scrabsterWord: word.toUpperCase(),
      scrabsterCount: player.scrabsters,
      players: Array.from(gameRoom.players.values()),
      // Spiel läuft weiter - kein gameState = 'finished'
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
      const playersWithWords = players.filter(
        p => p.words && p.words.length > 0
      );

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
    chatMessages: gameRoom.chatMessages || [],
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

// Chat-Nachricht senden
app.post('/game/chat', (req, res) => {
  try {
    const { gameCode, playerId, message, username } = req.body;

    if (!gameCode || !playerId || !message || !username) {
      return res.status(400).json({
        error: 'Fehlende Parameter: gameCode, playerId, message, username',
      });
    }

    // Validate message length
    if (message.length > 200) {
      return res.status(400).json({
        error: 'Nachricht zu lang (max. 200 Zeichen)',
      });
    }

    const gameRoom = gameRooms.get(gameCode);
    if (!gameRoom) {
      return res.status(404).json({ error: 'Spiel nicht gefunden' });
    }

    // Check if player is in the game
    const player = gameRoom.players.get(playerId);
    if (!player) {
      return res.status(403).json({ error: 'Spieler nicht im Spiel' });
    }

    // Create chat message
    const chatMessage = {
      id: Date.now().toString(),
      playerId,
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add message to game room
    if (!gameRoom.chatMessages) {
      gameRoom.chatMessages = [];
    }

    gameRoom.chatMessages.push(chatMessage);

    // Keep only last 50 messages to prevent memory issues
    if (gameRoom.chatMessages.length > 50) {
      gameRoom.chatMessages = gameRoom.chatMessages.slice(-50);
    }

    gameRoom.lastUpdate = Date.now();

    res.json({
      success: true,
      message: chatMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

// Neues Spiel mit gleichen Spielern starten
app.post('/game/new', (req, res) => {
  try {
    const { gameCode } = req.body;

    if (!gameCode) {
      return res.status(400).json({
        error: 'Fehlende Parameter: gameCode',
      });
    }

    const gameRoom = gameRooms.get(gameCode);
    if (!gameRoom) {
      return res.status(404).json({ error: 'Spiel nicht gefunden' });
    }

    // Nur der Host kann ein neues Spiel starten
    const hostPlayer = Array.from(gameRoom.players.values())[0];
    if (!hostPlayer) {
      return res.status(403).json({ error: 'Kein Host gefunden' });
    }

    // Neues Spiel mit gleichen Spielern erstellen
    const newLetters = generateLetters(gameRoom.difficulty);
    const difficultyConfig = DIFFICULTY_LEVELS[gameRoom.difficulty];
    const newTimeLeft = difficultyConfig.time;

    // Spielzustand zurücksetzen
    gameRoom.letters = newLetters;
    gameRoom.timeLeft = newTimeLeft;
    gameRoom.gameState = 'waiting';
    gameRoom.gameStartTime = null; // Wichtig: gameStartTime zurücksetzen
    gameRoom.winner = null;
    gameRoom.isDraw = false;
    gameRoom.lastUpdate = Date.now();

    // Alle Spieler zurücksetzen (Wörter und Punkte löschen)
    gameRoom.players.forEach(player => {
      player.words = [];
      player.score = 0;
      player.scrabsters = 0;
    });

    // Chat-Nachrichten löschen
    gameRoom.chatMessages = [];

    console.log(
      `Neues Spiel gestartet für ${gameCode} mit ${gameRoom.players.size} Spielern`
    );

    res.json({
      success: true,
      gameCode: gameRoom.code,
      difficulty: gameRoom.difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      gameState: gameRoom.gameState,
      players: Array.from(gameRoom.players.values()),
      lastUpdate: gameRoom.lastUpdate,
    });
  } catch (error) {
    console.error('New game API error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
});

module.exports = app;
