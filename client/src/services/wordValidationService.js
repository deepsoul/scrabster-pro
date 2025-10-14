// Wort-Validierungs-Service für deutsche Wörter
class WordValidationService {
  constructor() {
    this.cache = new Map(); // Cache für bereits validierte Wörter
    this.apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/de'; // Kostenlose API
    this.isEnabled = true; // Kann deaktiviert werden falls API nicht verfügbar
  }

  // Service aktivieren/deaktivieren
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Wort validieren
  async validateWord(word) {
    if (!this.isEnabled) {
      return { isValid: true, reason: 'Validation disabled' };
    }

    const cleanWord = word.trim().toLowerCase();
    
    // Mindestlänge prüfen
    if (cleanWord.length < 2) {
      return { isValid: false, reason: 'Wort zu kurz (mindestens 2 Buchstaben)' };
    }

    // Nur Buchstaben erlauben
    if (!/^[a-zäöüß]+$/i.test(cleanWord)) {
      return { isValid: false, reason: 'Nur Buchstaben erlaubt' };
    }

    // Cache prüfen
    if (this.cache.has(cleanWord)) {
      return this.cache.get(cleanWord);
    }

    try {
      // API-Aufruf
      const response = await fetch(`${this.apiUrl}/${encodeURIComponent(cleanWord)}`);
      
      if (response.ok) {
        const data = await response.json();
        const result = { 
          isValid: true, 
          reason: 'Gültiges deutsches Wort',
          word: cleanWord,
          definitions: data[0]?.meanings || []
        };
        this.cache.set(cleanWord, result);
        return result;
      } else if (response.status === 404) {
        const result = { 
          isValid: false, 
          reason: 'Wort nicht im deutschen Wörterbuch gefunden',
          word: cleanWord
        };
        this.cache.set(cleanWord, result);
        return result;
      } else {
        // API-Fehler - Wort als gültig annehmen
        const result = { 
          isValid: true, 
          reason: 'API-Fehler - Wort akzeptiert',
          word: cleanWord
        };
        this.cache.set(cleanWord, result);
        return result;
      }
    } catch (error) {
      console.warn('Wort-Validierung fehlgeschlagen:', error);
      // Bei Netzwerk-Fehlern Wort als gültig annehmen
      const result = { 
        isValid: true, 
        reason: 'Netzwerk-Fehler - Wort akzeptiert',
        word: cleanWord
      };
      this.cache.set(cleanWord, result);
      return result;
    }
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
      entries: Array.from(this.cache.entries())
    };
  }
}

// Singleton-Instanz
const wordValidationService = new WordValidationService();

export default wordValidationService;
