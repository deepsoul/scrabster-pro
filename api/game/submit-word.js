const express = require('express');
const { gameRooms, validateWord, isScrabster } = require('../shared/gameData');

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
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

// Wort einreichen
app.post('/', (req, res) => {
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

  // Wort hinzufügen und Punkte basierend auf verwendeten Buchstaben berechnen
  player.words.push(word.toUpperCase());

  // Berechne Punkte basierend auf verwendeten Buchstaben
  const wordLetters = word.toUpperCase().split('');
  const availableLetters = [...gameRoom.letters];
  let usedLetters = 0;

  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      usedLetters++;
      availableLetters.splice(index, 1);
    }
  }

  // Punkte = Anzahl der verwendeten Buchstaben (mindestens 1)
  const wordScore = Math.max(1, usedLetters);
  player.score += wordScore;
  gameRoom.lastUpdate = Date.now();

  // Prüfen auf Scrabster
  if (isScrabster(word, gameRoom.letters)) {
    // Scrabster-Bonus: Zusätzliche Punkte für alle Buchstaben
    const scrabsterBonus = gameRoom.letters.length;
    player.score += scrabsterBonus;
    gameRoom.gameState = 'finished';

    return res.json({
      success: true,
      scrabster: true,
      scrabsterWord: word.toUpperCase(),
      players: Array.from(gameRoom.players.values()),
    });
  }

  res.json({
    success: true,
    word: word.toUpperCase(),
    players: Array.from(gameRoom.players.values()),
  });
});

module.exports = app;
