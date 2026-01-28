<template>
  <div class="max-w-6xl mx-auto">
    <!-- Training Header -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center space-x-4 mb-4 sm:mb-0">
          <div class="text-center">
            <div class="text-sm text-gray-500">Trainingsmodus</div>
            <div class="text-xl font-bold text-primary-600 font-display">
              🎯 Solo-Übung
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
            v-if="gameState === 'waiting'"
            @click="startTraining"
            class="btn-success text-sm py-2 px-4 flex items-center"
          >
            <span class="mr-2">▶️</span>
            Training starten
          </button>
          <button
            v-if="gameState === 'playing'"
            @click="pauseTraining"
            class="btn-warning text-sm py-2 px-4 flex items-center"
          >
            <span class="mr-2">⏸️</span>
            Pausieren
          </button>
          <button
            v-if="gameState === 'paused'"
            @click="resumeTraining"
            class="btn-success text-sm py-2 px-4 flex items-center"
          >
            <span class="mr-2">▶️</span>
            Fortsetzen
          </button>
          <button
            v-if="gameState === 'finished'"
            @click="restartTraining"
            class="btn-primary text-sm py-2 px-4 flex items-center"
          >
            <span class="mr-2">🔄</span>
            Neues Training
          </button>
          <button @click="backToLobby" class="btn-danger text-sm py-2 px-4">
            Zurück zur Lobby
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sticky Timer -->
    <div class="md:hidden sticky top-4 z-40 mb-4">
      <div
        class="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200"
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
                v-if="
                  letterFrequency &&
                  letterFrequency[letter] &&
                  letterFrequency[letter] > 1
                "
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
              ref="wordInputRef"
              v-model="currentWord"
              @keyup.enter="submitWord"
              type="text"
              placeholder="Gib dein Wort ein..."
              class="input-field flex-1 text-lg"
              :class="{
                'voice-recording': isListening,
                'voice-pulse': isListening,
              }"
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
                  wordValidation.isValid ? 'text-green-600' : 'text-orange-600'
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
                  ? 'bg-red-500 text-white voice-button-pulse'
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
                      scrabsterRequirements
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
                  :class="getPointsBadgeColor(wordScores[index])"
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
                  {{ wordScores[index] }} Pkt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Stats Sidebar -->
      <div class="space-y-6">
        <!-- Training Stats -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Training-Statistiken
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Punkte:</span>
              <span class="font-bold text-primary-600">
                {{ totalScore + (isScrabster ? scrabsterBonus : 0) }} Pkt
                <span v-if="isScrabster" class="text-green-600 text-sm">
                  (+{{ scrabsterBonus }} Bonus)
                </span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Wörter:</span>
              <span class="font-medium">{{ myWords.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Durchschnitt:</span>
              <span class="font-medium">
                {{ averageScore > 0 ? averageScore.toFixed(1) : '0' }} Pkt/Wort
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Beste Leistung:</span>
              <span class="font-medium text-green-600">
                {{ bestWordScore }} Pkt
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Scrabster:</span>
              <span class="font-medium text-yellow-600 flex items-center">
                ⚡ {{ scrabsterCount }}
              </span>
            </div>
          </div>
        </div>

        <!-- Game Status -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Trainingsstatus
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

        <!-- Training Tips -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            💡 Trainingstipps
          </h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-start">
              <span class="text-primary-500 mr-2">🎯</span>
              <span>Ziel: Wenige, aber lange Wörter bilden</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary-500 mr-2">⚡</span>
              <span>
                Ein "Scrabster" (alle Buchstaben verwenden) = 50% +
                Effizienz-Bonus!
              </span>
            </div>
            <div class="flex items-start">
              <span class="text-primary-500 mr-2">🧠</span>
              <span>Übe verschiedene Strategien</span>
            </div>
            <div class="flex items-start">
              <span class="text-primary-500 mr-2">📈</span>
              <span>Verfolge deine Fortschritte</span>
            </div>
          </div>
        </div>

        <!-- Missing Letters Display -->
        <div
          v-if="gameState === 'playing' && remainingLetters.length > 0"
          class="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Noch verfügbare Buchstaben ({{ remainingLetters.length }})
          </h3>
          <div class="flex flex-wrap justify-center gap-2">
            <div
              v-for="(letter, index) in remainingLetters"
              :key="index"
              class="letter-tile bg-gray-100 text-gray-600"
            >
              {{ letter }}
            </div>
          </div>
        </div>

        <!-- Game Over Display -->
        <div
          v-if="gameState === 'finished'"
          class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center"
        >
          <div class="text-2xl font-bold mb-4">
            <span v-if="isScrabster" class="text-green-600">
              🏆 Scrabster! Perfekt! 🎯
            </span>
            <span v-else class="text-blue-600">Training beendet! 📚</span>
          </div>
          <div class="text-lg text-gray-600 mb-4">
            {{ totalScore + (isScrabster ? scrabsterBonus : 0) }} Punkte mit
            {{ myWords.length }} Wörtern
          </div>
          <div
            v-if="isScrabster"
            class="text-lg text-green-600 mb-2 font-semibold"
          >
            +{{ scrabsterBonus }} Bonus-Punkte! 🎉
          </div>
          <div class="text-sm text-gray-500">
            <span v-if="isScrabster">Du hast alle Buchstaben verwendet!</span>
            <span v-else>{{ remainingLetters.length }} Buchstaben übrig</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import soundService from '../services/soundService.js';
import wordValidationService from '../services/wordValidationService.js';
import {
  getUsedLettersCount,
  getLettersBadgeColor,
  getPointsBadgeColor,
  calculateWordScore as calculateWordScoreUtil,
  isScrabsterWord as isScrabsterWordUtil,
} from '../utils/wordBadges.js';
import type { DifficultyLevel, WordValidation } from '@/types';

// Define props with proper typing
const props = defineProps<{
  difficulty: DifficultyLevel;
}>();

// Define emits with proper typing
const emit = defineEmits<{
  backToLobby: [];
}>();

// Game state
const gameState = ref<'waiting' | 'playing' | 'paused' | 'finished'>('waiting');
const timeLeft = ref<number>(0);
const letters = ref<string[]>([]);
const myWords = ref<string[]>([]);
const wordScores = ref<number[]>([]); // Speichere Punkte für jedes Wort
const currentWord = ref<string>('');
const isScrabster = ref<boolean>(false);
const scrabsterCount = ref<number>(0);
const scrabsterBonus = ref<number>(0);
const wordValidation = ref<WordValidation | null>(null);
const isValidating = ref<boolean>(false);

// Voice input
const isVoiceSupported = ref<boolean>(false);
const isListening = ref<boolean>(false);
const recognition = ref<any>(null);
const highlightedLetters = ref<number[]>([]);

// Input field ref for focus management
const wordInputRef = ref<HTMLInputElement>();

// Timer
let timerInterval: NodeJS.Timeout | null = null;

// Computed properties
const difficultyText = computed((): string => {
  const difficulties: Record<string, string> = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
  };
  return difficulties[props.difficulty] || 'Mittel';
});

const difficultyClass = computed((): string => {
  const classes: Record<string, string> = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600',
  };
  return classes[props.difficulty] || 'text-yellow-600';
});

