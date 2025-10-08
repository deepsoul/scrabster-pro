import express from 'express';
import cors from 'cors';
import {GameManager} from './gameManager.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for game state (in production, use Redis or database)
const gameManager = new GameManager();
const gameStates = new Map(); // Store game states by gameId
const players = new Map(); // Store players by playerId

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// API endpoints for game management
app.post('/api/game/join', (req, res) => {
  try {
    const {playerId, gameId} = req.body;
    const actualPlayerId = playerId || `player_${Date.now()}`;
    const actualGameId = gameId || 'default';

    // Initialize game state if it doesn't exist
    if (!gameStates.has(actualGameId)) {
      gameStates.set(actualGameId, {
        id: actualGameId,
        players: new Map(),
        letters: [],
        timeRemaining: 120,
        gameStarted: false,
        gameOver: false,
        startTime: null,
      });
    }

    const gameState = gameStates.get(actualGameId);
    gameState.players.set(actualPlayerId, {
      id: actualPlayerId,
      words: [],
      score: 0,
    });

    players.set(actualPlayerId, actualGameId);

    res.json({
      success: true,
      playerId: actualPlayerId,
      gameId: actualGameId,
      gameState: {
        letters: gameState.letters,
        timeRemaining: gameState.timeRemaining,
        gameStarted: gameState.gameStarted,
        gameOver: gameState.gameOver,
        players: Array.from(gameState.players.values()),
      },
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.post('/api/game/start', (req, res) => {
  try {
    const {gameId} = req.body;
    const actualGameId = gameId || 'default';

    if (!gameStates.has(actualGameId)) {
      return res.status(404).json({success: false, error: 'Game not found'});
    }

    const gameState = gameStates.get(actualGameId);

    if (gameState.gameStarted) {
      return res
        .status(400)
        .json({success: false, error: 'Game already started'});
    }

    // Generate letters and start game
    gameState.letters = gameManager.generateLetters(8); // 8 letters for medium difficulty
    gameState.gameStarted = true;
    gameState.gameOver = false;
    gameState.startTime = Date.now();
    gameState.timeRemaining = 120;

    res.json({
      success: true,
      gameState: {
        letters: gameState.letters,
        timeRemaining: gameState.timeRemaining,
        gameStarted: gameState.gameStarted,
        gameOver: gameState.gameOver,
        players: Array.from(gameState.players.values()),
      },
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.post('/api/game/submit-word', (req, res) => {
  try {
    const {playerId, word, gameId} = req.body;
    const actualGameId = gameId || 'default';

    if (!gameStates.has(actualGameId)) {
      return res.status(404).json({success: false, error: 'Game not found'});
    }

    const gameState = gameStates.get(actualGameId);

    if (!gameState.gameStarted || gameState.gameOver) {
      return res.status(400).json({success: false, error: 'Game not active'});
    }

    if (!gameState.players.has(playerId)) {
      return res.status(400).json({success: false, error: 'Player not found'});
    }

    const player = gameState.players.get(playerId);
    const result = gameManager.submitWord(
      playerId,
      word,
      gameState.letters,
      player.words,
    );

    if (result.success) {
      player.words.push(word.toUpperCase());
      player.score = player.words.length;

      // Check if all letters are used
      const allLettersUsed = gameManager.checkAllLettersUsed(
        gameState.letters,
        player.words,
      );
      const isScrabster =
        word.length === gameState.letters.length && allLettersUsed;

      if (isScrabster) {
        gameState.gameOver = true;
        gameState.gameStarted = false;
      } else if (allLettersUsed) {
        gameState.gameOver = true;
        gameState.gameStarted = false;
      }

      res.json({
        success: true,
        word: word.toUpperCase(),
        isScrabster,
        allLettersUsed,
        lettersRemaining: result.lettersRemaining,
        gameOver: gameState.gameOver,
        gameState: {
          letters: gameState.letters,
          timeRemaining: gameState.timeRemaining,
          gameStarted: gameState.gameStarted,
          gameOver: gameState.gameOver,
          players: Array.from(gameState.players.values()),
        },
      });
    } else {
      res.json({
        success: false,
        message: result.message,
        gameState: {
          letters: gameState.letters,
          timeRemaining: gameState.timeRemaining,
          gameStarted: gameState.gameStarted,
          gameOver: gameState.gameOver,
          players: Array.from(gameState.players.values()),
        },
      });
    }
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.get('/api/game/state/:gameId', (req, res) => {
  try {
    const {gameId} = req.params;
    const actualGameId = gameId || 'default';

    if (!gameStates.has(actualGameId)) {
      return res.status(404).json({success: false, error: 'Game not found'});
    }

    const gameState = gameStates.get(actualGameId);

    res.json({
      success: true,
      gameState: {
        letters: gameState.letters,
        timeRemaining: gameState.timeRemaining,
        gameStarted: gameState.gameStarted,
        gameOver: gameState.gameOver,
        players: Array.from(gameState.players.values()),
      },
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

// Fallback for SPA
app.get('*', (req, res) => {
  res.json({message: 'Scrabster Pro API', status: 'running'});
});

export default app;
