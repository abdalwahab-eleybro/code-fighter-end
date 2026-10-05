/**
 * Campaign Module
 * Campaign data and logic for level progression
 * Depends on: state.js, patterns.js
 */

window.CF = window.CF || {};

CF.Campaign = (() => {
  const S = CF.State;
  const P = CF.Patterns;

  /* Generate all levels from patterns and tiers */
  const levels = [];
  P.PATTERNS.forEach((p, i) => {
    P.TIERS.forEach((t, j) => {
      levels.push({
        id: P.makeLevelId(p.id, t.suffix),
        pattern: p.id,
        patternName: p.name,
        volume: p.volume,
        name: `${p.name}  ${P.capitalize(t.suffix)}`,
        tier: t.suffix,
        diff: t.diff,
        enemy: t.enemy,
        questions: t.questions,
        reward: t.reward,
        order: i * 4 + j
      });
    });
  });

  /* Star calculation */
  function calcStars(won, accuracy) {
    if (!won) return 0;
    if (accuracy >= 1.0) return 3;
    if (accuracy >= 0.8) return 2;
    return 1;
  }

  /* Level lookup */
  function getLevel(levelId) {
    return levels.find(l => l.id === levelId);
  }

  function getLevelIndex(levelId) {
    return levels.findIndex(l => l.id === levelId);
  }

  function getNextLevel(levelId) {
    const idx = getLevelIndex(levelId);
    if (idx < 0 || idx >= levels.length - 1) return null;
    return levels[idx + 1];
  }

  function getPrevLevel(levelId) {
    const idx = getLevelIndex(levelId);
    if (idx <= 0) return null;
    return levels[idx - 1];
  }

  /* Unlock reasoning */
  function lockedReason(levelId) {
    if (S.isLevelUnlocked(levelId)) return null;
    const prev = getPrevLevel(levelId);
    if (!prev) return null;
    return `Clear "${prev.name}" first`;
  }

  /* Complete a fight */
  function completeFight(levelId, won, session, elapsedMs) {
    const lvl = getLevel(levelId);
    if (!lvl) return { stars: 0, xpGained: 0, coinsGained: 0, unlocks: [] };

    const accuracy = session.answered > 0 ? session.correct / session.answered : 0;
    const stars = calcStars(won, accuracy);

    const result = {
      stars,
      xpGained: 0,
      coinsGained: 0,
      unlockedFighters: [],
      newBest: false,
      newBestTime: false
    };

    if (!won) return result;

    // Base rewards
    let xp = lvl.reward.xp;
    let coins = lvl.reward.coins;

    // Accuracy bonus: +2% XP per % above 60%
    if (accuracy > 0.6) xp = Math.round(xp * (1 + (accuracy - 0.6) * 0.05));

    // Perfect answers bonus
    xp += session.perfectAnswers * 5;

    // Star bonus: 3 = +20% XP, 2 = +10%
    if (stars === 3) xp = Math.round(xp * 1.2);
    else if (stars === 2) xp = Math.round(xp * 1.1);

    // Boss bonus
    if (lvl.tier === 'boss') xp += 100;

    // Update campaign record
    const prevRecord = S.profile.campaignLevels[levelId] || { stars: 0, bestTime: 0 };
    const prevStars = prevRecord.stars || 0;
    const prevBestTime = prevRecord.bestTime || 0;

    // Only award full XP/coins on first clear OR when beating best stars
    const firstClear = !prevRecord.cleared;
    const improved = stars > prevStars;

    if (firstClear || improved) {
      result.xpGained = xp;
      result.coinsGained = coins;
      const leveledUp = S.addXP(xp);
      S.addCoins(coins);
      if (leveledUp) {
        result.unlockedFighters = S.profile.unlockedFighters.filter(id =>
          !S.profile.unlockedFighters.includes(id)
        );
      }
    } else {
      // Repeat clear: 25% XP, no coins
      result.xpGained = Math.round(xp * 0.25);
      S.addXP(result.xpGained);
    }

    // Track best time
    if (!prevBestTime || elapsedMs < prevBestTime) {
      result.newBestTime = true;
      result.newBest = true;
    }

    // Persist
    S.profile.campaignLevels[levelId] = {
      cleared: true,
      stars: Math.max(prevStars, stars),
      bestTime: result.newBestTime ? elapsedMs : prevBestTime
    };
    S.save();

    return result;
  }

  /* Volume preview */
  function getFutureVolumes() {
    return [
      { num: 2, name: 'Binary Search & Ranges', icon: '\ud83c\udfaf', patterns: 'Binary Search  Rotated Search  Merge Intervals  Matrix Traversal', eta: 'Planned' },
      { num: 3, name: 'Hash, Stack, Heap', icon: '\ud83d\udcda', patterns: 'Hash Lookup  Monotonic Stack  Top-K Heap  Two Heaps', eta: 'Planned' },
      { num: 4, name: 'Linked Lists, Trees & Tries', icon: '\ud83c\udf33', patterns: 'Fast/Slow  In-Place Reversal  Tree DFS/BFS  Trie  Segment Tree', eta: 'Planned' },
      { num: 5, name: 'Graphs & Grids', icon: '\ud83d\udd78\ufe0f', patterns: 'Graph BFS/DFS  Topological Sort  Union-Find  Dijkstra', eta: 'Planned' },
      { num: 6, name: 'Dynamic Programming', icon: '\ud83e\uddee', patterns: '1D/2D DP  Knapsack  LIS  LCS  Interval DP', eta: 'Planned' },
      { num: 7, name: 'Recursion, Greedy, Bits & Math', icon: '\ud83e\udde0', patterns: 'Subsets  Backtracking  Greedy  XOR Tricks  Number Theory', eta: 'Planned' }
    ];
  }

  /* Format time */
  function formatTime(ms) {
    if (!ms) return '\u2014';
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : `${s}s`;
  }

  /* Progress stats */
  function getProgressSummary() {
    const total = levels.length;
    const cleared = Object.values(S.profile.campaignLevels).filter(l => l.cleared).length;
    const totalStars = Object.values(S.profile.campaignLevels).reduce((sum, l) => sum + (l.stars || 0), 0);
    const maxStars = total * 3;
    return { total, cleared, totalStars, maxStars, percent: Math.round((cleared / total) * 100) };
  }

  /* Next suggested level */
  function getNextSuggestedLevel() {
    for (const lvl of levels) {
      if (!S.profile.campaignLevels[lvl.id]?.cleared && S.isLevelUnlocked(lvl.id)) {
        return lvl;
      }
    }
    return null;
  }

  /* Tier icons */
  function tierIcon(tier, cleared, unlocked) {
    if (cleared) return '\u2713';
    if (!unlocked) return '\ud83d\udd12';
    return P.getTierIcon(tier);
  }

  /* Public API */
  return {
    levels,
    volumeNames: P.VOLUME_NAMES,
    calcStars,
    getLevel,
    getNextLevel,
    getPrevLevel,
    lockedReason,
    completeFight,
    getFutureVolumes,
    tierIcon,
    tierEnemyIcon: P.getTierEnemyIcon,
    formatTime,
    getProgressSummary,
    getNextSuggestedLevel
  };
})();
