/**
 * Navigation Module
 * Screen navigation and history management
 */

window.CF = window.CF || {};

CF.UI = CF.UI || {};

CF.UI.Navigation = (() => {
  const S = CF.State;
  const C = CF.Campaign;
  
  // Screen elements cache
  const screens = {};
  let currentScreen = null;
  let templatesLoaded = false;

  /* Initialize navigation */
  function init() {
    // Load all templates
    loadTemplates();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show initial screen
    showScreen('menu');
  }

  /* Load all HTML templates */
  async function loadTemplates() {
    if (templatesLoaded) return;
    
    const templateFiles = [
      'menu', 'map', 'fight', 'shop', 'settings', 'recap', 'learn'
    ];
    
    const app = document.getElementById('app');
    
    for (const file of templateFiles) {
      try {
        const response = await fetch(`templates/${file}.html`);
        if (response.ok) {
          const html = await response.text();
          app.insertAdjacentHTML('beforeend', html);
          screens[file] = document.getElementById(`screen-${file}`);
        }
      } catch (e) {
        console.warn(`Failed to load template: ${file}.html`, e);
      }
    }
    
    templatesLoaded = true;
  }

  /* Setup event listeners for navigation */
  function setupEventListeners() {
    // Menu buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[id^="btn"]');
      if (!target) return;
      
      const id = target.id;
      switch (id) {
        case 'btnCampaign':
          showMap();
          break;
        case 'btnLearn':
          showLearn();
          break;
        case 'btnBlitz':
          startBlitz();
          break;
        case 'btnShop':
          showShop();
          break;
        case 'btnSettings':
          showSettings();
          break;
        case 'btnMapBack':
          showMenu();
          break;
        case 'btnMapBack':
          showMenu();
          break;
        case 'fightExit':
          showMap();
          break;
      }
    });
  }

  /* Show a screen by name */
  function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    
    // Show requested screen
    const screen = screens[screenName];
    if (screen) {
      screen.classList.add('active');
      currentScreen = screenName;
    }
  }

  /* Show menu */
  function showMenu() {
    showScreen('menu');
    S.resetSession();
  }

  /* Show map */
  function showMap() {
    showScreen('map');
    // Render map content
    CF.UI.MapUI.render();
  }

  /* Show fight for a specific level */
  function showFight(levelId) {
    showScreen('fight');
    CF.UI.FightUI.startFight(levelId);
  }

  /* Show shop */
  function showShop() {
    showScreen('shop');
    CF.UI.ShopUI.render();
  }

  /* Show settings */
  function showSettings() {
    showScreen('settings');
    CF.UI.SettingsUI.render();
  }

  /* Show recap */
  function showRecap() {
    showScreen('recap');
    CF.UI.RecapUI.render();
  }

  /* Show learn */
  function showLearn() {
    showScreen('learn');
    CF.UI.LearnUI.render();
  }

  /* Start blitz mode */
  function startBlitz() {
    S.resetSession({ mode: 'blitz' });
    showScreen('fight');
    CF.UI.FightUI.startBlitz();
  }

  /* Go back to previous screen */
  function goBack() {
    if (currentScreen === 'map') {
      showMenu();
    } else if (currentScreen === 'fight') {
      showMap();
    } else if (currentScreen === 'shop' || currentScreen === 'settings') {
      showMenu();
    }
  }

  /* Public API */
  return {
    init,
    showScreen,
    showMenu,
    showMap,
    showFight,
    showShop,
    showSettings,
    showRecap,
    showLearn,
    startBlitz,
    goBack,
    getCurrentScreen: () => currentScreen,
    getScreens: () => screens
  };
})();
