import { validateWord, isScrabster, setCorsHeaders } from '../shared/gameData.js';
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
    
    const { gameCode, playerId, word } = body || {};

    const gameRoom = await getGameRoom(gameCode);
    if (!gameRoom || gameRoom.gameState !== 'playing') {
      return res.status(400).json({ error: 'Spiel nicht aktiv' });
    }

    const player = gameRoom.players.get(playerId);
    if (!player) {
      return res.status(400).json({ error: 'Spieler nicht gefunden' });
    }

    // Wort validieren
    if (!validateWord(word, gameRoom.letters)) {
      return res.status(400).json({ error: 'Wort enthält ungültige Buchstaben' });
    }

    // Prüfen ob Wort bereits verwendet wurde
    if (player.words.includes(word.toUpperCase())) {
      return res.status(400).json({ error: 'Wort bereits verwendet' });
    }

    // Wort hinzufügen
    player.words.push(word.toUpperCase());

    // Punkte basierend auf verwendeten Buchstaben berechnen
    const wordLetters = word.toUpperCase().split('');
    const availableLetters = [...gameRoom.letters];
    let usedLetters = 0;

    // Zählen, wie viele Buchstaben aus der verfügbaren Liste verwendet wurden
    for (const letter of wordLetters) {
      const index = availableLetters.indexOf(letter);
      if (index !== -1) {
        usedLetters++;
        availableLetters.splice(index, 1); // Buchstabe "verbrauchen"
      }
    }

    // Punkte basierend auf verwendeten Buchstaben (mindestens 1 Punkt pro Wort)
    const wordScore = Math.max(1, usedLetters);
    player.score += wordScore;
    gameRoom.lastUpdate = Date.now();

    // Prüfen auf Scrabster
    if (isScrabster(word, gameRoom.letters, gameRoom.difficulty)) {
      // Scrabster: 10 Extrapunkte + Badge
      player.score += 10;

      // Scrabster-Badge hinzufügen (falls noch nicht vorhanden)
      if (!player.scrabsters) {
        player.scrabsters = 0;
      }
      player.scrabsters += 1;

      gameRoom.lastUpdate = Date.now();

      // Speichere aktualisiertes Spiel
      await setGameRoom(gameCode, gameRoom);

      return res.json({
        success: true,
        scrabster: true,
        scrabsterWord: word.toUpperCase(),
        scrabsterCount: player.scrabsters,
        players: Array.from(gameRoom.players.values()),
        // Spiel läuft weiter - kein gameState = 'finished'
      });
    }

    // Speichere aktualisiertes Spiel
    await setGameRoom(gameCode, gameRoom);

    return res.json({
      success: true,
      word: word.toUpperCase(),
      players: Array.from(gameRoom.players.values()),
    });
  } catch (error) {
    console.error('Submit word error:', error);
    return res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};
