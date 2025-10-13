const express = require('express');
const { gameRooms, playerConnections } = require('../shared/gameData');

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

// Spiel beitreten
app.post('/', (req, res) => {
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

module.exports = app;
