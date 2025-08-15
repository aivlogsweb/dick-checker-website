/**
 * Dick Size Checker - Main JavaScript File
 * Handles all interactive functionality including form submission,
 * fake analysis generation, animations, and user interactions.
 */

class DickSizeChecker {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.loadingMessages = [
      "Analyzing tweet frequency...",
      "Measuring confidence levels...",
      "Calculating proportions...",
      "Assessing personality traits...",
      "Evaluating communication style...",
      "Processing social signals...",
      "Computing final measurements..."
    ];
    
    this.humorousDescriptions = [
      {
        range: [1.0, 2.5],
        descriptions: [
          "Micro but mighty! You're like a secret agent gadget - small, discreet, but probably saves the world daily! 🕵️",
          "Minimalist masterpiece! You've embraced the 'less is more' philosophy. Probably a connoisseur of tiny house living! 🏠",
          "Button-sized brilliance! Like a perfectly crafted espresso shot - small but packs an incredible punch! ☕",
          "Stealth mode activated! You're the ninja of measurements - what you lack in size, you make up for in pure skill! 🥷"
        ]
      },
      {
        range: [2.6, 4.0],
        descriptions: [
          "Compact and clever! Like a Swiss watch - small, precise, and probably worth more than people realize! ⌚",
          "Fun-size energy! You're the travel-size version of awesome - portable, efficient, and TSA-approved! ✈️",
          "Bite-sized excellence! You've mastered the art of doing more with less. Efficiency expert level: Pro! 🎯",
          "Pocket rocket vibes! Small engine, big performance. You're probably really good at parallel parking! 🚗"
        ]
      },
      {
        range: [4.1, 5.5],
        descriptions: [
          "Solidly reliable! You're the Honda Civic of measurements - dependable, efficient, and surprisingly fun! 🚙",
          "Classic proportions! Not too big, not too small - you're the Goldilocks zone of measurements! 🐻",
          "Perfectly standard! You represent the everyman with dignity and style. Democracy in action! 🗳️",
          "Comfortable confidence! Like a good pair of jeans - fits just right and goes with everything! 👖"
        ]
      },
      {
        range: [5.6, 7.0],
        descriptions: [
          "Above average achievement! You're like premium coffee - that extra kick that makes everything better! ☕",
          "Impressive balance! Perfect mix of confidence and humility. The Swiss Army knife of personalities! 🔧",
          "Solid measurements! You probably read instruction manuals AND actually follow them. Respect! 📋",
          "Well-proportioned wisdom! You bring just the right amount of everything to the table! 🍽️"
        ]
      },
      {
        range: [7.1, 8.5],
        descriptions: [
          "Getting serious now! You're like a luxury sedan - spacious, comfortable, and makes people jealous! 🚙",
          "Substantial presence! You probably give amazing hugs and have strong opinions about pizza toppings! 🍕",
          "Confident proportions! You don't need to honk in traffic - your presence speaks for itself! 📯",
          "Generous dimensions! You probably tip well and remember everyone's birthday. Big heart energy! 💝"
        ]
      },
      {
        range: [8.6, 10.0],
        descriptions: [
          "Seriously impressive! You're like a pickup truck - practical, powerful, and great at moving furniture! 🛻",
          "Big league player! You probably have to duck through doorways and your personality fills rooms! 🚪",
          "Major measurements! Living proof some people hit the genetic lottery. Great at reaching high shelves! 🎰",
          "Gentle giant energy! Intimidating at first glance but probably gives the best bear hugs in history! 🐻"
        ]
      },
      {
        range: [10.1, 11.5],
        descriptions: [
          "Legendary status unlocked! You're like a monster truck - impressive, powerful, and turns heads everywhere! 🚛",
          "Absolutely massive! You probably need custom everything and your shadow has its own zip code! 🌘",
          "Epic proportions! You're basically a walking conversation starter. Airport security probably knows you by name! 🛂",
          "Titan-level measurements! You're the final boss of measurements. Probably need a permit for that thing! 📜"
        ]
      },
      {
        range: [11.6, 13.0],
        descriptions: [
          "MAXIMUM OVERDRIVE! You've transcended human measurements and entered mythical territory! 🐉",
          "Cosmic-level proportions! NASA probably wants to study you. You're basically a natural wonder! 🌌",
          "Legendary mythical status! Ancient civilizations would have written epic poems about your measurements! 📜",
          "Ultimate final form! You've maxed out the character creation slider. Probably need planning permission! 🏗️"
        ]
      }
    ];
  }

  /**
   * Initialize DOM elements and cache references
   */
  initializeElements() {
    this.elements = {
      form: document.getElementById('checker-form'),
      usernameInput: document.getElementById('username-input'),
      inputSection: document.getElementById('input-section'),
      loadingSection: document.getElementById('loading-section'),
      resultsSection: document.getElementById('results-section'),
      loadingMessage: document.getElementById('loading-message'),
      resultUsername: document.getElementById('result-username'),
      sizeDisplay: document.getElementById('size-display'),
      unitDisplay: document.getElementById('unit-display'),
      resultDescription: document.getElementById('result-description'),
      confidenceFill: document.getElementById('confidence-fill'),
      confidencePercentage: document.getElementById('confidence-percentage'),
      percentileNumber: document.getElementById('percentile-number'),
      shareBtn: document.getElementById('share-btn'),
      tryAgainBtn: document.getElementById('try-again-btn'),
      aboutModal: document.getElementById('about-modal'),
      privacyModal: document.getElementById('privacy-modal'),
      aboutLink: document.getElementById('about-link'),
      privacyLink: document.getElementById('privacy-link'),
      closeAbout: document.getElementById('close-about'),
      closePrivacy: document.getElementById('close-privacy')
    };
  }

  /**
   * Set up event listeners for all interactive elements
   */
  initializeEventListeners() {
    // Form submission
    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Input validation and formatting
    this.elements.usernameInput.addEventListener('input', (e) => {
      this.validateAndFormatInput(e.target);
    });

    // Button interactions
    this.elements.tryAgainBtn.addEventListener('click', () => {
      this.resetToInitialState();
    });

    this.elements.shareBtn.addEventListener('click', () => {
      this.shareResult();
    });

    // Modal interactions
    this.elements.aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showModal('about');
    });

    this.elements.privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showModal('privacy');
    });

    this.elements.closeAbout.addEventListener('click', () => {
      this.hideModal('about');
    });

    this.elements.closePrivacy.addEventListener('click', () => {
      this.hideModal('privacy');
    });

    // Close modals on outside click
    this.elements.aboutModal.addEventListener('click', (e) => {
      if (e.target === this.elements.aboutModal) {
        this.hideModal('about');
      }
    });

    this.elements.privacyModal.addEventListener('click', (e) => {
      if (e.target === this.elements.privacyModal) {
        this.hideModal('privacy');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal('about');
        this.hideModal('privacy');
      }
    });

    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  /**
   * Validate and format username input
   */
  validateAndFormatInput(input) {
    let value = input.value;
    
    // Remove @ symbol if user types it
    if (value.startsWith('@')) {
      value = value.slice(1);
    }
    
    // Remove non-alphanumeric characters except underscore
    value = value.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Limit to 15 characters (Twitter username limit)
    value = value.slice(0, 15);
    
    input.value = value;
    
    // Add visual feedback for validation
    const wrapper = input.closest('.input-wrapper');
    if (value.length > 0 && this.isValidUsername(value)) {
      wrapper.classList.add('valid');
      wrapper.classList.remove('invalid');
    } else if (value.length > 0) {
      wrapper.classList.add('invalid');
      wrapper.classList.remove('valid');
    } else {
      wrapper.classList.remove('valid', 'invalid');
    }
  }

  /**
   * Check if username is valid
   */
  isValidUsername(username) {
    return /^[a-zA-Z0-9_]{1,15}$/.test(username) && username.length >= 1;
  }

  /**
   * Handle form submission
   */
  async handleFormSubmit() {
    const username = this.elements.usernameInput.value.trim();
    
    if (!this.isValidUsername(username)) {
      this.showError('Please enter a valid Twitter username');
      return;
    }

    try {
      await this.performAnalysis(username);
    } catch (error) {
      console.error('Analysis failed:', error);
      this.showError('Oops! Something went wrong. Please try again.');
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.style.cssText = `
        color: var(--error-color);
        background: rgba(239, 68, 68, 0.1);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-md);
        text-align: center;
        font-weight: 500;
        animation: fadeInUp 0.3s ease-out;
      `;
      this.elements.form.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorElement && errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
    
    // Shake the input
    this.elements.usernameInput.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => {
      this.elements.usernameInput.style.animation = '';
    }, 500);
  }

  /**
   * Perform the fake analysis with loading animation
   */
  async performAnalysis(username) {
    // Show loading state
    this.showSection('loading');
    
    // Simulate analysis with realistic timing
    const analysisSteps = this.loadingMessages.length;
    const totalTime = this.getRandomDelay(3000, 6000);
    const stepTime = totalTime / analysisSteps;
    
    for (let i = 0; i < analysisSteps; i++) {
      this.elements.loadingMessage.textContent = this.loadingMessages[i];
      await this.delay(stepTime);
    }
    
    // Generate results
    const results = this.generateResults(username);
    
    // Show results
    this.displayResults(username, results);
    this.showSection('results');
  }

  /**
   * Generate consistent results based on username
   */
  generateResults(username) {
    const hash = this.hashUsername(username);
    
    // Generate size (1-13 inches) with bias toward middle values
    const sizeFloat = this.normalDistribution(hash, 1, 13, 6.5);
    const size = Math.round(sizeFloat * 10) / 10; // Round to 1 decimal
    
    // Generate confidence (75-99%)
    const confidence = Math.floor(75 + (hash % 25));
    
    // Select appropriate description
    const description = this.getDescriptionForSize(size, hash);
    
    // Calculate percentile (what % of people you're bigger than)
    const percentile = this.calculatePercentile(size);
    
    // Determine units (mostly inches, some cm for variety)
    const useMetric = hash % 10 === 0; // 10% chance for metric
    
    return {
      size: useMetric ? Math.round(size * 2.54 * 10) / 10 : size,
      originalSize: size, // Keep original for percentile calculation
      unit: useMetric ? 'cm' : 'inches',
      confidence,
      description,
      percentile
    };
  }

  /**
   * Hash username for consistent random generation
   */
  hashUsername(username) {
    let hash = 0;
    const str = username.toLowerCase();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  }

  /**
   * Generate normal distribution for more realistic results
   */
  normalDistribution(seed, min, max, mean) {
    const random1 = this.seededRandom(seed) % 1000 / 1000;
    const random2 = this.seededRandom(seed + 1) % 1000 / 1000;
    
    // Box-Muller transformation for normal distribution
    const normal = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);
    
    // Scale and shift to desired range
    const scaled = normal * 1.2 + mean;
    
    // Clamp to min/max bounds
    return Math.max(min, Math.min(max, scaled));
  }

  /**
   * Seeded random number generator
   */
  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * 1000000);
  }

  /**
   * Calculate percentile (what percentage of people you're bigger than)
   * Based on our 1-13 inch scale with normal distribution centered at 6.5
   */
  calculatePercentile(size) {
    // Convert to percentile based on normal distribution
    // Our scale: 1-13 inches, mean 6.5, we'll use standard deviation of ~2
    const mean = 6.5;
    const stdDev = 2;
    
    // Z-score calculation
    const zScore = (size - mean) / stdDev;
    
    // Convert z-score to percentile using approximation
    // This gives us a realistic distribution where 6.5" = 50th percentile
    let percentile;
    if (zScore <= -3) percentile = 1;
    else if (zScore >= 3) percentile = 99;
    else {
      // Simplified normal distribution approximation
      percentile = Math.round(50 + (zScore * 16.67)); // Roughly converts z-score to percentile
      percentile = Math.max(1, Math.min(99, percentile)); // Clamp between 1-99
    }
    
    return percentile;
  }

  /**
   * Get appropriate description for size
   */
  getDescriptionForSize(size, hash) {
    for (const category of this.humorousDescriptions) {
      if (size >= category.range[0] && size <= category.range[1]) {
        const index = hash % category.descriptions.length;
        return category.descriptions[index];
      }
    }
    
    // Fallback description
    return "You're absolutely unique and that's what makes you special! 🌟";
  }

  /**
   * Display the analysis results
   */
  displayResults(username, results) {
    this.elements.resultUsername.textContent = `@${username}`;
    this.elements.sizeDisplay.textContent = results.size;
    this.elements.unitDisplay.textContent = results.unit;
    this.elements.resultDescription.textContent = results.description;
    this.elements.confidencePercentage.textContent = `${results.confidence}%`;
    
    // Debug and set percentile
    console.log('Percentile result:', results.percentile);
    console.log('Percentile element:', this.elements.percentileNumber);
    if (this.elements.percentileNumber) {
      this.elements.percentileNumber.textContent = results.percentile;
    } else {
      console.error('Percentile element not found!');
    }
    
    // Animate confidence bar
    setTimeout(() => {
      this.elements.confidenceFill.style.width = `${results.confidence}%`;
    }, 500);
    
    // Store results for sharing
    this.currentResults = { username, ...results };
  }

  /**
   * Share results on Twitter/X
   */
  shareResult() {
    if (!this.currentResults) return;
    
    const { username, size, unit, confidence } = this.currentResults;
    const text = `I just checked @${username}'s size and it's ${size} ${unit}! 📏 (${confidence}% accuracy) Check yours at`;
    const url = encodeURIComponent(window.location.origin);
    const tweetText = encodeURIComponent(text);
    
    const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`;
    
    // Open in new window/tab
    window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  }

  /**
   * Reset to initial state
   */
  resetToInitialState() {
    this.elements.usernameInput.value = '';
    this.elements.usernameInput.focus();
    this.showSection('input');
    
    // Reset confidence bar
    this.elements.confidenceFill.style.width = '0';
    
    // Clear stored results
    this.currentResults = null;
    
    // Remove any error messages
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Show specific section and hide others
   */
  showSection(section) {
    const sections = ['input', 'loading', 'results'];
    
    sections.forEach(sectionName => {
      const element = this.elements[`${sectionName}Section`];
      if (sectionName === section) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });
  }

  /**
   * Show modal
   */
  showModal(modalType) {
    const modal = this.elements[`${modalType}Modal`];
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus on close button for accessibility
    const closeBtn = this.elements[`close${modalType.charAt(0).toUpperCase()}${modalType.slice(1)}`];
    closeBtn.focus();
  }

  /**
   * Hide modal
   */
  hideModal(modalType) {
    const modal = this.elements[`${modalType}Modal`];
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Get random delay between min and max milliseconds
   */
  getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Delay utility function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Performance optimization utilities
 */
class PerformanceOptimizer {
  static preloadCriticalResources() {
    // Preload any additional resources if needed
    const criticalImages = ['/assets/favicon.ico'];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  static enableServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  static optimizeImages() {
    // Lazy load images when they come into view
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  static addAnalytics() {
    // Add privacy-friendly analytics if needed
    // Implementation would go here for production
  }
}

/**
 * Error handling and monitoring
 */
class ErrorHandler {
  static init() {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  static handleError(event) {
    console.error('Global error:', event.error);
    // Send to monitoring service in production
  }

  static handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to monitoring service in production
  }
}

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize error handling
  ErrorHandler.init();
  
  // Initialize performance optimizations
  PerformanceOptimizer.preloadCriticalResources();
  PerformanceOptimizer.optimizeImages();
  PerformanceOptimizer.enableServiceWorker();
  
  // Initialize main application
  const app = new DickSizeChecker();
  
  // Make app globally available for debugging
  window.DickSizeChecker = app;
  
  console.log('🍆 Dick Size Checker initialized successfully!');
});

// Add CSS for shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);