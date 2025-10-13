const express = require('express');
const { gameRooms } = require('../shared/gameData');

const app = express();

const DIFFICULTY_LEVELS = {
  easy: { letters: 9, time: 120 },
  medium: { letters: 8, time: 90 },
  hard: { letters: 7, time: 60 },
};

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

// Spielstatus abrufen
app.get('/', (req, res) => {
  const { gameCode } = req.query;
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
  });
});

module.exports = app;
