/**
 * State Module
 * Persistent profile, session, and campaign data management
 * No dependencies. Load before everything else.
 */

window.CF = window.CF || {};

CF.State = (function() {
  var STORAGE_KEY = 'codefighter_profile_v1';
  var SCHEMA_VERSION = 1;

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
      campaignLevels: {},          // { levelId: { cleared, stars, bestTime } }
      currentCampaignLevel: 'p1-easy',
      questionHistory: {},         // reserved for spaced repetition
      patternStats: {},            // reserved for weak-spot recommender
      streak: { current: 0, best: 0, lastPlayedDate: null, freezesLeft: 1 },
      upgrades: { maxHP: 0, baseDamage: 0, freeHints: 0, comboShield: false, rerolls: 0 },
      settings: { musicVolume: 0.4, sfxVolume: 0.7 }
    };
  }

  /* Load profile from localStorage */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed.version !== SCHEMA_VERSION) return migrate(parsed);
      return parsed;
    } catch (e) {
      console.warn('Profile load failed:', e);
      return null;
    }
  }

  /* Migrate old profile data */
  function migrate(old) {
    // Future schema upgrades land here
    var result = defaultProfile();
    for (var key in old) {
      result[key] = old[key];
    }
    result.version = SCHEMA_VERSION;
    return result;
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
  var profile = load() || defaultProfile();

  var session = {
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
  function resetSession(overrides) {
    overrides = overrides || {};
    session.mode = 'campaign';
    session.campaignLevel = null;
    session.enemyArchetype = 'bot';
    session.questionsRemaining = 0;
    session.combo = 0;
    session.correct = 0;
    session.answered = 0;
    session.hintsUsed = 0;
    session.perfectAnswers = 0;
    session.maxCombo = 0;
    session.playerHP = 100;
    session.enemyHP = 100;
    session.enemyMaxHP = 100;
    session.roundLog = [];
    session.questionStartTime = 0;
    for (var key in overrides) {
      session[key] = overrides[key];
    }
  }

  /* Reset entire profile */
  function resetProfile() {
    profile = defaultProfile();
    save();
  }

  /* XP and Level Management */
  function xpForLevel(level) {
    if (level <= 1) return 0;
    return Math.round(100 * Math.pow(level - 1, 1.4));
  }

  function addXP(amount) {
    profile.xp += amount;
    var leveledUp = false;
    while (profile.xp >= xpForLevel(profile.playerLevel + 1)) {
      profile.playerLevel++;
      leveledUp = true;
      // Unlock fighters at level thresholds
      if (window.CF && window.CF.Fighters && window.CF.Fighters.FIGHTERS) {
        for (var i = 0; i < window.CF.Fighters.FIGHTERS.length; i++) {
          var f = window.CF.Fighters.FIGHTERS[i];
          if (f.unlockLevel === profile.playerLevel && !contains(profile.unlockedFighters, f.id)) {
            profile.unlockedFighters.push(f.id);
          }
        }
      }
    }
    save();
    return leveledUp;
  }

  function contains(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) return true;
    }
    return false;
  }

  function addCoins(amount) {
    profile.coins += amount;
    save();
  }

  /* Fighter Management */
  function getFighter(id) {
    if (window.CF && window.CF.Fighters && window.CF.Fighters.getFighter) {
      return window.CF.Fighters.getFighter(id);
    }
    return { id: id, name: id, icon: '\ud83e\udd77' };
  }

  function equipFighter(id) {
    if (!contains(profile.unlockedFighters, id)) return false;
    profile.equippedFighter = id;
    save();
    return true;
  }

  /* Campaign Management */
  function isLevelUnlocked(levelId) {
    if (window.CF && window.CF.Campaign && window.CF.Campaign.levels) {
      var idx = -1;
      for (var i = 0; i < window.CF.Campaign.levels.length; i++) {
        if (window.CF.Campaign.levels[i].id === levelId) {
          idx = i;
          break;
        }
      }
      if (idx <= 0) return true;   // first level always unlocked
      var prev = window.CF.Campaign.levels[idx - 1];
      return !!(profile.campaignLevels[prev.id] && profile.campaignLevels[prev.id].cleared);
    }
    return true;
  }

  function completeCampaignLevel(levelId, stars) {
    var prev = profile.campaignLevels[levelId] || { stars: 0 };
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
    var today = todayISO();
    var last = profile.streak.lastPlayedDate;
    if (last === today) return false;   // already counted today

    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
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
    profile: profile,
    session: session,
    resetSession: resetSession,
    resetProfile: resetProfile,
    save: save,
    addXP: addXP,
    addCoins: addCoins,
    xpForLevel: xpForLevel,
    getFighter: getFighter,
    equipFighter: equipFighter,
    isLevelUnlocked: isLevelUnlocked,
    completeCampaignLevel: completeCampaignLevel,
    checkAndUpdateStreak: checkAndUpdateStreak
  };
})();
