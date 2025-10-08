import {Dictionary} from './dictionary.js';
import {LetterGenerator} from './letterGenerator.js';

export class GameManager {
  constructor() {
    this.players = new Map();
    this.currentGame = null;
    this.dictionary = new Dictionary();
  }

  addPlayer(playerId, ws) {
    this.players.set(playerId, {
      id: playerId,
      ws,
      words: [],
      score: 0,
    });
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  startNewGame() {
    const letters = LetterGenerator.generateLetters(9);

    this.currentGame = {
      letters,
      startTime: Date.now(),
      duration: 120000, // 2 minutes
      players: new Map(),
      isActive: true,
    };

    // Initialize player game data
    this.players.forEach((player, playerId) => {
      this.currentGame.players.set(playerId, {
        words: [],
        usedLetters: [],
      });
      player.words = [];
      player.score = 0;
    });

    return this.getGameState();
  }

  submitWord(playerId, word) {
    if (!this.currentGame || !this.currentGame.isActive) {
      return {success: false, message: 'No active game'};
    }

    const player = this.players.get(playerId);
    if (!player) {
      return {success: false, message: 'Player not found'};
    }

    const gamePlayer = this.currentGame.players.get(playerId);

    // Check if word is already submitted
    if (gamePlayer.words.includes(word.toUpperCase())) {
      return {success: false, message: 'Word already submitted'};
    }

    // Validate word can be formed from available letters
    const validation = this.validateWord(word, gamePlayer.usedLetters);
    if (!validation.valid) {
      return {success: false, message: validation.message};
    }

    // Check if word is in dictionary
    if (!this.dictionary.isValidWord(word)) {
      return {success: false, message: 'Word not in dictionary'};
    }

    // Add word to player's words
    const upperWord = word.toUpperCase();
    gamePlayer.words.push(upperWord);
    player.words.push(upperWord);
    gamePlayer.usedLetters.push(...validation.lettersUsed);

    // Check for Scrabster (all letters used in one word)
    const isScrabster = this.checkScrabster(upperWord);

    if (isScrabster) {
      this.currentGame.isActive = false;
      return {
        success: true,
        word: upperWord,
        isScrabster: true,
        gameOver: true,
        winner: playerId,
        stats: this.getGameStats(),
      };
    }

    // Check if all letters are used
    if (gamePlayer.usedLetters.length === this.currentGame.letters.length) {
      this.currentGame.isActive = false;
      return {
        success: true,
        word: upperWord,
        allLettersUsed: true,
        gameOver: true,
        winner: playerId,
        stats: this.getGameStats(),
      };
    }

    return {
      success: true,
      word: upperWord,
      lettersRemaining:
        this.currentGame.letters.length - gamePlayer.usedLetters.length,
    };
  }

  validateWord(word, usedLetters) {
    const wordUpper = word.toUpperCase();
    const availableLetters = [...this.currentGame.letters];

    // Remove already used letters
    usedLetters.forEach((letter) => {
      const index = availableLetters.indexOf(letter);
      if (index > -1) {
        availableLetters.splice(index, 1);
      }
    });

    const lettersUsed = [];
    for (const char of wordUpper) {
      const index = availableLetters.indexOf(char);
      if (index === -1) {
        return {
          valid: false,
          message: 'Word cannot be formed from available letters',
        };
      }
      lettersUsed.push(char);
      availableLetters.splice(index, 1);
    }

    return {valid: true, lettersUsed};
  }

  checkScrabster(word) {
    const wordLetters = word.split('').sort().join('');
    const gameLetters = this.currentGame.letters.sort().join('');
    return wordLetters === gameLetters;
  }

  getGameStats() {
    const stats = [];
    this.currentGame.players.forEach((gamePlayer, playerId) => {
      const player = this.players.get(playerId);
      stats.push({
        playerId,
        wordCount: gamePlayer.words.length,
        words: gamePlayer.words,
      });
    });

    // Sort by fewest words (winner has fewest words)
    stats.sort((a, b) => a.wordCount - b.wordCount);

    return stats;
  }

  getGameState() {
    if (!this.currentGame) {
      return {active: false};
    }

    return {
      active: this.currentGame.isActive,
      letters: this.currentGame.letters,
      startTime: this.currentGame.startTime,
      duration: this.currentGame.duration,
      playerCount: this.players.size,
    };
  }

  // New methods for HTTP-based API
  generateLetters(count = 8) {
    return LetterGenerator.generateLetters(count);
  }

  submitWord(playerId, word, availableLetters, playerWords) {
    // Check if word is already submitted
    if (playerWords.includes(word.toUpperCase())) {
      return {success: false, message: 'Word already submitted'};
    }

    // Validate word can be formed from available letters
    const validation = this.validateWordFromLetters(word, availableLetters);
    if (!validation.valid) {
      return {success: false, message: validation.message};
    }

    // Check if word is in dictionary
    if (!this.dictionary.isValidWord(word)) {
      return {success: false, message: 'Word not in dictionary'};
    }

    // Check for Scrabster (all letters used in one word)
    const isScrabster =
      word.length === availableLetters.length &&
      this.checkScrabsterFromLetters(word, availableLetters);

    return {
      success: true,
      word: word.toUpperCase(),
      isScrabster,
      lettersRemaining: availableLetters.length - word.length,
    };
  }

  validateWordFromLetters(word, availableLetters) {
    const wordUpper = word.toUpperCase();
    const availableLettersCopy = [...availableLetters];
    const lettersUsed = [];

    for (const char of wordUpper) {
      const index = availableLettersCopy.indexOf(char);
      if (index === -1) {
        return {
          valid: false,
          message: 'Word cannot be formed from available letters',
        };
      }
      lettersUsed.push(char);
      availableLettersCopy.splice(index, 1);
    }

    return {valid: true, lettersUsed};
  }

  checkScrabsterFromLetters(word, availableLetters) {
    const wordLetters = word.split('').sort().join('');
    const gameLetters = availableLetters.sort().join('');
    return wordLetters === gameLetters;
  }

  checkAllLettersUsed(availableLetters, playerWords) {
    const allUsedLetters = playerWords.join('').split('').sort();
    const gameLetters = availableLetters.sort();
    return (
      allUsedLetters.length === gameLetters.length &&
      allUsedLetters.every((letter, index) => letter === gameLetters[index])
    );
  }
}
