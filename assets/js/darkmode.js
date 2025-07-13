/**
 * Dark Mode Toggle Functionality
 * Toggles dark-mode class on body and saves preference to localStorage
 */
(function() {
  'use strict';

  // Key for localStorage
  const DARK_MODE_KEY = 'academicpages-dark-mode';
  
  // Get saved preference or default to false
  function getDarkModePreference() {
    return localStorage.getItem(DARK_MODE_KEY) === 'true';
  }
  
  // Save preference to localStorage
  function saveDarkModePreference(isDarkMode) {
    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
  }
  
  // Apply dark mode class to body
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  // Update toggle button text
  function updateToggleButton(button, isDarkMode) {
    if (button) {
      button.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
      button.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    const currentMode = getDarkModePreference();
    const newMode = !currentMode;
    
    applyDarkMode(newMode);
    saveDarkModePreference(newMode);
    
    // Update all toggle buttons on the page
    const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
    toggleButtons.forEach(button => updateToggleButton(button, newMode));
  }
  
  // Initialize dark mode on page load
  function initializeDarkMode() {
    const isDarkMode = getDarkModePreference();
    
    // Apply the saved preference immediately to prevent flash
    applyDarkMode(isDarkMode);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setupToggleButtons(isDarkMode);
      });
    } else {
      setupToggleButtons(isDarkMode);
    }
  }
  
  // Setup toggle button event listeners and initial state
  function setupToggleButtons(isDarkMode) {
    const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
    
    toggleButtons.forEach(button => {
      // Set initial button text
      updateToggleButton(button, isDarkMode);
      
      // Add click event listener
      button.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDarkMode();
      });
      
      // Add keyboard support
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDarkMode();
        }
      });
    });
  }
  
  // Auto-detect system preference if no saved preference exists
  function detectSystemPreference() {
    if (localStorage.getItem(DARK_MODE_KEY) === null) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        saveDarkModePreference(true);
        return true;
      }
    }
    return getDarkModePreference();
  }
  
  // Listen for system theme changes
  function setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Only auto-update if user hasn't set a preference
      mediaQuery.addEventListener('change', function(e) {
        if (localStorage.getItem(DARK_MODE_KEY) === null) {
          const isDarkMode = e.matches;
          applyDarkMode(isDarkMode);
          saveDarkModePreference(isDarkMode);
          
          const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
          toggleButtons.forEach(button => updateToggleButton(button, isDarkMode));
        }
      });
    }
  }
  
  // Initialize everything
  function init() {
    // Check for system preference first
    const isDarkMode = detectSystemPreference();
    applyDarkMode(isDarkMode);
    
    // Setup system theme change listener
    setupSystemThemeListener();
    
    // Setup toggle buttons when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setupToggleButtons(isDarkMode);
      });
    } else {
      setupToggleButtons(isDarkMode);
    }
  }
  
  // Start initialization
  init();
  
  // Expose toggle function globally for manual triggering if needed
  window.toggleDarkMode = toggleDarkMode;
})();