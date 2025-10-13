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

// Spiel verlassen
app.post('/', (req, res) => {
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
