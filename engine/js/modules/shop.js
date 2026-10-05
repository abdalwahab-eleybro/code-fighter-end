/**
 * Shop Module
 * Shop functionality and item management
 */

window.CF = window.CF || {};

CF.Shop = (() => {
  const S = CF.State;

  /* Shop items */
  const SHOP_ITEMS = [
    {
      id: 'fighter-ninja',
      name: 'Ninja',
      icon: '\ud83e\udd77',
      desc: 'Your starting fighter',
      cost: 0,
      type: 'fighter',
      value: 'ninja'
    },
    {
      id: 'fighter-monk',
      name: 'Monk',
      icon: '\ud83e\uddd8',
      desc: 'Unlocked at Level 3',
      cost: 0,
      type: 'fighter',
      value: 'monk',
      unlockLevel: 3
    },
    {
      id: 'fighter-ronin',
      name: 'Ronin',
      icon: '\u2694\ufe0f',
      desc: 'Unlocked at Level 5',
      cost: 0,
      type: 'fighter',
      value: 'ronin',
      unlockLevel: 5
    },
    {
      id: 'fighter-mage',
      name: 'Mage',
      icon: '\ud83e\uddd9',
      desc: 'Unlocked at Level 8',
      cost: 0,
      type: 'fighter',
      value: 'mage',
      unlockLevel: 8
    },
    {
      id: 'fighter-dragon',
      name: 'Dragon',
      icon: '\ud83d\udc09',
      desc: 'Unlocked at Level 12',
      cost: 0,
      type: 'fighter',
      value: 'dragon',
      unlockLevel: 12
    },
    {
      id: 'upgrade-maxhp',
      name: 'Max HP +10',
      icon: '\u2665',
      desc: 'Increase maximum health by 10',
      cost: 50,
      type: 'upgrade',
      value: 'maxHP'
    },
    {
      id: 'upgrade-damage',
      name: 'Base Damage +5',
      icon: '\u2694',
      desc: 'Increase base damage by 5',
      cost: 75,
      type: 'upgrade',
      value: 'baseDamage'
    },
    {
      id: 'upgrade-hints',
      name: 'Free Hints +1',
      icon: '\ud83d\udca1',
      desc: 'Get one free hint per fight',
      cost: 100,
      type: 'upgrade',
      value: 'freeHints'
    },
    {
      id: 'upgrade-rerolls',
      name: 'Rerolls +1',
      icon: '\ud83c\udf00',
      desc: 'Get one reroll per fight',
      cost: 150,
      type: 'upgrade',
      value: 'rerolls'
    }
  ];

  /* Get all shop items */
  function getAllItems() {
    return [...SHOP_ITEMS];
  }

  /* Get item by ID */
  function getItem(id) {
    return SHOP_ITEMS.find(item => item.id === id);
  }

  /* Check if item is owned */
  function isOwned(itemId) {
    const item = getItem(itemId);
    if (!item) return false;
    
    if (item.type === 'fighter') {
      return S.profile.unlockedFighters.includes(item.value);
    }
    
    return false;
  }

  /* Check if item is unlocked */
  function isUnlocked(itemId) {
    const item = getItem(itemId);
    if (!item) return false;
    
    if (item.unlockLevel) {
      return S.profile.playerLevel >= item.unlockLevel;
    }
    
    return true;
  }

  /* Check if item can be purchased */
  function canPurchase(itemId) {
    const item = getItem(itemId);
    if (!item) return false;
    
    if (isOwned(itemId)) return false;
    if (!isUnlocked(itemId)) return false;
    if (S.profile.coins < item.cost) return false;
    
    return true;
  }

  /* Purchase an item */
  function purchaseItem(itemId) {
    const item = getItem(itemId);
    if (!item) return false;
    
    if (!canPurchase(itemId)) return false;
    
    // Deduct coins
    S.addCoins(-item.cost);
    
    // Mark as owned
    if (item.type === 'upgrade') {
      S.profile.upgrades[item.value] = (S.profile.upgrades[item.value] || 0) + 1;
    }
    
    S.save();
    return true;
  }

  /* Get upgrade level */
  function getUpgradeLevel(upgradeType) {
    return S.profile.upgrades[upgradeType] || 0;
  }

  /* Public API */
  return {
    getAllItems,
    getItem,
    isOwned,
    isUnlocked,
    canPurchase,
    purchaseItem,
    getUpgradeLevel
  };
})();
