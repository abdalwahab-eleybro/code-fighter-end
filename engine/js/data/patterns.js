/**
 * Patterns Data Module
 * Contains all pattern definitions for the campaign
 */

window.CF = window.CF || {};

CF.Patterns = (function() {
  const PATTERNS = [
    { id: 'f1',    name: 'Foundations',          volume: 1, icon: '\ud83c\udf93' },
    { id: 'p1',    name: 'Converging',            volume: 1, icon: '\u25b6' },
    { id: 'p2',    name: 'Read-Write',            volume: 1, icon: '\u2192' },
    { id: 'p3',    name: 'Backwards Write',       volume: 1, icon: '\u2190' },
    { id: 'p4',    name: 'Sliding Window',        volume: 1, icon: '\ud83d\uddfa' },
    { id: 'p5',    name: 'Two-Array Merge',       volume: 1, icon: '\u2194' },
    { id: 'p6',    name: 'Prefix Sum',            volume: 1, icon: '\u2211' },
    { id: 'p7',    name: 'Kadane',                volume: 1, icon: '\ud83d\udca8' },
    { id: 'guard', name: 'Guarded Skipping',      volume: 1, icon: '\ud83d\uded' },
    { id: 'x1',    name: 'Three Pointers',        volume: 1, icon: '\u2733' },
    { id: 'x2',    name: 'Outward Expansion',     volume: 1, icon: '\u2196' },
    { id: 'x5',    name: 'Exactly-K Trick',       volume: 1, icon: '\u2796' },
    { id: 'x7',    name: 'Reversals',             volume: 1, icon: '\u27f3' },
    { id: 'x8',    name: 'Prefix + Hash',         volume: 1, icon: '\u2699' }
  ];

  const TIERS = [
    { suffix: 'easy',   diff: 1, enemy: 'bot',   questions: 5, reward: { xp: 50,  coins: 20  }, label: 'Easy' },
    { suffix: 'medium', diff: 2, enemy: 'bot',   questions: 6, reward: { xp: 80,  coins: 30  }, label: 'Medium' },
    { suffix: 'hard',   diff: 3, enemy: 'ghost', questions: 7, reward: { xp: 120, coins: 45  }, label: 'Hard' },
    { suffix: 'boss',   diff: 3, enemy: 'boss',  questions: 8, reward: { xp: 200, coins: 100 }, label: 'Boss' }
  ];

  const VOLUME_NAMES = {
    1: 'Arrays & Strings',
    2: 'Binary Search & Ranges',
    3: 'Hash, Stack, Heap',
    4: 'Linked Lists, Trees & Tries',
    5: 'Graphs & Grids',
    6: 'Dynamic Programming',
    7: 'Recursion, Greedy, Bits & Math'
  };

  function getPattern(id) {
    return PATTERNS.find(p => p.id === id) || PATTERNS[0];
  }

  function getTier(suffix) {
    return TIERS.find(t => t.suffix === suffix) || TIERS[0];
  }

  function getAllPatterns() {
    return [...PATTERNS];
  }

  function getAllTiers() {
    return [...TIERS];
  }

  function getVolumeName(volume) {
    return VOLUME_NAMES[volume] || 'Unknown Volume';
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function makeLevelId(patternId, tierSuffix) {
    return `${patternId}-${tierSuffix}`;
  }

  function getTierIcon(tierSuffix) {
    if (tierSuffix === 'boss') return '\ud83d\udc09';
    if (tierSuffix === 'hard') return '\u2694\ufe0f';
    if (tierSuffix === 'medium') return '\ud83c\udfaf';
    return '\u25b6';
  }

  function getTierEnemyIcon(enemy) {
    return { bot: '\ud83d\udc7e', ghost: '\ud83d\udc7b', boss: '\ud83d\udc09' }[enemy] || '\ud83d\udc7e';
  }

  return {
    PATTERNS,
    TIERS,
    VOLUME_NAMES,
    getPattern,
    getTier,
    getAllPatterns,
    getAllTiers,
    getVolumeName,
    capitalize,
    makeLevelId,
    getTierIcon,
    getTierEnemyIcon
  };
})();
