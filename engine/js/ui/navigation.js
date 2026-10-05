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

  /* Initialize navigation */
  function init() {
    // Find all screen elements
    const screenElements = document.querySelectorAll('.screen');
    screenElements.forEach(el => {
      screens[el.id.replace('screen-', '')] = el;
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Show initial screen
    showScreen('menu');
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
      
      // Initialize screen-specific UI
      initializeScreen(screenName);
    }
  }

  /* Initialize screen-specific UI */
  function initializeScreen(screenName) {
    switch (screenName) {
      case 'menu':
        // Menu doesn't need initialization
        break;
      case 'map':
        CF.UI.MapUI.render();
        break;
      case 'fight':
        // Fight will be initialized when starting a level
        break;
      case 'shop':
        CF.UI.ShopUI.render();
        break;
      case 'settings':
        CF.UI.SettingsUI.render();
        break;
      case 'recap':
        CF.UI.RecapUI.render();
        break;
      case 'learn':
        CF.UI.LearnUI.render();
        break;
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
  }

  /* Show fight for a specific level */
  function showFight(levelId) {
    showScreen('fight');
    CF.UI.FightUI.startFight(levelId);
  }

  /* Show shop */
  function showShop() {
    showScreen('shop');
  }

  /* Show settings */
  function showSettings() {
    showScreen('settings');
  }

  /* Show recap */
  function showRecap() {
    showScreen('recap');
  }

  /* Show learn */
  function showLearn() {
    showScreen('learn');
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
