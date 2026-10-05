/**
 * Map UI Module
 * Renders the campaign map screen
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.MapUI = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  const Components = CF.UI.Components;

  /* Render the map screen */
  function render() {
    const mapList = document.getElementById('mapList');
    if (!mapList) return;
    
    // Clear existing content
    mapList.innerHTML = '';
    
    // Update progress
    updateProgress();
    
    // Group levels by volume
    const levelsByVolume = {};
    C.levels.forEach(level => {
      const volume = level.volume || 1;
      if (!levelsByVolume[volume]) {
        levelsByVolume[volume] = [];
      }
      levelsByVolume[volume].push(level);
    });
    
    // Render each volume
    for (const volume in levelsByVolume) {
      renderVolume(parseInt(volume), levelsByVolume[volume]);
    }
    
    // Render future volumes preview
    renderFutureVolumes();
  }

  /* Render a volume section */
  function renderVolume(volume, levels) {
    const mapList = document.getElementById('mapList');
    if (!mapList) return;
    
    // Volume header
    const volumeName = C.volumeNames[volume] || `Volume ${volume}`;
    const header = Components.createElement('div', {
      className: 'volume-header',
      text: `${volumeName}  Volume ${volume}`
    });
    mapList.appendChild(header);
    
    // Pattern subheader
    const patternSubheader = Components.createElement('div', {
      className: 'pattern-subheader'
    });
    
    const patternDot = Components.createElement('div', { className: 'pattern-dot' });
    const patternText = Components.createElement('span', {
      text: 'Two Pointers Patterns'
    });
    
    patternSubheader.appendChild(patternDot);
    patternSubheader.appendChild(patternText);
    mapList.appendChild(patternSubheader);
    
    // Render each level
    levels.forEach((level, index) => {
      const card = Components.createLevelCard(level);
      mapList.appendChild(card);
      
      // Add connector (except for last level)
      if (index < levels.length - 1) {
        const isPrevCleared = S.profile.campaignLevels[level.id]?.cleared;
        const connector = Components.createElement('div', {
          className: `level-connector ${isPrevCleared ? 'done' : ''}`
        });
        mapList.appendChild(connector);
      }
    });
  }

  /* Render future volumes preview */
  function renderFutureVolumes() {
    const mapList = document.getElementById('mapList');
    if (!mapList) return;
    
    const futureVolumes = C.getFutureVolumes();
    futureVolumes.forEach(vol => {
      const card = Components.createElement('div', {
        className: 'level-card volume-preview',
        children: [
          Components.createIcon(vol.icon, 'level-icon'),
          Components.createElement('div', {
            className: 'level-body',
            children: [
              Components.createElement('div', {
                className: 'level-name',
                text: `Volume ${vol.num}: ${vol.name}`
              }),
              Components.createElement('div', {
                className: 'level-meta',
                text: vol.eta
              })
            ]
          })
        ]
      });
      mapList.appendChild(card);
    });
  }

  /* Update progress display */
  function updateProgress() {
    const progressEl = document.getElementById('mapProgress');
    if (!progressEl) return;
    
    const progress = C.getProgressSummary();
    progressEl.textContent = `${progress.cleared} / ${progress.total} levels cleared`;
  }

  /* Refresh the map */
  function refresh() {
    render();
  }

  /* Public API */
  return {
    render,
    refresh,
    updateProgress
  };
})();
