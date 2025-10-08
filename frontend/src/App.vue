<template>
  <div class="game-container">
    <div class="header">
      <h1 class="title">🎯 Scrabster Pro</h1>
      <p class="subtitle">Das lustige Buchstaben-Salat Spiel</p>
    </div>

    <div v-if="connectionStatus" class="connection-status" :class="{ connected: isConnected, disconnected: !isConnected }">
      {{ isConnected ? '✓ Connected' : '✗ Disconnected' }}
    </div>

    <div v-if="!gameStarted && !gameOver" class="start-screen">
      <div class="rules">
        <h3>🎮 How to Play</h3>
        <ul>
          <li><strong>Goal:</strong> Use all letters by forming the FEWEST words possible</li>
          <li><strong>Scrabster Bonus:</strong> Win instantly by using all letters in ONE word!</li>
          <li><strong>Time Limit:</strong> 2 minutes to complete the challenge</li>
          <li><strong>Voice Input:</strong> Experimental feature - speak your words!</li>
        </ul>
      </div>
      <button class="btn btn-primary" @click="startGame" :disabled="!isConnected">
        Start Game
      </button>
    </div>

    <div v-if="gameStarted && !gameOver">
      <div class="game-status">
        <div class="timer" :class="{ warning: timeRemaining < 30 }">
          ⏱️ {{ formatTime(timeRemaining) }}
        </div>
        <div class="score">
          Words: {{ submittedWords.length }}
        </div>
      </div>

      <div v-if="message" class="message" :class="`message-${message.type}`">
        {{ message.text }}
      </div>

      <div class="letters-container">
        <h3>Available Letters:</h3>
        <div class="letters-grid">
          <div 
            v-for="(letter, index) in letters" 
            :key="index" 
            class="letter-tile"
            :class="{ used: isLetterUsed(index) }"
          >
            {{ letter }}
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="word-input-container">
          <input
            v-model="currentWord"
            @keyup.enter="submitWord"
            class="word-input"
            placeholder="Type your word..."
            :disabled="isListening"
            ref="wordInput"
          />
          <button class="btn btn-primary" @click="submitWord" :disabled="!currentWord || isListening">
            Submit
          </button>
        </div>

        <div class="voice-controls">
          <button 
            class="btn btn-voice" 
            :class="{ listening: isListening }"
            @click="toggleVoiceInput"
            v-if="voiceSupported"
          >
            {{ isListening ? '🎤 Listening...' : '🎤 Voice Input' }}
          </button>
          <span v-if="isListening" class="voice-status">Say your word clearly...</span>
          <span v-if="!voiceSupported" class="voice-status">Voice input not supported in this browser</span>
        </div>
      </div>

      <div v-if="submittedWords.length > 0" class="submitted-words">
        <h3>Your Words ({{ submittedWords.length }}):</h3>
        <div class="words-list">
          <span 
            v-for="word in submittedWords" 
            :key="word" 
            class="word-chip"
            :class="{ scrabster: word.length === letters.length }"
          >
            {{ word }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="gameOver" class="game-over">
      <div class="trophy">🏆</div>
      <h2>{{ gameOverMessage }}</h2>
      
      <div class="stats">
        <h3>Your Statistics:</h3>
        <div class="stat-item">
          <span>Total Words:</span>
          <strong>{{ submittedWords.length }}</strong>
        </div>
        <div class="stat-item">
          <span>Words List:</span>
          <strong>{{ submittedWords.join(', ') }}</strong>
        </div>
      </div>

      <button class="btn btn-primary" @click="startGame">
        Play Again
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isConnected: false,
      connectionStatus: true,
      playerId: null,
      gameId: 'default',
      gameStarted: false,
      gameOver: false,
      letters: [],
      submittedWords: [],
      currentWord: '',
      message: null,
      timeRemaining: 120,
      timerInterval: null,
      usedLetterIndices: [],
      gameOverMessage: '',
      
      // Voice recognition
      recognition: null,
      isListening: false,
      voiceSupported: false
    }
  },
  mounted() {
    this.connectToAPI();
    this.initVoiceRecognition();
  },
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.recognition) {
      this.recognition.stop();
    }
  },
  methods: {
    async connectToAPI() {
      try {
        // Test API connection
        const response = await fetch('/api/health');
        if (response.ok) {
          this.isConnected = true;
          this.joinGame();
        } else {
          this.isConnected = false;
        }
      } catch (error) {
        console.error('API connection failed:', error);
        this.isConnected = false;
      }
    },

    async joinGame() {
      try {
        const response = await fetch('/api/game/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: this.playerId,
            gameId: this.gameId
          })
        });

        const data = await response.json();
        if (data.success) {
          this.playerId = data.playerId;
          this.gameId = data.gameId;
          this.isConnected = true;
        }
      } catch (error) {
        console.error('Failed to join game:', error);
        this.isConnected = false;
      }
    },

    initVoiceRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.currentWord = transcript.trim().toUpperCase();
          this.isListening = false;
          
          // Auto-submit the word
          setTimeout(() => {
            this.submitWord();
          }, 500);
        };

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          this.isListening = false;
          this.showMessage('Voice input error. Please try again.', 'error');
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };

        this.voiceSupported = true;
      }
    },

    toggleVoiceInput() {
      if (!this.recognition) return;

      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      } else {
        this.currentWord = '';
        this.recognition.start();
        this.isListening = true;
      }
    },

    async startGame() {
      try {
        const response = await fetch('/api/game/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId: this.gameId
          })
        });

        const data = await response.json();
        if (data.success) {
          this.letters = data.gameState.letters;
          this.gameStarted = true;
          this.gameOver = false;
          this.submittedWords = [];
          this.usedLetterIndices = [];
          this.currentWord = '';
          this.timeRemaining = data.gameState.timeRemaining;
          this.startTimer();
          this.showMessage('Game started! Use all letters with the fewest words!', 'info');
          this.$nextTick(() => {
            this.$refs.wordInput?.focus();
          });
        } else {
          this.showMessage('Failed to start game: ' + data.error, 'error');
        }
      } catch (error) {
        console.error('Failed to start game:', error);
        this.showMessage('Failed to start game. Please try again.', 'error');
      }
    },

    async submitWord() {
      if (!this.currentWord || !this.gameStarted) return;

      try {
        const response = await fetch('/api/game/submit-word', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: this.playerId,
            word: this.currentWord.toUpperCase(),
            gameId: this.gameId
          })
        });

        const data = await response.json();
        if (data.success) {
          this.submittedWords.push(data.word);
          this.currentWord = '';
          
          if (data.isScrabster) {
            this.gameOverMessage = '🎉 SCRABSTER! You used all letters in one word!';
            this.endGame();
          } else if (data.allLettersUsed) {
            this.gameOverMessage = `Great job! You used all letters in ${this.submittedWords.length} words!`;
            this.endGame();
          } else {
            this.showMessage(`✓ Word accepted! ${data.lettersRemaining} letters remaining`, 'success');
          }
        } else {
          this.showMessage(`✗ ${data.message}`, 'error');
        }
      } catch (error) {
        console.error('Failed to submit word:', error);
        this.showMessage('Failed to submit word. Please try again.', 'error');
      }
    },

    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        
        if (this.timeRemaining <= 0) {
          this.gameOverMessage = `Time's up! You found ${this.submittedWords.length} words`;
          this.endGame();
        }
      }, 1000);
    },

    endGame() {
      this.gameStarted = false;
      this.gameOver = true;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    },

    isLetterUsed(index) {
      return this.usedLetterIndices.includes(index);
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    showMessage(text, type) {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 3000);
    }
  }
}
</script>

