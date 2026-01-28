import { DIFFICULTY_LEVELS, setCorsHeaders } from '../../shared/gameData.js';
import {
  getGameRoom,
  setGameRoom,
} from '../../shared/redisClient.js';

export default async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return setCorsHeaders(res).status(200).end();
  }

  // Set CORS headers
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { gameCode } = req.query;

    if (!gameCode) {
      return res.status(400).json({ error: 'Spielcode erforderlich' });
    }

    const gameRoom = await getGameRoom(gameCode);

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
        // Gewinner ermitteln (höchste Punktzahl, aber nur Spieler mit Wörtern)
        const players = Array.from(gameRoom.players.values());

        // Nur Spieler mit mindestens einem Wort berücksichtigen
        const playersWithWords = players.filter(
          p => p.words && p.words.length > 0
        );

        if (playersWithWords.length === 0) {
          // Kein Spieler hat Wörter eingegeben
          gameRoom.winner = null;
          gameRoom.isDraw = false;
        } else {
          const maxScore = Math.max(...playersWithWords.map(p => p.score));
          const winners = playersWithWords.filter(p => p.score === maxScore);

          // Gewinner-Information hinzufügen
          gameRoom.winner = winners.length === 1 ? winners[0] : null; // Bei Gleichstand: kein Gewinner
          gameRoom.isDraw = winners.length > 1;
        }
      }
      
      // Speichere aktualisiertes Spiel (nur wenn sich etwas geändert hat)
      await setGameRoom(gameCode, gameRoom);
    }

    return res.json({
      gameCode: gameRoom.code,
      difficulty: gameRoom.difficulty,
      letters: gameRoom.letters,
      timeLeft: gameRoom.timeLeft,
      gameState: gameRoom.gameState,
      players: Array.from(gameRoom.players.values()),
      lastUpdate: gameRoom.lastUpdate,
      winner: gameRoom.winner || null,
      isDraw: gameRoom.isDraw || false,
      chatMessages: gameRoom.chatMessages || [],
    });
  } catch (error) {
    console.error('Get game status error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
