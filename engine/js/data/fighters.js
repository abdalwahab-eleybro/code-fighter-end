/**
 * Fighters Data Module
 * Contains all fighter definitions and related data
 */

window.CF = window.CF || {};

CF.Fighters = (function() {
  const FIGHTERS = [
    { id: 'ninja',   name: 'Ninja',   icon: '\ud83e\udd77', unlockLevel: 1  },
    { id: 'monk',    name: 'Monk',    icon: '\ud83e\uddd8', unlockLevel: 3  },
    { id: 'ronin',   name: 'Ronin',   icon: '\u2694\ufe0f', unlockLevel: 5  },
    { id: 'mage',    name: 'Mage',    icon: '\ud83e\uddd9', unlockLevel: 8  },
    { id: 'dragon',  name: 'Dragon',  icon: '\ud83d\udc09', unlockLevel: 12 },
    { id: 'phoenix', name: 'Phoenix', icon: '\ud83d\udd25', unlockLevel: 18 },
    { id: 'void',    name: 'Void',    icon: '\ud83c\udf0c', unlockLevel: 25 }
  ];

  const ARCHETYPES = {
    bot: { name: 'Bot', icon: '\ud83d\udc7e', color: '--enemy' },
    ghost: { name: 'Ghost', icon: '\ud83d\udc7b', color: '#a5f3fc' },
    tank: { name: 'Tank', icon: '\ud83e\udd77', color: '#94a3b8' },
    berserker: { name: 'Berserker', icon: '\ud83e\udd77', color: '#f97316' },
    sorcerer: { name: 'Sorcerer', icon: '\ud83e\uddd9', color: '#a855f7' },
    boss: { name: 'Boss', icon: '\ud83d\udc09', color: '#f43f5e' }
  };

  function getFighter(id) {
    return FIGHTERS.find(f => f.id === id) || FIGHTERS[0];
  }

  function getAllFighters() {
    return [...FIGHTERS];
  }

  function getArchetype(id) {
    return ARCHETYPES[id] || ARCHETYPES.bot;
  }

  function getAllArchetypes() {
    return { ...ARCHETYPES };
  }

  return {
    FIGHTERS,
    ARCHETYPES,
    getFighter,
    getAllFighters,
    getArchetype,
    getAllArchetypes
  };
})();