const difficultyTime = computed((): number => {
  const times: Record<string, number> = {
    easy: 120,
    medium: 90,
    hard: 60,
  };
  return times[props.difficulty] || 90;
});

const scrabsterRequirements = computed((): number => {
  const requirements: Record<string, number> = {
    easy: 3,
    medium: 4,
    hard: 5,
  };
  return requirements[props.difficulty] || 4;
});

const timerClass = computed((): string => {
  if (timeLeft.value <= 10) return 'danger';
  if (timeLeft.value <= 30) return 'warning';
  return '';
});

const statusText = computed((): string => {
  const statuses: Record<string, string> = {
    waiting: 'Bereit zum Start',
    playing: 'Training läuft',
    paused: 'Pausiert',
    finished: 'Beendet',
  };
  return statuses[gameState.value] || 'Unbekannt';
});

const statusClass = computed((): string => {
  const classes: Record<string, string> = {
    waiting: 'text-blue-600',
    playing: 'text-green-600',
    paused: 'text-yellow-600',
    finished: 'text-gray-600',
  };
  return classes[gameState.value] || 'text-gray-600';
});

// Buchstaben-Häufigkeit berechnen
const letterFrequency = computed((): Record<string, number> => {
  const frequency: Record<string, number> = {};
  if (letters.value && letters.value.length > 0) {
    letters.value.forEach(letter => {
      if (letter) {
        frequency[letter] = (frequency[letter] || 0) + 1;
      }
    });
  }
  return frequency;
});

