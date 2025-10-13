<template>
  <div class="max-w-6xl mx-auto">
    <!-- Loading State -->
    <div
      v-if="!gameData"
      class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 text-center"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
      ></div>
      <div class="text-lg text-gray-600">Spiel wird geladen...</div>
    </div>

    <!-- Game Content -->
    <div v-else>
      <!-- Game Header -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center space-x-4 mb-4 sm:mb-0">
            <div class="text-center">
              <div class="text-sm text-gray-500">Spiel-Code</div>
              <div
                class="text-xl font-bold text-primary-600 font-mono font-display"
              >
                {{ gameData.gameCode }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-500">Schwierigkeit</div>
              <div class="text-lg font-semibold" :class="difficultyClass">
                {{ difficultyText }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="openShareModal"
              class="btn-success text-sm py-2 px-4 flex items-center"
            >
              <span class="mr-2">📤</span>
              Teilen
            </button>
            <button @click="leaveGame" class="btn-danger text-sm py-2 px-4">
              Spiel verlassen
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Game Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Timer -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200"
          >
            <div class="text-sm text-gray-500 mb-2">Verbleibende Zeit</div>
            <div class="timer text-6xl font-bold" :class="timerClass">
              {{ formatTime(timeLeft) }}
            </div>
          </div>

          <!-- Letters -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
              Verfügbare Buchstaben
            </h3>
            <div class="flex flex-wrap justify-center gap-3">
              <div
                v-for="(letter, index) in letters"
                :key="index"
                class="letter-tile relative"
                :class="{ highlighted: highlightedLetters.includes(index) }"
              >
                {{ letter }}
                <div
                  v-if="letterFrequency[letter] > 1"
                  class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {{ letterFrequency[letter] }}
                </div>
              </div>
            </div>
          </div>

          <!-- Word Input -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Wort eingeben
            </h3>
            <div class="flex space-x-3">
              <input
                v-model="currentWord"
                @keyup.enter="submitWord"
                type="text"
                placeholder="Gib dein Wort ein..."
                class="input-field flex-1 text-lg"
                :disabled="gameState !== 'playing'"
              />
              <button
                @click="submitWord"
                :disabled="!currentWord.trim() || gameState !== 'playing'"
                class="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Senden
              </button>
            </div>

            <!-- Punkte-Anzeige für aktuelles Wort -->
            <div
              v-if="currentWord.trim() && gameState === 'playing'"
              class="mt-3 text-center"
            >
              <span class="text-sm text-gray-600">
                Dieses Wort bringt:
                <span class="font-bold text-primary-600">
                  {{ currentWordScore }} Punkte
                </span>
              </span>
            </div>

            <!-- Voice Input -->
            <div class="mt-4 flex items-center justify-center">
              <button
                @click="toggleVoiceInput"
                :disabled="gameState !== 'playing' || !isVoiceSupported"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200"
                :class="
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ isListening ? 'Aufnahme...' : 'Spracheingabe' }}</span>
              </button>
              <span v-if="!isVoiceSupported" class="ml-2 text-sm text-gray-500">
                (Nicht unterstützt)
              </span>
            </div>
          </div>

          <!-- My Words -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Meine Wörter ({{ myWords.length }})
            </h3>
            <div
              v-if="myWords.length === 0"
              class="text-gray-500 text-center py-8"
            >
              Noch keine Wörter eingegeben
            </div>
            <div
              v-else
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            >
              <div
                v-for="(word, index) in myWords"
                :key="index"
                class="word-item text-center"
              >
                {{ word }}
              </div>
            </div>
          </div>
        </div>

        <!-- Players Sidebar -->
        <div class="space-y-6">
          <!-- Players List -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Spieler ({{ players.length }})
            </h3>
            <div class="space-y-3">
              <div
                v-for="player in sortedPlayers"
                :key="player.id"
                class="player-card"
                :class="{
                  'ring-2 ring-primary-500': player.id === currentPlayerId,
                }"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ player.username }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ player.words.length }} Wörter
                    </div>
                  </div>
                  <div class="text-2xl font-bold text-primary-600">
                    {{ player.score }} Pkt
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Game Status -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Spielstatus
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium" :class="statusClass">
                  {{ statusText }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Buchstaben:</span>
                <span class="font-medium">{{ letters.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Zeit:</span>
                <span class="font-medium">{{ difficultyTime }}s</span>
              </div>
            </div>
          </div>

          <!-- Game Over Display -->
          <div
            v-if="gameState === 'finished'"
            class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center"
          >
            <div class="text-2xl font-bold mb-4">
              <span v-if="gameData?.isDraw" class="text-yellow-600">
                Unentschieden! 🎯
              </span>
              <span v-else-if="gameData?.winner" class="text-green-600">
                🏆 {{ gameData.winner.username }} hat gewonnen!
              </span>
              <span v-else class="text-gray-600">Spiel beendet</span>
            </div>
            <div v-if="gameData?.winner" class="text-lg text-gray-600 mb-4">
              Mit {{ gameData.winner.score }} Punkten
            </div>
            <div class="text-sm text-gray-500">
              Alle Spieler haben ihre Wörter eingegeben
            </div>
          </div>

          <!-- Start Game Button -->
          <div
            v-if="gameState === 'waiting' && isHost"
            class="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <button
              @click="startGame"
              :disabled="players.length < 2"
              class="w-full btn-success text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="players.length < 2">
                Warte auf Spieler ({{ players.length }}/2+)
              </span>
              <span v-else>Spiel starten</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Game Modal -->
    <ShareGame
      :gameCode="gameData?.gameCode"
      :difficulty="gameData?.difficulty"
      :showModal="showShareModal"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import ShareGame from './ShareGame.vue';

const props = defineProps({
  gameData: Object,
  gameApi: Object,
});

const emit = defineEmits(['leaveGame', 'gameOver']);

// Game state
const gameState = ref('waiting'); // waiting, playing, finished
const timeLeft = ref(0);
const letters = ref([]);
const players = ref([]);
const myWords = ref([]);
const currentWord = ref('');
const currentPlayerId = ref('');

// Share modal state
const showShareModal = ref(false);

// Voice input
const isVoiceSupported = ref(false);
const isListening = ref(false);
const recognition = ref(null);
const highlightedLetters = ref([]);

// Computed properties
const difficultyText = computed(() => {
  if (!props.gameData) return 'Lädt...';
  const difficulties = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
  };
  return difficulties[props.gameData.difficulty] || 'Unbekannt';
});

const difficultyClass = computed(() => {
  if (!props.gameData) return 'text-gray-600';
  const classes = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600',
  };
  return classes[props.gameData.difficulty] || 'text-gray-600';
});

const difficultyTime = computed(() => {
  if (!props.gameData) return 60;
  const times = {
    easy: 120,
    medium: 90,
    hard: 60,
  };
  return times[props.gameData.difficulty] || 60;
});

const timerClass = computed(() => {
  if (timeLeft.value <= 10) return 'danger';
  if (timeLeft.value <= 30) return 'warning';
  return '';
});

const statusText = computed(() => {
  const statuses = {
    waiting: 'Warten auf Start',
    playing: 'Spiel läuft',
    finished: 'Beendet',
  };
  return statuses[gameState.value] || 'Unbekannt';
});

const statusClass = computed(() => {
  const classes = {
    waiting: 'text-yellow-600',
    playing: 'text-green-600',
    finished: 'text-gray-600',
  };
  return classes[gameState.value] || 'text-gray-600';
});

const sortedPlayers = computed(() => {
  return [...players.value].sort((a, b) => b.score - a.score);
});

// Buchstaben-Häufigkeit berechnen
const letterFrequency = computed(() => {
  const frequency = {};
  letters.value.forEach(letter => {
    frequency[letter] = (frequency[letter] || 0) + 1;
  });
  return frequency;
});

// Punkte für aktuelles Wort berechnen
const currentWordScore = computed(() => {
  if (!currentWord.value.trim() || !letters.value.length) return 0;

  const wordLetters = currentWord.value.toUpperCase().split('');
  const availableLetters = [...letters.value];
  let usedLetters = 0;

  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      usedLetters++;
      availableLetters.splice(index, 1);
    }
  }

  return Math.max(1, usedLetters);
});

