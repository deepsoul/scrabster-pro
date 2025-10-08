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
      ws: null,
      isConnected: false,
      connectionStatus: true,
      playerId: null,
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
    this.connectWebSocket();
    this.initVoiceRecognition();
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.recognition) {
      this.recognition.stop();
    }
  },
  methods: {
    connectWebSocket() {
      const wsUrl = 'ws://localhost:3001';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.playerId = `player_${Date.now()}`;
        this.send({ type: 'join', playerId: this.playerId });
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleServerMessage(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        setTimeout(() => this.connectWebSocket(), 3000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
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

    send(data) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      }
    },

    handleServerMessage(data) {
      switch (data.type) {
        case 'joined':
          console.log('Joined game:', data);
          break;

        case 'gameStarted':
          this.letters = data.gameState.letters;
          this.gameStarted = true;
          this.gameOver = false;
          this.submittedWords = [];
          this.usedLetterIndices = [];
          this.currentWord = '';
          this.timeRemaining = 120;
          this.startTimer();
          this.showMessage('Game started! Use all letters with the fewest words!', 'info');
          this.$nextTick(() => {
            this.$refs.wordInput?.focus();
          });
          break;

        case 'wordResult':
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
          break;

        case 'gameOver':
          this.gameOverMessage = `Game Over! Final score: ${this.submittedWords.length} words`;
          this.endGame();
          break;

        case 'error':
          this.showMessage(data.message, 'error');
          break;
      }
    },

    startGame() {
      this.send({ type: 'startGame' });
    },

    submitWord() {
      if (!this.currentWord || !this.gameStarted) return;

      this.send({
        type: 'submitWord',
        word: this.currentWord.toUpperCase()
      });
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
