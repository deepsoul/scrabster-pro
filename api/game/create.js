const {
  generateGameCode,
  generateLetters,
  DIFFICULTY_LEVELS,
  setCorsHeaders,
} = require('../shared/gameData');
const {
  setGameRoom,
  setPlayerConnection,
} = require('../shared/redisClient');

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return setCorsHeaders(res).status(200).end();
  }

  // Set CORS headers
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, difficulty } = req.body;

    if (!username || !difficulty) {
      return res
        .status(400)
        .json({ error: 'Username und Schwierigkeit erforderlich' });
    }

    const gameCode = generateGameCode();
    const difficultyConfig = DIFFICULTY_LEVELS[difficulty];

    const playerId = `player_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const player = {
      id: playerId,
      username: username,
      words: [],
      score: 0,
    };

    const gameRoom = {
      code: gameCode,
      difficulty: difficulty,
      letters: generateLetters(difficultyConfig.letters),
      timeLeft: difficultyConfig.time,
      players: [player], // Array statt Map für JSON-Serialisierung
      gameState: 'waiting',
      gameStartTime: null,
      lastUpdate: Date.now(),
    };

    // In Redis speichern
    await setGameRoom(gameCode, gameRoom);
    await setPlayerConnection(playerId, gameCode);

    return res.json({
      gameCode: gameCode,
      difficulty: difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      playerId: playerId,
      players: gameRoom.players,
    });
  } catch (error) {
    console.error('Create game error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
