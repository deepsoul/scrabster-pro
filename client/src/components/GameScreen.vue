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

      <!-- Mobile Sticky Timer -->
      <div class="md:hidden sticky top-16 z-40 mb-4">
        <div
          class="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 mx-4"
        >
          <div class="text-center py-2">
            <div class="text-xs text-gray-500">Zeit</div>
            <div class="timer text-2xl font-bold" :class="timerClass">
              {{ formatTime(timeLeft) }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Game Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Timer (Desktop only) -->
          <div
            class="hidden md:block bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200"
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
                  v-if="letterFrequency && letterFrequency?[letter] > 1"
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

            <!-- Wort-Validierung und Punkte-Anzeige -->
            <div
              v-if="currentWord.trim() && gameState === 'playing'"
              class="mt-3 space-y-2"
            >
              <!-- Validierungs-Feedback -->
              <div v-if="isValidating" class="text-center">
                <div class="inline-flex items-center text-sm text-gray-500">
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
                  ></div>
                  Wort wird validiert...
                </div>
              </div>

              <div v-else-if="wordValidation" class="text-center">
                <div
                  class="text-sm font-medium flex items-center justify-center gap-2"
                  :class="
                    wordValidation.isValid
                      ? 'text-green-600'
                      : 'text-orange-600'
                  "
                >
                  <span v-if="!wordValidation.isValid" class="text-orange-500">
                    ⚠️
                  </span>
                  {{ wordValidation.reason }}
                </div>
              </div>

              <!-- Punkte-Anzeige -->
              <div class="text-center">
                <span class="text-sm text-gray-600">
                  Dieses Wort bringt:
                  <span class="font-bold text-primary-600">
                    {{ currentWordScore }} Punkte
                  </span>
                </span>
              </div>
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
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(word, index) in myWords"
                :key="index"
                class="word-item bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div class="text-center mb-2">
                  <span class="font-semibold text-gray-900 text-lg">
                    {{ word }}
                  </span>
                </div>
                <div class="flex justify-center space-x-2">
                  <!-- Letters Badge -->
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                    :class="
                      getLettersBadgeColor(
                        getUsedLettersCount(word, letters),
                        getScrabsterRequirement()
                      )
                    "
                  >
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ getUsedLettersCount(word, letters) }} Buchst.
                  </span>
                  <!-- Points Badge -->
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                    :class="getPointsBadgeColor(wordScores[index] || 0)"
                  >
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    {{ wordScores[index] || 0 }} Pkt
                  </span>
                </div>
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
                    <div
                      class="font-medium text-gray-900 flex items-center gap-2"
                    >
                      {{ player.username }}
                      <span
                        v-if="player.scrabsters && player.scrabsters > 0"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        ⚡ {{ player.scrabsters }} Scrabster
                      </span>
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
              <span v-if="isDraw" class="text-yellow-600">
                Unentschieden! 🎯
              </span>
              <span v-else-if="winner" class="text-green-600">
                🏆 {{ winner.username }} hat gewonnen!
              </span>
              <span v-else class="text-gray-600">Spiel beendet</span>
            </div>
            <div v-if="winner" class="text-lg text-gray-600 mb-4">
              Mit {{ winner.score }} Punkten
            </div>
            <div class="text-sm text-gray-500">
              <span v-if="winner || isDraw">
                Alle Spieler haben ihre Wörter eingegeben
              </span>
              <span v-else>Kein Spieler hat Wörter eingegeben</span>
            </div>
          </div>

          <!-- Simple Chat -->
          <div
            class="bg-white rounded-xl shadow-lg border border-gray-200 h-64 flex flex-col"
          >
            <!-- Chat Header -->
            <div class="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-700">Chat</h3>
                <button
                  @click="toggleChat"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-4 h-4 transform transition-transform"
                    :class="{ 'rotate-180': isChatExpanded }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Chat Messages -->
            <div
              v-if="isChatExpanded"
              ref="chatMessagesContainer"
              class="flex-1 overflow-y-auto p-3 space-y-2"
            >
              <div
                v-for="message in chatMessages"
                :key="message.id"
                class="flex"
                :class="message.isOwn ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-xs px-3 py-2 rounded-lg text-sm"
                  :class="
                    message.isOwn
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  "
                >
                  <div v-if="!message.isOwn" class="text-xs text-gray-500 mb-1">
                    {{ message.username }}
                  </div>
                  <div>{{ message.text }}</div>
                  <div
                    class="text-xs mt-1"
                    :class="
                      message.isOwn ? 'text-primary-100' : 'text-gray-500'
                    "
                  >
                    {{ formatChatTime(message.timestamp) }}
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-if="chatMessages.length === 0"
                class="text-center text-gray-500 text-sm py-4"
              >
                Keine Nachrichten yet. Starte eine Unterhaltung! 💬
              </div>
            </div>

            <!-- Chat Input -->
            <div v-if="isChatExpanded" class="p-3 border-t border-gray-200">
              <form @submit.prevent="sendChatMessage" class="flex space-x-2">
                <input
                  v-model="newChatMessage"
                  type="text"
                  placeholder="Nachricht eingeben..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxlength="200"
                  :disabled="isSendingChat"
                />
                <button
                  type="submit"
                  :disabled="!newChatMessage.trim() || isSendingChat"
                  class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isSendingChat">⏳</span>
                  <span v-else>📤</span>
                </button>
              </form>
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
      :gameCode="gameData?.gameCode || ''"
      :difficulty="gameData?.difficulty || 'medium'"
      :showModal="showShareModal"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import ShareGame from '@/components/ShareGame.vue';
