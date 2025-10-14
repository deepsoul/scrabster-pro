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
                <span v-if="!wordValidation.isValid" class="text-orange-500">⚠️</span>
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
                {{ totalScore }} Pkt
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
                Ein "Scrabster" (3/4/5 Buchstaben je Level) = 10 Extrapunkte!
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
            {{ totalScore }} Punkte mit {{ myWords.length }} Wörtern
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

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import soundService from '../services/soundService.js';
import wordValidationService from '../services/wordValidationService.js';

const props = defineProps({
  difficulty: {
    type: String,
    default: 'medium',
  },
});

const emit = defineEmits(['backToLobby']);

// Game state
const gameState = ref('waiting'); // waiting, playing, paused, finished
const timeLeft = ref(0);
const letters = ref([]);
const myWords = ref([]);
const currentWord = ref('');
const isScrabster = ref(false);
const scrabsterCount = ref(0);
const wordValidation = ref(null);
const isValidating = ref(false);

// Voice input
const isVoiceSupported = ref(false);
const isListening = ref(false);
const recognition = ref(null);
const highlightedLetters = ref([]);

// Timer
let timerInterval = null;

// Computed properties
const difficultyText = computed(() => {
  const difficulties = {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
  };
  return difficulties[props.difficulty] || 'Mittel';
});

const difficultyClass = computed(() => {
  const classes = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600',
  };
  return classes[props.difficulty] || 'text-yellow-600';
});

const difficultyTime = computed(() => {
  const times = {
    easy: 120,
    medium: 90,
    hard: 60,
  };
  return times[props.difficulty] || 90;
});

const scrabsterRequirements = computed(() => {
  const requirements = {
    easy: 3,
    medium: 4,
    hard: 5,
  };
  return requirements[props.difficulty] || 4;
});

const timerClass = computed(() => {
  if (timeLeft.value <= 10) return 'danger';
  if (timeLeft.value <= 30) return 'warning';
  return '';
});

const statusText = computed(() => {
  const statuses = {
    waiting: 'Bereit zum Start',
    playing: 'Training läuft',
    paused: 'Pausiert',
    finished: 'Beendet',
  };
  return statuses[gameState.value] || 'Unbekannt';
});

const statusClass = computed(() => {
  const classes = {
    waiting: 'text-blue-600',
    playing: 'text-green-600',
    paused: 'text-yellow-600',
    finished: 'text-gray-600',
  };
  return classes[gameState.value] || 'text-gray-600';
});

// Buchstaben-Häufigkeit berechnen
const letterFrequency = computed(() => {
  const frequency = {};
  letters.value.forEach(letter => {
    frequency[letter] = (frequency[letter] || 0) + 1;
  });
  return frequency;
});

// Punkte für aktuelles Wort berechnen (neue Regel)
const currentWordScore = computed(() => {
  if (!currentWord.value.trim() || !remainingLetters.value.length) return 0;
  return calculateWordScore(currentWord.value.toUpperCase());
});

// Training statistics (neue Regel)
const totalScore = computed(() => {
  return myWords.value.reduce((sum, word) => {
    // Calculate score for each word including Scrabster bonus
    return sum + calculateWordScore(word);
  }, 0);
});

const averageScore = computed(() => {
  if (myWords.value.length === 0) return 0;
  return totalScore.value / myWords.value.length;
});

const bestWordScore = computed(() => {
  if (myWords.value.length === 0) return 0;

  let best = 0;
  for (const word of myWords.value) {
    best = Math.max(best, calculateWordScore(word));
  }
  return best;
});

