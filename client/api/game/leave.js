import { setCorsHeaders } from '../shared/gameData.js';
import {
  getGameRoom,
  setGameRoom,
  deleteGameRoom,
  deletePlayerConnection,
} from '../shared/redisClient.js';

export default async (req, res) => {
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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }
    
    const { gameCode, playerId } = body || {};

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
