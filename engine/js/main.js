/**
 * Main Entry Point
 * Initializes the Code Fighter engine
 */

// Ensure CF namespace exists
window.CF = window.CF || {};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Code Fighter Engine Initializing...');
  
  // Initialize all modules
  try {
    // Core modules are loaded via script tags
    // They should have already initialized themselves
    
    // Initialize navigation first
    CF.UI.Navigation.init();
    
    // Update profile bar
    CF.UI.Components.updateProfileBar();
    
    // Set up periodic updates
    setInterval(CF.UI.Components.updateProfileBar, 1000);
    
    console.log('Code Fighter Engine Initialized Successfully');
  } catch (error) {
    console.error('Failed to initialize Code Fighter Engine:', error);
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #dc2626;
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
      z-index: 9999;
      text-align: center;
    `;
    errorMsg.textContent = 'Failed to load Code Fighter. Please refresh the page.';
    document.body.appendChild(errorMsg);
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Export for debugging
window.CF_Engine = window.CF;
