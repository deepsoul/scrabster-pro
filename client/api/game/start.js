import { setCorsHeaders } from '../shared/gameData.js';
import {
  getGameRoom,
  setGameRoom,
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
    if (!gameRoom || !gameRoom.players.has(playerId)) {
      return res.status(400).json({ error: 'Nicht autorisiert' });
    }

    if (gameRoom.players.size < 2) {
      return res.status(400).json({ error: 'Mindestens 2 Spieler erforderlich' });
    }

    gameRoom.gameState = 'playing';
    gameRoom.gameStartTime = Date.now();
    gameRoom.lastUpdate = Date.now();

    // Speichere aktualisiertes Spiel
    await setGameRoom(gameCode, gameRoom);

    return res.json({
      success: true,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      players: Array.from(gameRoom.players.values()),
    });
  } catch (error) {
    console.error('Start game error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
