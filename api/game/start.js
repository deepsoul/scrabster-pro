const express = require('express');
const { gameRooms } = require('../shared/gameData');

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

// Spiel starten
app.post('/', (req, res) => {
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

module.exports = app;
