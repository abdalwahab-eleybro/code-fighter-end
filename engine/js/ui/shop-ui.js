/**
 * Shop UI Module
 * Renders the shop screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.ShopUI = (() => {
  const S = CF.State;
  const Components = CF.UI.Components;

  /* Shop items */
  const SHOP_ITEMS = [
    {
      id: 'fighter-ninja',
      name: 'Ninja',
      icon: '\ud83e\udd77',
      desc: 'Your starting fighter',
      cost: 0,
      owned: true,
      type: 'fighter',
      value: 'ninja'
    },
    {
      id: 'fighter-monk',
      name: 'Monk',
      icon: '\ud83e\uddd8',
      desc: 'Unlocked at Level 3',
      cost: 0,
      owned: false,
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
      owned: false,
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
      owned: false,
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
      owned: false,
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
      owned: false,
      type: 'upgrade',
      value: 'maxHP'
    },
    {
      id: 'upgrade-damage',
      name: 'Base Damage +5',
      icon: '\u2694',
      desc: 'Increase base damage by 5',
      cost: 75,
      owned: false,
      type: 'upgrade',
      value: 'baseDamage'
    },
    {
      id: 'upgrade-hints',
      name: 'Free Hints +1',
      icon: '\ud83d\udca1',
      desc: 'Get one free hint per fight',
      cost: 100,
      owned: false,
      type: 'upgrade',
      value: 'freeHints'
    },
    {
      id: 'upgrade-rerolls',
      name: 'Rerolls +1',
      icon: '\ud83c\udf00',
      desc: 'Get one reroll per fight',
      cost: 150,
      owned: false,
      type: 'upgrade',
      value: 'rerolls'
    }
  ];

  /* Render the shop */
  function render() {
    const shopContent = document.getElementById('shopContent');
    if (!shopContent) return;
    
    shopContent.innerHTML = '';
    
    // Header
    const header = Components.createElement('div', { className: 'shop-header' });
    
    const backBtn = Components.createButton('\u2190 Menu', {
      className: 'back-btn',
      onClick: () => CF.UI.Navigation.showMenu()
    });
    header.appendChild(backBtn);
    
    // Wallet
    const wallet = Components.createElement('div', {
      className: 'shop-wallet',
      children: [
        Components.createIcon('\ud83d\udcb0'),
        Components.createElement('span', { text: S.profile.coins })
      ]
    });
    header.appendChild(wallet);
    
    shopContent.appendChild(header);
    
    // Title
    shopContent.appendChild(Components.createElement('div', {
      className: 'map-title',
      text: 'Shop'
    }));
    
    // Grid
    const grid = Components.createElement('div', { className: 'shop-grid' });
    
    // Render items
    SHOP_ITEMS.forEach(item => {
      const card = createShopCard(item);
      grid.appendChild(card);
    });
    
    shopContent.appendChild(grid);
  }

  /* Create shop card */
  function createShopCard(item) {
    const isOwned = checkIfOwned(item);
    const canAfford = S.profile.coins >= item.cost;
    const isUnlocked = checkIfUnlocked(item);
    
    const card = Components.createElement('div', {
      className: `shop-card ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'unaffordable' : ''}`
    });
    
    // Icon
    card.appendChild(Components.createElement('div', {
      className: 'shop-icon',
      html: item.icon
    }));
    
    // Body
    const body = Components.createElement('div', { className: 'shop-body' });
    
    // Name
    const nameRow = Components.createElement('div', { className: 'shop-name' });
    nameRow.appendChild(Components.createElement('span', { text: item.name }));
    
    if (isOwned && item.type === 'fighter') {
      const fighter = S.getFighter(item.value);
      if (fighter.id === S.profile.equippedFighter) {
        nameRow.appendChild(Components.createElement('span', {
          className: 'shop-owned',
          text: 'EQUIPPED'
        }));
      } else {
        nameRow.appendChild(Components.createElement('button', {
          className: 'shop-owned',
          text: 'EQUIP',
          onClick: (e) => {
            e.stopPropagation();
            S.equipFighter(item.value);
            render();
          }
        }));
      }
    } else if (isOwned) {
      nameRow.appendChild(Components.createElement('span', {
        className: 'shop-owned',
        text: 'OWNED'
      }));
    }
    
    body.appendChild(nameRow);
    
    // Description
    body.appendChild(Components.createElement('div', {
      className: 'shop-desc',
      text: item.desc
    }));
    
    card.appendChild(body);
    
    // Action
    const action = Components.createElement('div', { className: 'shop-action' });
    
    if (isOwned) {
      action.appendChild(Components.createElement('div', {
        className: 'owned-text',
        text: 'Owned'
      }));
    } else if (!isUnlocked) {
      action.appendChild(Components.createElement('div', {
        className: 'owned-text',
        text: `Lvl ${item.unlockLevel}`
      }));
    } else if (canAfford) {
      const buyBtn = Components.createButton('BUY', {
        className: 'shop-buy',
        onClick: () => {
          purchaseItem(item);
        },
        children: [
          Components.createIcon('\ud83d\udcb0', 'cost-icon'),
          Components.createElement('span', { text: item.cost })
        ]
      });
      action.appendChild(buyBtn);
    } else {
      const buyBtn = Components.createButton('BUY', {
        className: 'shop-buy',
        disabled: true,
        children: [
          Components.createIcon('\ud83d\udcb0', 'cost-icon'),
          Components.createElement('span', { text: item.cost })
        ]
      });
      action.appendChild(buyBtn);
    }
    
    card.appendChild(action);
    
    return card;
  }

  /* Check if item is owned */
  function checkIfOwned(item) {
    if (item.type === 'fighter') {
      return S.profile.unlockedFighters.includes(item.value);
    }
    return false;
  }

  /* Check if item is unlocked */
  function checkIfUnlocked(item) {
    if (item.unlockLevel) {
      return S.profile.playerLevel >= item.unlockLevel;
    }
    return true;
  }

  /* Purchase an item */
  function purchaseItem(item) {
    if (S.profile.coins < item.cost) {
      showToast('Not enough coins!', true);
      return;
    }
    
    // Deduct coins
    S.addCoins(-item.cost);
    
    // Mark as owned
    if (item.type === 'upgrade') {
      S.profile.upgrades[item.value] = (S.profile.upgrades[item.value] || 0) + 1;
    }
    
    S.save();
    
    // Show success
    showToast('Purchase successful!');
    
    // Refresh
    render();
  }

  /* Show toast message */
  function showToast(message, isError = false) {
    let toast = document.querySelector('.shop-toast');
    
    if (!toast) {
      toast = Components.createElement('div', {
        className: `shop-toast ${isError ? 'error' : ''}`
      });
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.remove('show');
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  /* Public API */
  return {
    render
  };
})();
