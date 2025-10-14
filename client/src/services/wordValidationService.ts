import { germanWords, wordValidationUtils } from '../data/germanWords.js';
import type { WordValidation } from '@/types';

// Wort-Validierungs-Service für deutsche Wörter (Offline)
class WordValidationService {
  private cache: Map<string, WordValidation> = new Map(); // Cache für bereits validierte Wörter
  private isEnabled: boolean = true; // Kann deaktiviert werden
  private germanWords: Set<string> = germanWords; // Große deutsche Wortliste

  // Service aktivieren/deaktivieren
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Wort validieren (Offline)
  async validateWord(word: string): Promise<WordValidation> {
    if (!this.isEnabled) {
      return {
        isValid: true,
        reason: 'Validation disabled',
        word: word.trim().toLowerCase(),
        source: 'offline',
      };
    }

    const cleanWord = word.trim().toLowerCase();

    // Mindestlänge prüfen
    if (cleanWord.length < 2) {
      return {
        isValid: false,
        reason: 'Wort zu kurz (mindestens 2 Buchstaben)',
        word: cleanWord,
        source: 'offline',
      };
    }

    // Nur Buchstaben erlauben
    if (!/^[a-zäöüß]+$/i.test(cleanWord)) {
      return {
        isValid: false,
        reason: 'Nur Buchstaben erlaubt',
        word: cleanWord,
        source: 'offline',
      };
    }

    // Cache prüfen
    if (this.cache.has(cleanWord)) {
      return this.cache.get(cleanWord)!;
    }

    // Offline-Validierung mit großer deutscher Wortliste
    const isValid = this.germanWords.has(cleanWord);

    const result: WordValidation = {
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
  async validateWords(
    words: string[]
  ): Promise<Array<WordValidation & { word: string }>> {
    const results: Array<WordValidation & { word: string }> = [];
    for (const word of words) {
      const result = await this.validateWord(word);
      results.push({ word, ...result });
    }
    return results;
  }

  // Cache leeren
  clearCache(): void {
    this.cache.clear();
  }

  // Cache-Statistiken
  getCacheStats(): { size: number; entries: Array<[string, WordValidation]> } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()),
    };
  }

  // Wortliste-Statistiken
  getWordListStats(): any {
    return wordValidationUtils.getWordStats();
  }

  // Zufällige Wörter für Tests
  getRandomWords(count: number = 10): string[] {
    return wordValidationUtils.getRandomWords(count);
  }
}

// Singleton-Instanz
const wordValidationService = new WordValidationService();

export default wordValidationService;