import soundService from '../services/soundService.js';
import wordValidationService from '../services/wordValidationService.js';
import {
  getUsedLettersCount,
  getLettersBadgeColor,
  getPointsBadgeColor,
  calculateWordScore,
} from '../utils/wordBadges.js';
import type { GameData, Player, WordValidation } from '@/types';
import type GameApiService from '@/services/gameApi';

// Define props with proper typing
const props = defineProps<{
  gameData: GameData | null;
  gameApi: GameApiService | null;
}>();

// Define emits with proper typing
const emit = defineEmits<{
  leaveGame: [];
  gameOver: [gameResult: any];
}>();

// Game state
const gameState = ref<'waiting' | 'playing' | 'finished'>('waiting');
const timeLeft = ref<number>(0);
const letters = ref<string[]>([]);
const players = ref<Player[]>([]);
const myWords = ref<string[]>([]);
const wordScores = ref<number[]>([]); // Speichere Punkte für jedes Wort
const currentWord = ref<string>('');
const currentPlayerId = ref<string>('');

// Share modal state
const showShareModal = ref<boolean>(false);

// Chat state
const chatMessages = ref<
  Array<{
    id: string;
    username: string;
    text: string;
    timestamp: Date;
    isOwn: boolean;
  }>
>([]);
const newChatMessage = ref('');
const isSendingChat = ref(false);
const isChatExpanded = ref(true);
const chatMessagesContainer = ref<HTMLElement>();
const processedChatMessageIds = ref<Set<string>>(new Set());

// Winner state
const winner = ref<Player | null>(null);
const isDraw = ref<boolean>(false);

// Voice input
const isVoiceSupported = ref<boolean>(false);
const isListening = ref<boolean>(false);
const recognition = ref<any>(null);
const highlightedLetters = ref<number[]>([]);

// Word validation
const wordValidation = ref<WordValidation | null>(null);
const isValidating = ref<boolean>(false);

// Helper function to get Scrabster requirement based on difficulty
const getScrabsterRequirement = (): number => {
  const difficulty = props.gameData?.difficulty || 'medium';
  const requirements: Record<string, number> = {
    easy: 3,
    medium: 4,
    hard: 5,
  };
  return requirements[difficulty] || 4;
};

// Computed properties
const difficultyText = computed((): string => {
  if (!props.gameData) return 'Lädt...';
  const difficulties: Record<string, string> = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
  };
  return difficulties[props.gameData.difficulty] || 'Unbekannt';
});

const difficultyClass = computed((): string => {
  if (!props.gameData) return 'text-gray-600';
  const classes: Record<string, string> = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600',
  };
  return classes[props.gameData.difficulty] || 'text-gray-600';
});

const difficultyTime = computed((): number => {
  if (!props.gameData) return 60;
  const times: Record<string, number> = {
    easy: 120,
    medium: 90,
    hard: 60,
  };
  return times[props.gameData.difficulty] || 60;
});

const timerClass = computed((): string => {
  if (timeLeft.value <= 10) return 'danger';
  if (timeLeft.value <= 30) return 'warning';
  return '';
});

const statusText = computed((): string => {
  const statuses: Record<string, string> = {
    waiting: 'Warten auf Start',
    playing: 'Spiel läuft',
    finished: 'Beendet',
  };
  return statuses[gameState.value] || 'Unbekannt';
});

const statusClass = computed((): string => {
  const classes: Record<string, string> = {
    waiting: 'text-yellow-600',
    playing: 'text-green-600',
    finished: 'text-gray-600',
  };
  return classes[gameState.value] || 'text-gray-600';
});

const sortedPlayers = computed((): Player[] => {
  return [...players.value].sort((a, b) => b.score - a.score);
});

// Buchstaben-Häufigkeit berechnen
const letterFrequency = computed((): Record<string, number> => {
  const frequency: Record<string, number> = {};
  letters.value.forEach(letter => {
    frequency[letter] = (frequency[letter] || 0) + 1;
  });
  return frequency;
});

