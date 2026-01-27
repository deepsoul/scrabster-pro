const { generateLetters, DIFFICULTY_LEVELS, setCorsHeaders } = require('../shared/gameData');
const {
  getGameRoom,
  setGameRoom,
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
    const { gameCode } = req.body;

    if (!gameCode) {
      return res.status(400).json({
        error: 'Fehlende Parameter: gameCode',
      });
    }

    const gameRoom = await getGameRoom(gameCode);
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

    // Speichere aktualisiertes Spiel
    await setGameRoom(gameCode, gameRoom);

    return res.json({
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
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