<style>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.connection-status {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
}

.connection-status.connected {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 2px solid #4caf50;
}

.connection-status.disconnected {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 2px solid #f44336;
}

.start-screen {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
}

.rules {
  margin-bottom: 30px;
  text-align: left;
}

.rules h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
}

.rules ul {
  list-style: none;
  padding: 0;
}

.rules li {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-voice {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  margin-top: 10px;
}

.btn-voice.listening {
  background: linear-gradient(45deg, #ff4757, #c44569);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.timer {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.timer.warning {
  color: #ff6b6b;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.message {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
}

.message-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message-info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.letters-container {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.letters-container h3 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.letters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.letter-tile {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.letter-tile.used {
  background: #95a5a6;
  opacity: 0.6;
  transform: scale(0.9);
}

.input-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.word-input-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.word-input {
  flex: 1;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: border-color 0.3s ease;
}

.word-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.voice-controls {
  text-align: center;
}

.voice-status {
  display: block;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.submitted-words {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.submitted-words h3 {
  margin-bottom: 15px;
  color: #333;
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word-chip {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  border: 2px solid #bbdefb;
}

.word-chip.scrabster {
  background: #fff3e0;
  color: #f57c00;
  border-color: #ffcc02;
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px #ffcc02; }
  50% { box-shadow: 0 0 20px #ffcc02, 0 0 30px #ffcc02; }
}

.game-over {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.trophy {
  font-size: 4rem;
  margin-bottom: 20px;
}

.game-over h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

.stats {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: left;
}

.stats h3 {
  margin-bottom: 15px;
  color: #333;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .word-input-container {
    flex-direction: column;
  }
  
  .letters-grid {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 10px;
  }
  
  .letter-tile {
    font-size: 1.2rem;
  }
}
</style>