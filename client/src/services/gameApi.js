// Game API Service für REST-basierte Kommunikation
class GameApiService {
  constructor() {
    // In Produktion: Render-Backend, lokal: lokaler Server
    this.baseUrl = import.meta.env.PROD
      ? 'https://scrabster-pro.onrender.com'
      : 'http://localhost:3000';
    this.pollingInterval = null;
    this.currentGameCode = null;
    this.currentPlayerId = null;
    this.eventListeners = new Map();
  }

  // Event System
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // API Calls
  async createGame(username, difficulty) {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, difficulty }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Erstellen des Spiels');
      }

      const data = await response.json();
      this.currentGameCode = data.gameCode;
      this.currentPlayerId = data.playerId;

      this.emit('gameCreated', data);
      this.startPolling(); // Polling starten
      return data;
    } catch (error) {
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async joinGame(gameCode, username) {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameCode, username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Beitreten zum Spiel');
      }

      const data = await response.json();
      this.currentGameCode = data.gameCode;
      this.currentPlayerId = data.playerId;

      this.emit('gameJoined', data);
      this.startPolling(); // Polling starten
      return data;
    } catch (error) {
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async startGame() {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: this.currentGameCode,
          playerId: this.currentPlayerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Starten des Spiels');
      }

      const data = await response.json();
      this.emit('gameStarted', data);
      // Polling läuft bereits, muss nicht neu gestartet werden
      return data;
    } catch (error) {
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async submitWord(word) {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/submit-word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: this.currentGameCode,
          playerId: this.currentPlayerId,
          word,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        this.emit('wordRejected', { word, message: error.error });
        return;
      }

      const data = await response.json();

      if (data.scrabster) {
        this.emit('gameOver', {
          winners: [
            {
              username: 'Du',
              score:
                data.players.find(p => p.id === this.currentPlayerId)?.score ||
                0,
            },
          ],
          players: data.players,
          reason: 'scrabster',
          scrabsterWord: data.scrabsterWord,
        });
      } else {
        this.emit('wordSubmitted', {
          playerId: this.currentPlayerId,
          playerName: 'Du',
          word: data.word,
          players: data.players,
        });
      }

      return data;
    } catch (error) {
      this.emit('wordRejected', { word, message: error.message });
    }
  }

  async leaveGame() {
    try {
      if (this.currentGameCode && this.currentPlayerId) {
        await fetch(`${this.baseUrl}/api/game/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameCode: this.currentGameCode,
            playerId: this.currentPlayerId,
          }),
        });
      }
    } catch (error) {
      console.error('Error leaving game:', error);
    } finally {
      this.stopPolling();
      this.currentGameCode = null;
      this.currentPlayerId = null;
    }
  }

  // Polling für Echtzeit-Updates
  startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      if (this.currentGameCode) {
        try {
          const response = await fetch(
            `${this.baseUrl}/api/game/status/${this.currentGameCode}`
          );
          if (response.ok) {
            const data = await response.json();

            // Prüfen ob Spiel beendet ist
            if (data.gameState === 'finished' && data.timeLeft <= 0) {
              this.emit('gameOver', {
                winners: this.getWinners(data.players),
                players: data.players,
                reason: 'timeUp',
              });
              this.stopPolling();
            } else {
              // Immer Spieler-Updates senden, auch in der Wartephase
              this.emit('gameStateUpdate', {
                timeLeft: data.timeLeft,
                players: data.players,
                gameState: data.gameState,
                winner: data.winner,
                isDraw: data.isDraw,
              });
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }
    }, 2000); // Polling alle 2 Sekunden
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  getWinners(players) {
    if (players.length === 0) return [];

    const minWords = Math.min(...players.map(p => p.words.length));
    return players.filter(p => p.words.length === minWords);
  }

  // Disconnect
  disconnect() {
    this.leaveGame();
    this.eventListeners.clear();
  }
}

export default GameApiService;