// Punkte für aktuelles Wort berechnen (neue Regel)
const currentWordScore = computed((): number => {
  if (!currentWord.value.trim() || !letters.value.length) return 0;
  const scrabsterRequirement = getScrabsterRequirement();
  return calculateWordScore(
    currentWord.value.toUpperCase(),
    letters.value,
    scrabsterRequirement
  );
});

const isHost = computed((): boolean => {
  if (!players.value || players.value.length === 0 || !currentPlayerId.value) {
    return false;
  }
  // Der erste Spieler im Array ist der Host (Spielersteller)
  return players.value[0]?.id === currentPlayerId.value;
});

const currentUsername = computed((): string => {
  const currentPlayer = players.value.find(
    player => player.id === currentPlayerId.value
  );
  return currentPlayer?.username || 'Spieler';
});

// Methods
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const submitWord = async (): Promise<void> => {
  if (
    !currentWord.value.trim() ||
    gameState.value !== 'playing' ||
    !props.gameData ||
    !props.gameApi
  )
    return;

  // Validation is now only a warning, not a blocker
  // Words can be submitted even if marked as invalid

  try {
    await props.gameApi.submitWord(currentWord.value.trim());

    // Track word submission
    if (window.analytics) {
      const wordLength = currentWord.value.length;
      const score = currentWordScore.value;
      window.analytics.trackWordSubmitted(wordLength, score);
    }

    currentWord.value = '';
    wordValidation.value = null; // Clear validation after successful submit
  } catch (error) {
    console.error('Error submitting word:', error);
  }
};

const startGame = async (): Promise<void> => {
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

const leaveGame = async (): Promise<void> => {
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
const openShareModal = (): void => {
  showShareModal.value = true;
};

const closeShareModal = (): void => {
  showShareModal.value = false;
};

// Voice input methods
const initVoiceInput = (): void => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    recognition.value.continuous = false;
    recognition.value.interimResults = false;
    recognition.value.lang = 'de-DE';

    recognition.value.onstart = () => {
      isListening.value = true;
    };

    recognition.value.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      currentWord.value = transcript;

      // Highlight matching letters
      highlightMatchingLetters(transcript);
    };

    recognition.value.onend = () => {
      isListening.value = false;
    };

    recognition.value.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      isListening.value = false;
    };

    isVoiceSupported.value = true;
  }
};

const toggleVoiceInput = (): void => {
  if (!recognition.value) return;

  if (isListening.value) {
    recognition.value.stop();
  } else {
    recognition.value.start();
  }
};

const highlightMatchingLetters = (word: string): void => {
  const wordLetters = word.toUpperCase().split('');
  const availableLetters = [...letters.value];
  const highlighted: number[] = [];

  for (let i = 0; i < wordLetters.length; i++) {
    const letter = wordLetters[i];
    if (letter) {
      const index = availableLetters.indexOf(letter);
      if (index !== -1) {
        highlighted.push(index);
        availableLetters.splice(index, 1); // Remove to avoid duplicates
      }
    }
  }

  highlightedLetters.value = highlighted;

  // Clear highlight after 2 seconds
  setTimeout(() => {
    highlightedLetters.value = [];
  }, 2000);
};

