import { setCorsHeaders } from '../shared/gameData.js';
import {
  getGameRoom,
  setGameRoom,
  setPlayerConnection,
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
    
    const { gameCode, username } = body || {};

    if (!gameCode || !username) {
      return res
        .status(400)
        .json({ error: 'Spielcode und Username erforderlich' });
    }

    const gameRoom = await getGameRoom(gameCode);
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
    await setPlayerConnection(playerId, gameCode);
    gameRoom.lastUpdate = Date.now();
    
    // Speichere aktualisiertes Spiel
    await setGameRoom(gameCode, gameRoom);

    return res.json({
      gameCode: gameCode,
      difficulty: gameRoom.difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      playerId: playerId,
      players: Array.from(gameRoom.players.values()),
    });
  } catch (error) {
    console.error('Join game error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