const isHost = computed(() => {
  if (!players.value || players.value.length === 0 || !currentPlayerId.value) {
    return false;
  }
  // Der erste Spieler im Array ist der Host (Spielersteller)
  return players.value[0] && players.value[0].id === currentPlayerId.value;
});

// Methods
const formatTime = seconds => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const submitWord = async () => {
  if (
    !currentWord.value.trim() ||
    gameState.value !== 'playing' ||
    !props.gameData ||
    !props.gameApi
  )
    return;

  try {
    await props.gameApi.submitWord(currentWord.value.trim());

    // Track word submission
    if (window.analytics) {
      const wordLength = currentWord.value.length;
      const score = currentWordScore.value;
      window.analytics.trackWordSubmitted(wordLength, score);
    }

    currentWord.value = '';
  } catch (error) {
    console.error('Error submitting word:', error);
  }
};

const startGame = async () => {
  if (!props.gameData || !props.gameApi) return;

  try {
    await props.gameApi.startGame();
    // Track game started event
    if (window.analytics) {
      window.analytics.trackGameStarted(
        props.gameData.difficulty,
        players.value.length
      );
    }
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

const leaveGame = async () => {
  if (!props.gameData || !props.gameApi) return;

  try {
    await props.gameApi.leaveGame();
  } catch (error) {
    console.error('Error leaving game:', error);
  } finally {
    emit('leaveGame');
  }
};

// Share modal methods
const openShareModal = () => {
  showShareModal.value = true;
};

const closeShareModal = () => {
  showShareModal.value = false;
};

// Voice input methods
const initVoiceInput = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    recognition.value.continuous = false;
    recognition.value.interimResults = false;
    recognition.value.lang = 'de-DE';

    recognition.value.onstart = () => {
      isListening.value = true;
    };

    recognition.value.onresult = event => {
      const transcript = event.results[0][0].transcript.trim();
      currentWord.value = transcript;

      // Highlight matching letters
      highlightMatchingLetters(transcript);
    };

    recognition.value.onend = () => {
      isListening.value = false;
    };

    recognition.value.onerror = event => {
      console.error('Speech recognition error:', event.error);
      isListening.value = false;
    };

    isVoiceSupported.value = true;
  }
};