// Punkte für aktuelles Wort berechnen (neue Regel)
const currentWordScore = computed((): number => {
  if (!currentWord.value.trim() || !letters.value.length) return 0;
  return calculateWordScoreUtil(
    currentWord.value.toUpperCase(),
    letters.value,
    scrabsterRequirements.value
  );
});

// Training statistics (neue Regel)
const totalScore = computed((): number => {
  return wordScores.value.reduce((sum, score) => sum + score, 0);
});

const averageScore = computed((): number => {
  if (myWords.value.length === 0) return 0;
  return totalScore.value / myWords.value.length;
});

const bestWordScore = computed((): number => {
  if (wordScores.value.length === 0) return 0;
  return Math.max(...wordScores.value);
});

const remainingLetters = computed((): string[] => {
  // Start with all original letters
  const availableLetters = [...letters.value];

  // Remove letters used in each word
  myWords.value.forEach(word => {
    const wordLetters = word.toUpperCase().split('');
    wordLetters.forEach(letter => {
      const index = availableLetters.indexOf(letter);
      if (index !== -1) {
        availableLetters.splice(index, 1); // Remove the letter
      }
    });
  });

  return availableLetters;
});

// Berechne prozentualen Scrabster-Bonus basierend auf Effizienz
const calculateScrabsterBonus = (): number => {
  if (!isScrabster.value || myWords.value.length === 0) return 0;

  const totalLetters = letters.value.length;
  const wordsUsed = myWords.value.length;

  // Basis-Bonus: 50% der Gesamtpunkte
  const baseBonus = Math.floor(totalScore.value * 0.5);

  // Effizienz-Bonus: Je weniger Wörter, desto höher der Bonus
  // Theoretisches Minimum: 1 Wort (alle Buchstaben in einem Wort)
  // Praktisches Minimum: 2-3 Wörter je nach Schwierigkeit
  const theoreticalMinWords = Math.ceil(totalLetters / 8); // Annahme: 8 Buchstaben pro Wort
  const efficiencyRatio = Math.max(
    0,
    (theoreticalMinWords - wordsUsed) / theoreticalMinWords
  );

  // Effizienz-Bonus: 0-100% zusätzlich zum Basis-Bonus
  const efficiencyBonus = Math.floor(baseBonus * efficiencyRatio);

  return baseBonus + efficiencyBonus;
};

// Methods
const generateLetters = (): string[] => {
  const letterSets: Record<string, string[]> = {
    easy: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    medium: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    hard: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
  };

  const letterCounts: Record<string, number> = {
    easy: 9,
    medium: 8,
    hard: 7,
  };

  const availableLetters = letterSets[props.difficulty] || letterSets.medium;
  const count = letterCounts[props.difficulty] || 8;

  if (!availableLetters || availableLetters.length === 0) {
    return [];
  }

  const generated: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const letter = availableLetters[randomIndex];
    if (letter) {
      generated.push(letter);
    }
  }

  return generated;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startTraining = (): void => {
  letters.value = generateLetters();
  timeLeft.value = difficultyTime.value;
  myWords.value = [];
  wordScores.value = [];
  currentWord.value = '';
  isScrabster.value = false;
  scrabsterCount.value = 0;
  scrabsterBonus.value = 0;
  gameState.value = 'playing';
  startTimer();
};

const pauseTraining = (): void => {
  gameState.value = 'paused';
  stopTimer();
};

const resumeTraining = (): void => {
  gameState.value = 'playing';
  startTimer();
};

const restartTraining = (): void => {
  gameState.value = 'waiting';
  stopTimer();
  letters.value = [];
  timeLeft.value = 0;
  myWords.value = [];
  wordScores.value = [];
  currentWord.value = '';
  isScrabster.value = false;
  scrabsterCount.value = 0;
  scrabsterBonus.value = 0;
};

const backToLobby = (): void => {
  stopTimer();
  emit('backToLobby');
};

const startTimer = (): void => {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishTraining();
    }
  }, 1000);
};

