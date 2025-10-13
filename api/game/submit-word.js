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

  // Wort hinzufügen
  player.words.push(word.toUpperCase());
  player.score = player.words.length;
  gameRoom.lastUpdate = Date.now();

  // Prüfen auf Scrabster
  if (isScrabster(word, gameRoom.letters)) {
    player.score += 2;
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
