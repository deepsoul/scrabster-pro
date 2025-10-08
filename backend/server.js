import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import { GameManager } from './gameManager.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  let playerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join':
          playerId = data.playerId || `player_${Date.now()}`;
          gameManager.addPlayer(playerId, ws);
          ws.send(JSON.stringify({
            type: 'joined',
            playerId,
            gameState: gameManager.getGameState()
          }));
          break;

        case 'startGame':
          const gameState = gameManager.startNewGame();
          broadcastToAll({ type: 'gameStarted', gameState });
          break;

        case 'submitWord':
          const result = gameManager.submitWord(playerId, data.word);
          ws.send(JSON.stringify({
            type: 'wordResult',
            ...result
          }));
          
          // Check if game is over
          if (result.gameOver) {
            broadcastToAll({
              type: 'gameOver',
              winner: result.winner,
              stats: result.stats
            });
          }
          break;

        case 'getState':
          ws.send(JSON.stringify({
            type: 'gameState',
            gameState: gameManager.getGameState()
          }));
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (playerId) {
      gameManager.removePlayer(playerId);
    }
  });
});

function broadcastToAll(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
