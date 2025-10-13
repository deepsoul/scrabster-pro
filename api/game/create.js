const express = require('express');
const {
  gameRooms,
  playerConnections,
  generateGameCode,
  generateLetters,
} = require('../shared/gameData');

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

// Spiel erstellen
app.post('/', (req, res) => {
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

module.exports = app;