// Game API event handlers
const setupGameApiListeners = (): void => {
  if (!props.gameApi) return;

  props.gameApi.on('gameJoined', (data: any) => {
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    players.value = data.players;
    currentPlayerId.value = data.playerId;
  });

  props.gameApi.on('gameCreated', (data: any) => {
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    currentPlayerId.value = data.playerId;
    if (data.players) {
      players.value = data.players;
    }
  });

  props.gameApi.on('playerJoined', (data: any) => {
    players.value = data.players;
  });

  props.gameApi.on('playerLeft', (data: any) => {
    players.value = data.players;
  });

  props.gameApi.on('gameStarted', (data: any) => {
    gameState.value = 'playing';
    letters.value = data.letters;
    timeLeft.value = data.timeLeft;
    players.value = data.players;
  });

  props.gameApi.on('gameStateUpdate', (data: any) => {
    timeLeft.value = data.timeLeft;
    players.value = data.players;
    if (data.gameState) {
      gameState.value = data.gameState;
    }
    // Gewinner-Information aktualisieren
    if (data.winner !== undefined) {
      winner.value = data.winner;
    }
    if (data.isDraw !== undefined) {
      isDraw.value = data.isDraw;
    }

    // Chat-Nachrichten verarbeiten
    if (data.chatMessages && data.chatMessages.length > 0) {
      data.chatMessages.forEach((message: any) => {
        // Nur neue Nachrichten hinzufügen
        if (!processedChatMessageIds.value.has(message.id)) {
          processedChatMessageIds.value.add(message.id);

          // Nur Nachrichten von anderen Spielern hinzufügen
          if (message.playerId !== currentPlayerId.value) {
            const chatMessage = {
              id: message.id,
              username: message.username,
              text: message.message,
              timestamp: new Date(message.timestamp),
              isOwn: false,
            };
            chatMessages.value.push(chatMessage);
            scrollChatToBottom();
          }
        }
      });
    }
  });

  props.gameApi.on('wordSubmitted', (data: any) => {
    if (data.playerId === currentPlayerId.value) {
      myWords.value.push(data.word);

      // Berechne Punkte für das Wort
      const scrabsterRequirement = getScrabsterRequirement();
      const wordScore = calculateWordScore(
        data.word,
        letters.value,
        scrabsterRequirement
      );
      wordScores.value.push(wordScore);

      // Sound-Effekt für erfolgreich eingereichtes Wort
      soundService.playWordSubmitSound();
    }
    players.value = data.players;
  });

  props.gameApi.on('wordRejected', (data: any) => {
    (window as any).showDialog({
      title: 'Wort abgelehnt',
      message: data.message,
      type: 'error',
    });
  });

  props.gameApi.on('scrabster', (data: any) => {
    if (data.playerId === currentPlayerId.value) {
      // Scrabster-Sound abspielen
      soundService.playScrabsterSound();

      // Scrabster-Notification anzeigen (optional)
      console.log(
        `🎉 SCRABSTER! Du hast "${data.word}" gefunden! (${data.scrabsterCount} Scrabster gesamt)`
      );
    }
    players.value = data.players;
  });

  props.gameApi.on('gameOver', (data: any) => {
    gameState.value = 'finished';
    // Gewinner-Sound abspielen
    soundService.playWinnerSound();
    emit('gameOver', data);
  });
};

// Word validation
const validateCurrentWord = async (): Promise<void> => {
  if (!currentWord.value.trim() || gameState.value !== 'playing') {
    wordValidation.value = null;
    return;
  }

  isValidating.value = true;
  wordValidation.value = null;

  try {
    const result = await wordValidationService.validateWord(
      currentWord.value.trim()
    );

    // Zusätzliche Prüfung: Verwendet das Wort überhaupt Buchstaben aus der verfügbaren Liste?
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

    // Wenn kein Buchstabe aus der verfügbaren Liste verwendet wurde
    if (usedLetters === 0) {
      wordValidation.value = {
        isValid: false,
        reason: 'Wort verwendet keine verfügbaren Buchstaben (0 Punkte)',
        word: currentWord.value.trim(),
        source: 'letter_check',
      };
    } else {
      wordValidation.value = result;
    }
  } catch (error) {
    console.warn('Wort-Validierung fehlgeschlagen:', error);
    wordValidation.value = {
      isValid: true,
      reason: 'Validierung fehlgeschlagen - Wort akzeptiert',
      word: currentWord.value.trim(),
      source: 'offline',
    };
  } finally {
    isValidating.value = false;
  }
};

// Watch currentWord for validation
watch(currentWord, () => {
  // Debounce validation
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }
  validationTimeout = setTimeout(validateCurrentWord, 500);
});

let validationTimeout: any = null;

// Lifecycle
// Chat methods
const sendChatMessage = async (): Promise<void> => {
  if (!newChatMessage.value.trim() || isSendingChat.value || !props.gameApi)
    return;

  const messageText = newChatMessage.value.trim();
  newChatMessage.value = '';
  isSendingChat.value = true;

  try {
    // Send message to server
    await props.gameApi.sendChatMessage(messageText, currentUsername.value);

    // Add message to local state immediately for better UX
    const message = {
      id: Date.now().toString(),
      username: currentUsername.value,
      text: messageText,
      timestamp: new Date(),
      isOwn: true,
    };

    chatMessages.value.push(message);
    scrollChatToBottom();
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Show error to user
    if (window.analytics) {
      window.analytics.trackEvent('chat_error', {
        error: error instanceof Error ? error.message : String(error),
        event_category: 'chat',
      });
    }
  } finally {
    isSendingChat.value = false;
  }
};

const toggleChat = (): void => {
  isChatExpanded.value = !isChatExpanded.value;
  if (isChatExpanded.value) {
    scrollChatToBottom();
  }
};

const formatChatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const scrollChatToBottom = (): void => {
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop =
        chatMessagesContainer.value.scrollHeight;
    }
  });
};

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

  // Add welcome message to chat
  const welcomeMessage = {
    id: 'welcome',
    username: 'System',
    text: `Willkommen im Spiel ${
      props.gameData?.gameCode || 'Unbekannt'
    }! Viel Spaß beim Spielen! 🎮`,
    timestamp: new Date(),
    isOwn: false,
  };
  chatMessages.value.push(welcomeMessage);
});

onUnmounted(() => {
  if (recognition.value && isListening.value) {
    recognition.value.stop();
  }
});
</script>
