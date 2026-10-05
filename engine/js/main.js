/**
 * Main Entry Point
 * Initializes the Code Fighter engine
 */

// Ensure CF namespace exists
window.CF = window.CF || {};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Code Fighter Engine Initializing...');
  
  // Wait a bit for all scripts to load
  setTimeout(function() {
    try {
      // Check if navigation is available
      if (window.CF && window.CF.UI && window.CF.UI.Navigation && window.CF.UI.Navigation.init) {
        console.log('Initializing Navigation...');
        window.CF.UI.Navigation.init();
        console.log('Navigation initialized');
      } else {
        console.error('Navigation module not found');
        throw new Error('Navigation module not found');
      }
      
      // Check if profile bar is available
      if (window.CF && window.CF.UI && window.CF.UI.ProfileBar && window.CF.UI.ProfileBar.render) {
        console.log('Rendering Profile Bar...');
        window.CF.UI.ProfileBar.render();
        console.log('Profile Bar rendered');
      } else {
        console.error('ProfileBar module not found');
        throw new Error('ProfileBar module not found');
      }
      
      // Set up periodic updates
      if (window.CF && window.CF.UI && window.CF.UI.ProfileBar && window.CF.UI.ProfileBar.update) {
        setInterval(window.CF.UI.ProfileBar.update, 1000);
      }
      
      console.log('Code Fighter Engine Initialized Successfully');
    } catch (error) {
      console.error('Failed to initialize Code Fighter Engine:', error);
      console.error('Error stack:', error ? error.stack : 'No stack');
      
      // Show error message
      var errorMsg = document.createElement('div');
      errorMsg.style.cssText = '
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
      ';
      errorMsg.textContent = 'Failed to load Code Fighter. Please refresh the page.';
      document.body.appendChild(errorMsg);
    }
  }, 100);
});

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
});

// Export for debugging
window.CF_Engine = window.CF;
