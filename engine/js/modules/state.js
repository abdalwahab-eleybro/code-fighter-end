/**
 * State Module
 * Persistent profile, session, and campaign data management
 * No dependencies. Load before everything else.
 */

window.CF = window.CF || {};

CF.State = (function() {
  const STORAGE_KEY = 'codefighter_profile_v1';
  const SCHEMA_VERSION = 1;

  /* Default profile structure */
  function defaultProfile() {
    return {
      version: SCHEMA_VERSION,
      xp: 0,
      playerLevel: 1,
      coins: 50,
      unlockedFighters: ['ninja'],
      equippedFighter: 'ninja',
      achievements: {},
      campaignLevels: {},
      currentCampaignLevel: 'p1-easy',
      questionHistory: {},
      patternStats: {},
      streak: { current: 0, best: 0, lastPlayedDate: null, freezesLeft: 1 },
      upgrades: { maxHP: 0, baseDamage: 0, freeHints: 0, comboShield: false, rerolls: 0 },
      settings: { musicVolume: 0.4, sfxVolume: 0.7 }
    };
  }

  /* Load profile from localStorage */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== SCHEMA_VERSION) return migrate(parsed);
      return parsed;
    } catch (e) {
      console.warn('Profile load failed:', e);
      return null;
    }
  }

  /* Migrate old profile data */
  function migrate(old) {
    return { ...defaultProfile(), ...old, version: SCHEMA_VERSION };
  }

  /* Save profile to localStorage */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Profile save failed:', e);
    }
  }

  /* State objects */
  const profile = load() || defaultProfile();

  const session = {
    mode: 'campaign',
    campaignLevel: null,
    enemyArchetype: 'bot',
    questionsRemaining: 0,
    combo: 0,
    correct: 0,
    answered: 0,
    hintsUsed: 0,
    perfectAnswers: 0,
    maxCombo: 0,
    playerHP: 100,
    enemyHP: 100,
    enemyMaxHP: 100,
    roundLog: [],
    questionStartTime: 0
  };

  /* Reset session with optional overrides */
  function resetSession(overrides = {}) {
    Object.assign(session, {
      mode: 'campaign',
      campaignLevel: null,
      enemyArchetype: 'bot',
      questionsRemaining: 0,
      combo: 0,
      correct: 0,
      answered: 0,
      hintsUsed: 0,
      perfectAnswers: 0,
      maxCombo: 0,
      playerHP: 100,
      enemyHP: 100,
      enemyMaxHP: 100,
      roundLog: [],
      questionStartTime: 0
    }, overrides);
  }

  /* Reset entire profile */
  function resetProfile() {
    Object.assign(profile, defaultProfile());
    save();
  }

  /* XP and Level Management */
  function xpForLevel(level) {
    if (level <= 1) return 0;
    return Math.round(100 * Math.pow(level - 1, 1.4));
  }

  function addXP(amount) {
    profile.xp += amount;
    let leveledUp = false;
    while (profile.xp >= xpForLevel(profile.playerLevel + 1)) {
      profile.playerLevel++;
      leveledUp = true;
      // Unlock fighters at level thresholds
      if (window.CF && window.CF.Fighters) {
        window.CF.Fighters.FIGHTERS.forEach(f => {
          if (f.unlockLevel === profile.playerLevel && !profile.unlockedFighters.includes(f.id)) {
            profile.unlockedFighters.push(f.id);
          }
        });
      }
    }
    save();
    return leveledUp;
  }

  function addCoins(amount) {
    profile.coins += amount;
    save();
  }

  /* Fighter Management */
  function getFighter(id) {
    if (window.CF && window.CF.Fighters) {
      return window.CF.Fighters.getFighter(id);
    }
    return { id: id, name: id, icon: '\ud83e\udd77' };
  }

  function equipFighter(id) {
    if (!profile.unlockedFighters.includes(id)) return false;
    profile.equippedFighter = id;
    save();
    return true;
  }

  /* Campaign Management */
  function isLevelUnlocked(levelId) {
    if (window.CF && window.CF.Campaign) {
      const idx = window.CF.Campaign.levels.findIndex(l => l.id === levelId);
      if (idx <= 0) return true;
      const prev = window.CF.Campaign.levels[idx - 1];
      return !!(profile.campaignLevels[prev.id]?.cleared);
    }
    return true;
  }

  function completeCampaignLevel(levelId, stars) {
    const prev = profile.campaignLevels[levelId] || { stars: 0 };
    profile.campaignLevels[levelId] = {
      cleared: true,
      stars: Math.max(prev.stars || 0, stars),
      bestTime: prev.bestTime || 0
    };
    save();
  }

  /* Streak Management */
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function checkAndUpdateStreak() {
    const today = todayISO();
    const last = profile.streak.lastPlayedDate;
    if (last === today) return false;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === yesterday) {
      profile.streak.current++;
    } else if (profile.streak.freezesLeft > 0 && last) {
      profile.streak.freezesLeft--;
      profile.streak.current++;
    } else {
      profile.streak.current = 1;
    }
    if (profile.streak.current > profile.streak.best) {
      profile.streak.best = profile.streak.current;
    }
    profile.streak.lastPlayedDate = today;
    save();
    return true;
  }

  /* Public API */
  return {
    profile,
    session,
    resetSession,
    resetProfile,
    save,
    addXP,
    addCoins,
    xpForLevel,
    getFighter,
    equipFighter,
    isLevelUnlocked,
    completeCampaignLevel,
    checkAndUpdateStreak
  };
})();