const toggleVoiceInput = () => {
  if (!recognition.value) return;

  if (isListening.value) {
    recognition.value.stop();
  } else {
    recognition.value.start();
  }
};

const highlightMatchingLetters = word => {
  const wordLetters = word.toUpperCase().split('');
  const availableLetters = [...letters.value];
  const highlighted = [];

  for (let i = 0; i < wordLetters.length; i++) {
    const letter = wordLetters[i];
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      highlighted.push(index);
      availableLetters.splice(index, 1); // Remove to avoid duplicates
    }
  }

  highlightedLetters.value = highlighted;

  // Clear highlight after 2 seconds
  setTimeout(() => {
    highlightedLetters.value = [];
  }, 2000);
};

// Game API event handlers
const setupGameApiListeners = () => {
  if (!props.gameApi) return;

  props.gameApi.on('gameJoined', data => {
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    players.value = data.players;
    currentPlayerId.value = data.playerId;
  });

  props.gameApi.on('gameCreated', data => {
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    currentPlayerId.value = data.playerId;
    if (data.players) {
      players.value = data.players;
    }
  });

  props.gameApi.on('playerJoined', data => {
    players.value = data.players;
  });

  props.gameApi.on('playerLeft', data => {
    players.value = data.players;
  });

  props.gameApi.on('gameStarted', data => {
    gameState.value = 'playing';
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    players.value = data.players;
  });

  props.gameApi.on('gameStateUpdate', data => {
    timeLeft.value = data.timeLeft;
    players.value = data.players;
    if (data.gameState) {
      gameState.value = data.gameState;
    }
    // Gewinner-Information aktualisieren
    if (data.winner !== undefined) {
      props.gameData.winner = data.winner;
    }
    if (data.isDraw !== undefined) {
      props.gameData.isDraw = data.isDraw;
    }
  });

  props.gameApi.on('wordSubmitted', data => {
    if (data.playerId === currentPlayerId.value) {
      myWords.value.push(data.word);
    }
    players.value = data.players;
  });

  props.gameApi.on('wordRejected', data => {
    alert(`Wort abgelehnt: ${data.message}`);
  });

  props.gameApi.on('gameOver', data => {
    gameState.value = 'finished';
    emit('gameOver', data);
  });
};

// Lifecycle
onMounted(() => {
  initVoiceInput();
  setupGameApiListeners();

  // Initialize game data
  if (props.gameData) {
    if (props.gameData.letters) {
      letters.value = props.gameData.letters;
    }
    if (props.gameData.timeLeft) {
      timeLeft.value = props.gameData.timeLeft;
    }
    if (props.gameData.players) {
      players.value = props.gameData.players;
    }
    if (props.gameData.playerId) {
      currentPlayerId.value = props.gameData.playerId;
    }
  }
});

onUnmounted(() => {
  if (recognition.value && isListening.value) {
    recognition.value.stop();
  }
});
</script>
