/**
 * Blitz Module
 * Blitz mode specific logic
 */

window.CF = window.CF || {};

CF.Blitz = (() => {
  const S = CF.State;
  const Q = CF.Questions;

  /* Generate blitz questions */
  function generateBlitzQuestions(count = 10) {
    const allQuestions = Q.getAllQuestions();
    return Q.shuffleArray([...allQuestions]).slice(0, count);
  }

  /* Get blitz timer settings */
  function getBlitzSettings() {
    return {
      questionTime: 10000, // 10 seconds per question
      totalQuestions: 10,
      penalty: 5 // HP penalty for wrong answer
    };
  }

  /* Calculate blitz score */
  function calculateBlitzScore(correct, total, timeRemaining) {
    const accuracy = correct / total;
    const timeBonus = Math.max(0, timeRemaining / 1000); // seconds remaining
    
    // Base score: 100 points per correct answer
    let score = correct * 100;
    
    // Accuracy bonus
    if (accuracy >= 0.8) score += 100;
    if (accuracy >= 0.9) score += 100;
    if (accuracy === 1.0) score += 100;
    
    // Time bonus
    score += Math.round(timeBonus * 10);
    
    return score;
  }

  /* Public API */
  return {
    generateBlitzQuestions,
    getBlitzSettings,
    calculateBlitzScore
  };
})();
