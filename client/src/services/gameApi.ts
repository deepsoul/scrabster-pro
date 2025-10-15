// Game API Service für REST-basierte Kommunikation
class GameApiService {
  private baseUrl: string;
  private pollingInterval: any;
  private currentGameCode: string | null;
  private currentPlayerId: string | null;
  private eventListeners: Map<string, Function[]>;
  private renderSpinupDetected: boolean;
  private consecutiveTimeouts: number;

  constructor() {
    // In Produktion: Render-Backend mit Custom Domain, lokal: lokaler Server
    // Temporär: Fallback auf onrender.com falls Custom Domain nicht funktioniert
    this.baseUrl = import.meta.env.PROD
      ? 'https://api.scrabster-pro.de'
      : 'http://localhost:3000';
    this.pollingInterval = null;
    this.currentGameCode = null;
    this.currentPlayerId = null;
    this.eventListeners = new Map();
    this.renderSpinupDetected = false;
    this.consecutiveTimeouts = 0;
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error: any) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Render Spinup Detection
  private detectRenderSpinup(error: any): boolean {
    // Only check for Render spinup in production
    if (!import.meta.env.PROD) {
      return false;
    }

    // Check for common Render spinup indicators
    if (
      error?.message?.includes('timeout') ||
      error?.message?.includes('ECONNRESET') ||
      error?.message?.includes('ENOTFOUND') ||
      error?.code === 'ECONNABORTED' ||
      error?.name === 'TimeoutError'
    ) {
      this.consecutiveTimeouts++;

      // If we get 3+ consecutive timeouts in production, likely Render spinup
      if (this.consecutiveTimeouts >= 3) {
        this.renderSpinupDetected = true;
        this.emit('renderSpinup', { detected: true });
        return true;
      }
    } else {
      // Reset counter on successful request
      this.consecutiveTimeouts = 0;
      if (this.renderSpinupDetected) {
        this.renderSpinupDetected = false;
        this.emit('renderSpinup', { detected: false });
      }
    }
    return false;
  }

  // API Calls
  async createGame(username: string, difficulty: string): Promise<any> {
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
    } catch (error: any) {
      // Check for Render spinup before emitting error
      if (this.detectRenderSpinup(error)) {
        return; // Don't emit error, spinup loader will handle it
      }
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async joinGame(gameCode: string, username: string): Promise<any> {
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
    } catch (error: any) {
      // Check for Render spinup before emitting error
      if (this.detectRenderSpinup(error)) {
        return; // Don't emit error, spinup loader will handle it
      }
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async startGame(): Promise<any> {
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
    } catch (error: any) {
      // Check for Render spinup before emitting error
      if (this.detectRenderSpinup(error)) {
        return; // Don't emit error, spinup loader will handle it
      }
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  async submitWord(word: string): Promise<any> {
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
        // Scrabster-Event (Spiel läuft weiter)
        this.emit('scrabster', {
          playerId: this.currentPlayerId,
          playerName: 'Du',
          word: data.scrabsterWord,
          scrabsterCount: data.scrabsterCount,
          players: data.players,
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
    } catch (error: any) {
      this.emit('wordRejected', { word, message: error.message });
    }
  }

  async leaveGame(): Promise<any> {
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
    } catch (error: any) {
      console.error('Error leaving game:', error);
    } finally {
      this.stopPolling();
      this.currentGameCode = null;
      this.currentPlayerId = null;
    }
  }

  async newGame(): Promise<any> {
    try {
      if (!this.currentGameCode) {
        throw new Error('Kein aktives Spiel gefunden');
      }

      const response = await fetch(`${this.baseUrl}/api/game/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: this.currentGameCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || 'Fehler beim Starten eines neuen Spiels'
        );
      }

      const data = await response.json();

      // Kein Event nötig - alle Spieler werden über Polling benachrichtigt

      return data;
    } catch (error: any) {
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  // Chat Methods
  async sendChatMessage(message: string, username: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: this.currentGameCode,
          playerId: this.currentPlayerId,
          message,
          username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Senden der Nachricht');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      // Check for Render spinup before emitting error
      if (this.detectRenderSpinup(error)) {
        return; // Don't emit error, spinup loader will handle it
      }
      this.emit('gameError', { message: error.message });
      throw error;
    }
  }

  // Polling für Echtzeit-Updates
  startPolling(): void {
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
                chatMessages: data.chatMessages || [],
              });

              // Chat-Nachrichten werden direkt im GameScreen verarbeitet
              // um Duplikate zu vermeiden
            }
          }
        } catch (error: any) {
          console.error('Polling error:', error);
        }
      }
    }, 2000); // Polling alle 2 Sekunden
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  getWinners(players: any[]): any[] {
    if (players.length === 0) return [];

    // Nur Spieler mit mindestens einem Wort berücksichtigen
    const playersWithWords = players.filter(p => p.words && p.words.length > 0);

    if (playersWithWords.length === 0) return [];

    // Nach höchster Punktzahl sortieren
    const maxScore = Math.max(...playersWithWords.map(p => p.score));
    return playersWithWords.filter(p => p.score === maxScore);
  }

  // Disconnect
  disconnect(): void {
    this.leaveGame();
    this.eventListeners.clear();
  }
}

export default GameApiService;