const stopTimer = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const finishTraining = (): void => {
  gameState.value = 'finished';
  stopTimer();

  // Check if all letters were used (Scrabster)
  if (remainingLetters.value.length === 0) {
    isScrabster.value = true;
    // Berechne prozentualen Bonus
    scrabsterBonus.value = calculateScrabsterBonus();
  }

  // Play winner sound
  soundService.playWinnerSound();
};

const submitWord = (): void => {
  if (!currentWord.value.trim() || gameState.value !== 'playing') return;

  // Validation is now only a warning, not a blocker
  // Words can be submitted even if marked as invalid

  const word = currentWord.value.trim().toUpperCase();

  // Check if word can be formed with available letters (new rule: only need some letters)
  if (canFormWord(word)) {
    // Berechne Punkte für das Wort zum Zeitpunkt der Eingabe
    const wordScore = calculateWordScoreUtil(
      word,
      letters.value,
      scrabsterRequirements.value
    );

    myWords.value.push(word);
    wordScores.value.push(wordScore);

    // Play word submit sound
    soundService.playWordSubmitSound();

    // Check for Scrabster (new rule: 3/4/5 letters based on difficulty)
    if (isScrabsterWordUtil(word, letters.value, scrabsterRequirements.value)) {
      scrabsterCount.value++;
      // Play Scrabster sound
      soundService.playScrabsterSound();
      // Scrabster gives 10 bonus points (already included in calculateWordScore)
    }

    currentWord.value = '';
    wordValidation.value = null; // Clear validation after successful submit

    // Focus input field for next word
    nextTick(() => {
      if (wordInputRef.value && gameState.value === 'playing') {
        wordInputRef.value.focus();
      }
    });
  } else {
    window.showDialog({
      title: 'Wort ungültig',
      message: 'Wort muss mindestens einen verfügbaren Buchstaben enthalten!',
      type: 'warning',
    });
  }
};

// New rule: Word is valid if it contains at least one available letter
const canFormWord = (word: string): boolean => {
  const wordLetters = word.split('');
  const availableLetters = [...letters.value]; // Use original letters

  // Check if at least one letter from the word is available
  return wordLetters.some((letter: string) =>
    availableLetters.includes(letter)
  );
};

const getMissingLetters = (word: string): string[] => {
  const wordLetters = word.split('');
  const availableLetters = [...letters.value]; // Use original letters
  const missing: string[] = [];

  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index === -1) {
      missing.push(letter);
    } else {
      availableLetters.splice(index, 1);
    }
  }

  return missing;
};

// Keep old function for backward compatibility, but now uses new rule
const isValidWord = (word: string): boolean => {
  return canFormWord(word);
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
  const availableLetters = [...letters.value]; // Use original letters
  const highlighted: number[] = [];

  for (let i = 0; i < wordLetters.length; i++) {
    const letter = wordLetters[i];
    if (letter) {
      const index = availableLetters.indexOf(letter);
      if (index !== -1) {
        // Find the actual index in the original letters array
        const originalIndex = letters.value.indexOf(letter, highlighted.length);
        if (originalIndex !== -1) {
          highlighted.push(originalIndex);
        }
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
    const availableLetters = [...letters.value]; // Use original letters
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
  } catch (error: any) {
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
onMounted(() => {
  initVoiceInput();
});

onUnmounted(() => {
  stopTimer();
  if (recognition.value && isListening.value) {
    recognition.value.stop();
  }
});
</script>

<style scoped>
/* Voice recording visual feedback */
.voice-recording {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.3) !important;
  background-color: #fef2f2 !important;
}

.voice-pulse {
  animation: voice-pulse 1.5s ease-in-out infinite;
}

@keyframes voice-pulse {
  0% {
    box-shadow: 0 0 0 3px rgb(239 68 68 / 0.3);
  }

  50% {
    box-shadow: 0 0 0 8px rgb(239 68 68 / 0.6);
  }

  100% {
    box-shadow: 0 0 0 3px rgb(239 68 68 / 0.3);
  }
}

.voice-button-pulse {
  animation: voice-button-pulse 1.5s ease-in-out infinite;
}

@keyframes voice-button-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgb(239 68 68 / 0.7);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgb(239 68 68 / 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgb(239 68 68 / 0);
  }
}
</style>