const remainingLetters = computed(() => {
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

// Methods
const generateLetters = () => {
  const letterSets = {
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

  const letterCounts = {
    easy: 9,
    medium: 8,
    hard: 7,
  };

  const availableLetters = letterSets[props.difficulty] || letterSets.medium;
  const count = letterCounts[props.difficulty] || 8;

  const generated = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    generated.push(availableLetters[randomIndex]);
  }

  return generated;
};

const formatTime = seconds => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startTraining = () => {
  letters.value = generateLetters();
  timeLeft.value = difficultyTime.value;
  myWords.value = [];
  currentWord.value = '';
  isScrabster.value = false;
  gameState.value = 'playing';
  startTimer();
};

const pauseTraining = () => {
  gameState.value = 'paused';
  stopTimer();
};

const resumeTraining = () => {
  gameState.value = 'playing';
  startTimer();
};

const restartTraining = () => {
  gameState.value = 'waiting';
  stopTimer();
  letters.value = [];
  timeLeft.value = 0;
  myWords.value = [];
  currentWord.value = '';
  isScrabster.value = false;
  scrabsterCount.value = 0;
};

const backToLobby = () => {
  stopTimer();
  emit('backToLobby');
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishTraining();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const finishTraining = () => {
  gameState.value = 'finished';
  stopTimer();

  // Play winner sound
  soundService.playWinnerSound();

  // Check if all letters were used (Scrabster)
  if (remainingLetters.value.length === 0) {
    isScrabster.value = true;
  }
};

const submitWord = () => {
  if (!currentWord.value.trim() || gameState.value !== 'playing') return;

  // Validation is now only a warning, not a blocker
  // Words can be submitted even if marked as invalid

  const word = currentWord.value.trim().toUpperCase();

  // Check if word can be formed with available letters (new rule: only need some letters)
  if (canFormWord(word)) {
    myWords.value.push(word);

    // Play word submit sound
    soundService.playWordSubmitSound();

    // Check for Scrabster (new rule: 3/4/5 letters based on difficulty)
    if (isScrabsterWord(word)) {
      scrabsterCount.value++;
      // Play Scrabster sound
      soundService.playScrabsterSound();
      // Scrabster gives 10 bonus points (already included in calculateWordScore)
    }

    currentWord.value = '';
    wordValidation.value = null; // Clear validation after successful submit
  } else {
    alert('Wort muss mindestens einen verfügbaren Buchstaben enthalten!');
  }
};

// New rule: Word is valid if it contains at least one available letter
const canFormWord = word => {
  const wordLetters = word.split('');
  const availableLetters = [...remainingLetters.value];

  // Check if at least one letter from the word is available
  return wordLetters.some(letter => availableLetters.includes(letter));
};

// Calculate score based on how many available letters are used
const calculateWordScore = word => {
  const wordLetters = word.split('');
  const availableLetters = [...remainingLetters.value];
  let usedLetters = 0;

  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      usedLetters++;
      availableLetters.splice(index, 1);
    }
  }

  // Wenn kein einziger Buchstabe aus der verfügbaren Liste verwendet wurde: 0 Punkte
  if (usedLetters === 0) return 0;

  let score = Math.max(1, usedLetters); // Minimum 1 point

  // Scrabster bonus: 10 extra points
  if (isScrabsterWord(word)) {
    score += 10;
  }

  return score;
};

// Check if word is a Scrabster (uses required number of letters from available set)
const isScrabsterWord = word => {
  const wordLetters = word.split('');
  const availableLetters = [...remainingLetters.value];
  const requiredLetters = scrabsterRequirements.value;

  let usedLetters = 0;
  for (const letter of wordLetters) {
    const index = availableLetters.indexOf(letter);
    if (index !== -1) {
      usedLetters++;
      availableLetters.splice(index, 1);
    }
  }

  return usedLetters >= requiredLetters;
};

const getMissingLetters = word => {
  const wordLetters = word.split('');
  const availableLetters = [...remainingLetters.value];
  const missing = [];

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
const isValidWord = word => {
  return canFormWord(word);
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
  const availableLetters = [...remainingLetters.value];
  const highlighted = [];

  for (let i = 0; i < wordLetters.length; i++) {
    const letter = wordLetters[i];
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

  highlightedLetters.value = highlighted;

  // Clear highlight after 2 seconds
  setTimeout(() => {
    highlightedLetters.value = [];
  }, 2000);
};

// Word validation
const validateCurrentWord = async () => {
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
    const availableLetters = [...remainingLetters.value];
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
        source: 'letter_check'
      };
    } else {
      wordValidation.value = result;
    }
  } catch (error) {
    console.warn('Wort-Validierung fehlgeschlagen:', error);
    wordValidation.value = {
      isValid: true,
      reason: 'Validierung fehlgeschlagen - Wort akzeptiert',
    };
  } finally {
    isValidating.value = false;
  }
};

// Watch currentWord for validation
watch(currentWord, () => {
  // Debounce validation
  clearTimeout(validationTimeout);
  validationTimeout = setTimeout(validateCurrentWord, 500);
});

let validationTimeout = null;

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
