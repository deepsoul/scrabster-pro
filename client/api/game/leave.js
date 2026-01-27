const { setCorsHeaders } = require('../shared/gameData');
const {
  getGameRoom,
  setGameRoom,
  deleteGameRoom,
  deletePlayerConnection,
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
    const { gameCode, playerId } = req.body;

    const gameRoom = await getGameRoom(gameCode);
    if (gameRoom && gameRoom.players.has(playerId)) {
      gameRoom.players.delete(playerId);
      await deletePlayerConnection(playerId);
      gameRoom.lastUpdate = Date.now();

      if (gameRoom.players.size === 0) {
        await deleteGameRoom(gameCode);
      } else {
        await setGameRoom(gameCode, gameRoom);
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Leave game error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
