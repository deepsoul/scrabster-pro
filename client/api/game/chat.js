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
    
    const { gameCode, playerId, message, username } = body || {};

    if (!gameCode || !playerId || !message || !username) {
      return res.status(400).json({
        error: 'Fehlende Parameter: gameCode, playerId, message, username',
      });
    }

    // Validate message length
    if (message.length > 200) {
      return res.status(400).json({
        error: 'Nachricht zu lang (max. 200 Zeichen)',
      });
    }

    const gameRoom = await getGameRoom(gameCode);
    if (!gameRoom) {
      return res.status(404).json({ error: 'Spiel nicht gefunden' });
    }

    // Check if player is in the game
    const player = gameRoom.players.get(playerId);
    if (!player) {
      return res.status(403).json({ error: 'Spieler nicht im Spiel' });
    }

    // Create chat message
    const chatMessage = {
      id: Date.now().toString(),
      playerId,
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add message to game room
    if (!gameRoom.chatMessages) {
      gameRoom.chatMessages = [];
    }

    gameRoom.chatMessages.push(chatMessage);

    // Keep only last 50 messages to prevent memory issues
    if (gameRoom.chatMessages.length > 50) {
      gameRoom.chatMessages = gameRoom.chatMessages.slice(-50);
    }

    gameRoom.lastUpdate = Date.now();

    // Speichere aktualisiertes Spiel
    await setGameRoom(gameCode, gameRoom);

    return res.json({
      success: true,
      message: chatMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
