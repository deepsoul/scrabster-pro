/**
 * Helper functions for word badges (letters count and points)
 */

/**
 * Calculate the number of letters used from available letters in a word
 * @param {string} word - The word to analyze
 * @param {Array} availableLetters - Array of available letters
 * @returns {number} Number of letters used from available letters
 */
export function getUsedLettersCount(word, availableLetters) {
  if (!word || !availableLetters || availableLetters.length === 0) return 0;
  
  const wordLetters = word.toUpperCase().split('');
  const availableLettersCopy = [...availableLetters];
  let usedCount = 0;
  
  wordLetters.forEach(letter => {
    const index = availableLettersCopy.indexOf(letter);
    if (index !== -1) {
      availableLettersCopy.splice(index, 1); // Remove the letter
      usedCount++;
    }
  });
  
  return usedCount;
}

/**
 * Calculate word score based on used letters and Scrabster bonus
 * @param {string} word - The word to score
 * @param {Array} availableLetters - Array of available letters
 * @param {number} scrabsterRequirement - Required letters for Scrabster (3, 4, or 5)
 * @returns {number} Total score for the word
 */
export function calculateWordScore(word, availableLetters, scrabsterRequirement = 4) {
  if (!word || !availableLetters || availableLetters.length === 0) return 0;
  
  const usedLetters = getUsedLettersCount(word, availableLetters);
  const baseScore = usedLetters * 2; // 2 points per used letter
  
  // Check for Scrabster bonus
  const isScrabster = usedLetters >= scrabsterRequirement;
  const scrabsterBonus = isScrabster ? 10 : 0;
  
  return baseScore + scrabsterBonus;
}

/**
 * Check if a word is a Scrabster
 * @param {string} word - The word to check
 * @param {Array} availableLetters - Array of available letters
 * @param {number} scrabsterRequirement - Required letters for Scrabster
 * @returns {boolean} True if word is a Scrabster
 */
export function isScrabsterWord(word, availableLetters, scrabsterRequirement = 4) {
  if (!word || !availableLetters || availableLetters.length === 0) return false;
  
  const usedLetters = getUsedLettersCount(word, availableLetters);
  return usedLetters >= scrabsterRequirement;
}

/**
 * Get badge color class based on used letters count
 * @param {number} usedLetters - Number of used letters
 * @param {number} scrabsterRequirement - Required letters for Scrabster
 * @returns {string} Tailwind CSS class for badge color
 */
export function getLettersBadgeColor(usedLetters, scrabsterRequirement = 4) {
  if (usedLetters >= scrabsterRequirement) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Scrabster color
  } else if (usedLetters >= scrabsterRequirement - 1) {
    return 'bg-orange-100 text-orange-800 border-orange-200'; // Close to Scrabster
  } else if (usedLetters >= 2) {
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Good word
  } else {
    return 'bg-gray-100 text-gray-800 border-gray-200'; // Basic word
  }
}

/**
 * Get badge color class based on points
 * @param {number} points - Points for the word
 * @returns {string} Tailwind CSS class for badge color
 */
export function getPointsBadgeColor(points) {
  if (points >= 20) {
    return 'bg-green-100 text-green-800 border-green-200'; // High score
  } else if (points >= 10) {
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Good score
  } else if (points >= 5) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Medium score
  } else {
    return 'bg-gray-100 text-gray-800 border-gray-200'; // Low score
  }
}
