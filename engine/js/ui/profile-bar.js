/**
 * Profile Bar UI Module
 * Renders and updates the profile bar
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.ProfileBar = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Components = CF.UI.Components;

  /* Render profile bar */
  function render() {
    const profileBar = document.getElementById('profileBar');
    if (!profileBar) return;
    
    // Clear existing content
    profileBar.innerHTML = '';
    
    // Fighter icon
    const fighter = S.getFighter(S.profile.equippedFighter);
    profileBar.appendChild(Components.createElement('div', {
      className: 'prof-fighter',
      html: fighter.icon
    }));
    
    // XP
    profileBar.appendChild(Components.createElement('div', {
      className: 'prof-item',
      children: [
        Components.createIcon('&#9733;'),
        Components.createElement('span', {
          className: 'val',
          text: S.profile.playerLevel
        }),
        Components.createElement('span', {
          className: 'lbl',
          text: 'LVL'
        })
      ]
    }));
    
    // Coins
    profileBar.appendChild(Components.createElement('div', {
      className: 'prof-item',
      children: [
        Components.createIcon('&#128176;'),
        Components.createElement('span', {
          className: 'val',
          text: S.profile.coins
        }),
        Components.createElement('span', {
          className: 'lbl',
          text: 'COINS'
        })
      ]
    }));
    
    // XP Bar
    const xpBar = Components.createElement('div', { className: 'xp-bar' });
    const xpFill = Components.createElement('div', { className: 'xp-fill' });
    
    const currentXP = S.profile.xp;
    const nextLevelXP = S.xpForLevel(S.profile.playerLevel + 1);
    const prevLevelXP = S.xpForLevel(S.profile.playerLevel);
    const xpPercent = nextLevelXP > 0 ? 
      ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 100;
    
    xpFill.style.width = `${xpPercent}%`;
    xpBar.appendChild(xpFill);
    profileBar.appendChild(xpBar);
    
    // Spacer
    profileBar.appendChild(Components.createElement('div', { className: 'prof-spacer' }));
    
    // Stats
    const progress = C.getProgressSummary();
    
    profileBar.appendChild(Components.createElement('div', {
      className: 'prof-item',
      children: [
        Components.createIcon('&#9733;'),
        Components.createElement('span', {
          className: 'val',
          text: progress.cleared
        }),
        Components.createElement('span', {
          className: 'lbl',
          text: 'CLEARED'
        })
      ]
    }));
    
    profileBar.appendChild(Components.createElement('div', {
      className: 'prof-item',
      children: [
        Components.createIcon('&#127935;'),
        Components.createElement('span', {
          className: 'val',
          text: progress.totalStars
        }),
        Components.createElement('span', {
          className: 'lbl',
          text: 'STARS'
        })
      ]
    }));
  }

  /* Update profile bar */
  function update() {
    render();
  }

  /* Public API */
  return {
    render,
    update
  };
})();
