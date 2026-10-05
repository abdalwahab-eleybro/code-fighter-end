/**
 * Settings UI Module
 * Renders the settings screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.SettingsUI = (() => {
  const S = CF.State;
  const Components = CF.UI.Components;

  /* Render the settings screen */
  function render() {
    const settingsContent = document.getElementById('settingsContent');
    if (!settingsContent) return;
    
    settingsContent.innerHTML = '';
    
    // Header
    const header = Components.createElement('div', { className: 'shop-header' });
    
    const backBtn = Components.createButton('\u2190 Menu', {
      className: 'back-btn',
      onClick: () => CF.UI.Navigation.showMenu()
    });
    header.appendChild(backBtn);
    
    settingsContent.appendChild(header);
    
    // Title
    settingsContent.appendChild(Components.createElement('div', {
      className: 'map-title',
      text: 'Settings'
    }));
    
    // Audio section
    const audioSection = Components.createElement('div', { className: 'settings-section' });
    audioSection.appendChild(Components.createElement('div', {
      className: 'settings-title',
      text: 'Audio'
    }));
    
    // Music volume
    const musicRow = Components.createElement('div', { className: 'settings-row' });
    musicRow.appendChild(Components.createElement('label', { text: 'Music' }));
    
    const musicSlider = Components.createElement('input', {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: S.profile.settings.musicVolume
    });
    musicSlider.addEventListener('input', (e) => {
      S.profile.settings.musicVolume = parseFloat(e.target.value);
      S.save();
    });
    
    musicRow.appendChild(musicSlider);
    musicRow.appendChild(Components.createElement('div', {
      className: 'settings-val',
      text: Math.round(S.profile.settings.musicVolume * 100)
    }));
    
    audioSection.appendChild(musicRow);
    
    // SFX volume
    const sfxRow = Components.createElement('div', { className: 'settings-row' });
    sfxRow.appendChild(Components.createElement('label', { text: 'SFX' }));
    
    const sfxSlider = Components.createElement('input', {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: S.profile.settings.sfxVolume
    });
    sfxSlider.addEventListener('input', (e) => {
      S.profile.settings.sfxVolume = parseFloat(e.target.value);
      S.save();
    });
    
    sfxRow.appendChild(sfxSlider);
    sfxRow.appendChild(Components.createElement('div', {
      className: 'settings-val',
      text: Math.round(S.profile.settings.sfxVolume * 100)
    }));
    
    audioSection.appendChild(sfxRow);
    settingsContent.appendChild(audioSection);
    
    // Stats section
    const statsSection = Components.createElement('div', { className: 'settings-section' });
    statsSection.appendChild(Components.createElement('div', {
      className: 'settings-title',
      text: 'Stats'
    }));
    
    const statsGrid = Components.createElement('div', { className: 'settings-stats' });
    
    // Level
    statsGrid.appendChild(createStatCell(S.profile.playerLevel, 'LEVEL'));
    
    // XP
    statsGrid.appendChild(createStatCell(S.profile.xp, 'XP'));
    
    // Coins
    statsGrid.appendChild(createStatCell(S.profile.coins, 'COINS'));
    
    // Streak
    statsGrid.appendChild(createStatCell(S.profile.streak.current, 'STREAK'));
    
    statsSection.appendChild(statsGrid);
    settingsContent.appendChild(statsSection);
    
    // Profile section
    const profileSection = Components.createElement('div', { className: 'settings-section' });
    profileSection.appendChild(Components.createElement('div', {
      className: 'settings-title',
      text: 'Profile'
    }));
    
    // Fighter selection
    const fighterRow = Components.createElement('div', { className: 'settings-row' });
    fighterRow.appendChild(Components.createElement('label', { text: 'Fighter' }));
    
    const fighterSelect = Components.createElement('select', {
      className: 'lsn-select',
      onChange: (e) => {
        S.equipFighter(e.target.value);
        S.save();
      }
    });
    
    S.profile.unlockedFighters.forEach(fighterId => {
      const fighter = S.getFighter(fighterId);
      const option = Components.createElement('option', {
        value: fighterId,
        text: `${fighter.icon} ${fighter.name}`,
        selected: fighterId === S.profile.equippedFighter
      });
      fighterSelect.appendChild(option);
    });
    
    fighterRow.appendChild(fighterSelect);
    profileSection.appendChild(fighterRow);
    
    settingsContent.appendChild(profileSection);
    
    // Actions section
    const actionsSection = Components.createElement('div', { className: 'settings-section' });
    actionsSection.appendChild(Components.createElement('div', {
      className: 'settings-title',
      text: 'Actions'
    }));
    
    // Reset profile
    const resetBtn = Components.createButton('Reset Profile', {
      className: 'settings-action danger',
      onClick: () => {
        if (confirm('Are you sure you want to reset your profile? This cannot be undone.')) {
          S.resetProfile();
          alert('Profile reset! The page will reload.');
          location.reload();
        }
      }
    });
    actionsSection.appendChild(resetBtn);
    
    settingsContent.appendChild(actionsSection);
  }

  /* Create stat cell */
  function createStatCell(value, label) {
    const cell = Components.createElement('div', { className: 'stat-cell' });
    cell.appendChild(Components.createElement('div', {
      className: 'stat-cell-val',
      text: value
    }));
    cell.appendChild(Components.createElement('div', {
      className: 'stat-cell-lbl',
      text: label
    }));
    return cell;
  }

  /* Public API */
  return {
    render
  };
})();
