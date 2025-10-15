import { germanWords, wordValidationUtils } from '../data/germanWords.js';

// Wort-Validierungs-Service für deutsche Wörter (Offline)
class WordValidationService {
  constructor() {
    this.cache = new Map(); // Cache für bereits validierte Wörter
    this.isEnabled = true; // Kann deaktiviert werden
    this.germanWords = germanWords; // Große deutsche Wortliste
  }

  // Service aktivieren/deaktivieren
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Wort validieren (Offline)
  async validateWord(word) {
    if (!this.isEnabled) {
      return { isValid: true, reason: 'Validation disabled' };
    }

    const cleanWord = word.trim().toLowerCase();

    // Mindestlänge prüfen
    if (cleanWord.length < 2) {
      return {
        isValid: false,
        reason: 'Wort zu kurz (mindestens 2 Buchstaben)',
      };
    }

    // Nur Buchstaben erlauben
    if (!/^[a-zäöüß]+$/i.test(cleanWord)) {
      return { isValid: false, reason: 'Nur Buchstaben erlaubt' };
    }

    // Cache prüfen
    if (this.cache.has(cleanWord)) {
      return this.cache.get(cleanWord);
    }

    // Offline-Validierung mit großer deutscher Wortliste
    const isValid = this.germanWords.has(cleanWord);

    const result = {
      isValid,
      reason: isValid
        ? 'Gültiges deutsches Wort'
        : 'Wort nicht im Wörterbuch gefunden (kann trotzdem gesendet werden)',
      word: cleanWord,
      source: 'offline',
    };

    this.cache.set(cleanWord, result);
    return result;
  }

  // Mehrere Wörter validieren
  async validateWords(words) {
    const results = [];
    for (const word of words) {
      const result = await this.validateWord(word);
      results.push({ word, ...result });
    }
    return results;
  }

  // Cache leeren
  clearCache() {
    this.cache.clear();
  }

  // Cache-Statistiken
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()),
    };
  }

  // Wortliste-Statistiken
  getWordListStats() {
    return wordValidationUtils.getWordStats();
  }

  // Zufällige Wörter für Tests
  getRandomWords(count = 10) {
    return wordValidationUtils.getRandomWords(count);
  }
}

// Singleton-Instanz
const wordValidationService = new WordValidationService();

export default wordValidationService;
