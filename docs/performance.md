# ⚡ Performance Optimization Guide

This guide covers performance optimization techniques, monitoring, and best practices for the Dick Size Checker website.

## Table of Contents

- [Performance Goals](#performance-goals)
- [Core Web Vitals](#core-web-vitals)
- [Optimization Techniques](#optimization-techniques)
- [Image Optimization](#image-optimization)
- [CSS Optimization](#css-optimization)
- [JavaScript Optimization](#javascript-optimization)
- [Caching Strategies](#caching-strategies)
- [CDN Configuration](#cdn-configuration)
- [Mobile Performance](#mobile-performance)
- [Monitoring & Measurement](#monitoring--measurement)
- [Performance Budget](#performance-budget)
- [Troubleshooting](#troubleshooting)

## Performance Goals

### Target Metrics

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| LCP (Largest Contentful Paint) | < 1.5s | < 2.5s | > 4.0s |
| FID (First Input Delay) | < 50ms | < 100ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 | > 0.25 |
| FCP (First Contentful Paint) | < 1.0s | < 1.8s | > 3.0s |
| TTFB (Time to First Byte) | < 200ms | < 800ms | > 1.8s |
| Speed Index | < 2.0s | < 3.4s | > 5.8s |

### User Experience Goals

- Page loads feel instant (< 1 second perceived load time)
- Interactions are immediately responsive
- No layout shifting during load
- Smooth animations and transitions
- Optimal performance on mobile devices

## Core Web Vitals

### Largest Contentful Paint (LCP)

**Current optimizations:**
- Preload critical CSS and fonts
- Optimize main content images
- Use efficient CSS and JavaScript

**Further optimizations:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="css/style.css" as="style">
<link rel="preload" href="js/script.js" as="script">

<!-- Optimize images -->
<img src="hero-image.webp" alt="Main image" 
     width="800" height="600" 
     loading="eager">
```

### First Input Delay (FID)

**Current optimizations:**
- Minimal JavaScript execution during load
- Event listeners added after page load
- Efficient event handling

**Code optimization:**
```javascript
// Efficient event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.check-btn')) {
    handleFormSubmit(e);
  }
}, { passive: true });

// Use requestIdleCallback for non-critical tasks
function performNonCriticalTask() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Non-critical work here
    });
  } else {
    setTimeout(() => {
      // Fallback for older browsers
    }, 1);
  }
}
```

### Cumulative Layout Shift (CLS)

**Current optimizations:**
- Fixed dimensions for all images
- Proper sizing for dynamic content
- Consistent typography sizing

**CSS improvements:**
```css
/* Prevent layout shift with aspect ratios */
.image-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

/* Reserve space for dynamic content */
.result-card {
  min-height: 400px;
  contain: layout;
}

/* Stable font loading */
@font-face {
  font-family: 'MainFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;
}
```

## Optimization Techniques

### Critical Rendering Path

1. **Inline Critical CSS**
```html
<style>
/* Critical above-the-fold styles */
body { font-family: -apple-system, sans-serif; }
.container { max-width: 600px; margin: 0 auto; }
.main-title { font-size: 2rem; text-align: center; }
</style>
```

2. **Defer Non-Critical CSS**
```html
<link rel="preload" href="css/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/non-critical.css"></noscript>
```

3. **Optimize JavaScript Loading**
```html
<!-- Critical JavaScript -->
<script src="js/critical.js"></script>

<!-- Non-critical JavaScript -->
<script src="js/non-critical.js" defer></script>

<!-- Third-party scripts -->
<script src="https://analytics.com/script.js" async></script>
```

### Resource Prioritization

```html
<head>
  <!-- Highest priority -->
  <link rel="preload" href="css/critical.css" as="style">
  <link rel="preload" href="fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- High priority -->
  <link rel="preload" href="js/main.js" as="script">
  
  <!-- Lower priority -->
  <link rel="prefetch" href="images/secondary.webp">
  <link rel="dns-prefetch" href="//twitter.com">
</head>
```

## Image Optimization

### Modern Image Formats

```html
<!-- WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" width="800" height="600">
</picture>
```

### Responsive Images

```html
<!-- Responsive images with multiple sizes -->
<img srcset="small.webp 400w, 
             medium.webp 800w, 
             large.webp 1200w"
     sizes="(max-width: 400px) 400px,
            (max-width: 800px) 800px,
            1200px"
     src="medium.jpg"
     alt="Description"
     loading="lazy">
```

### Image Optimization Script

```bash
#!/bin/bash
# scripts/optimize-images.sh

echo "Optimizing images..."

# Create optimized directory
mkdir -p assets/optimized

# Convert to WebP
for img in assets/*.{jpg,jpeg,png}; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    name="${filename%.*}"
    
    # Convert to WebP
    cwebp -q 85 "$img" -o "assets/optimized/${name}.webp"
    
    # Convert to AVIF (if available)
    if command -v avifenc &> /dev/null; then
      avifenc -q 65 "$img" "assets/optimized/${name}.avif"
    fi
    
    echo "Optimized: $filename"
  fi
done

echo "Image optimization complete!"
```

## CSS Optimization

### Critical CSS Extraction

```javascript
// scripts/extract-critical-css.js
const puppeteer = require('puppeteer');
const critical = require('critical');

async function extractCriticalCSS() {
  try {
    const { css } = await critical.generate({
      base: './',
      src: 'index.html',
      css: ['css/style.css'],
      dimensions: [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 900 }  // Desktop
      ],
      penthouse: {
        blockJSRequests: false
      }
    });

    console.log('Critical CSS generated');
    return css;
  } catch (error) {
    console.error('Error generating critical CSS:', error);
  }
}

extractCriticalCSS();
```

### CSS Minification

```bash
#!/bin/bash
# scripts/minify-css.sh

echo "Minifying CSS..."

# Install clean-css-cli if not present
if ! command -v cleancss &> /dev/null; then
  npm install -g clean-css-cli
fi

# Minify CSS
cleancss -o css/style.min.css css/style.css

# Calculate savings
original_size=$(wc -c < css/style.css)
minified_size=$(wc -c < css/style.min.css)
savings=$((original_size - minified_size))
percentage=$((savings * 100 / original_size))

echo "Original: ${original_size} bytes"
echo "Minified: ${minified_size} bytes"
echo "Savings: ${savings} bytes (${percentage}%)"
```

### CSS Performance Best Practices

```css
/* Use efficient selectors */
.button { /* Good: class selector */ }
#header .nav li a { /* Avoid: overly specific */ }

/* Minimize reflows and repaints */
.animated-element {
  transform: translateX(0); /* Use transform instead of left/top */
  will-change: transform; /* Hint for animations */
}

/* Use containment for performance */
.independent-section {
  contain: layout style paint;
}

/* Optimize font loading */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Ensure text remains visible */
}
```

## JavaScript Optimization

### Code Splitting

```javascript
// Dynamic imports for non-critical features
async function loadAnalytics() {
  if (shouldLoadAnalytics()) {
    const { AnalyticsModule } = await import('./analytics.js');
    return new AnalyticsModule();
  }
}

// Load features on demand
async function loadModal() {
  const { ModalHandler } = await import('./modal.js');
  return new ModalHandler();
}
```

### Performance-Optimized Event Handling

```javascript
// Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Efficient scroll handling
const handleScroll = throttle(() => {
  // Scroll handling logic
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });
```

### Memory Management

```javascript
class PerformantComponent {
  constructor() {
    this.cleanup = [];
  }

  init() {
    // Store cleanup functions
    const scrollHandler = this.handleScroll.bind(this);
    window.addEventListener('scroll', scrollHandler);
    this.cleanup.push(() => window.removeEventListener('scroll', scrollHandler));
  }

  destroy() {
    // Clean up event listeners and resources
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
  }
}
```

## Caching Strategies

### Browser Caching

```javascript
// Service Worker for advanced caching
const CACHE_NAME = 'dickchecker-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/script.js',
  '/assets/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### HTTP Caching Headers

```javascript
// vercel.json caching configuration
{
  "headers": [
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(png|jpg|jpeg|gif|ico|svg))",
      "headers": [
        {
          "key": "Cache-Control", 
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## CDN Configuration

### Cloudflare Optimization

```bash
# Cloudflare Page Rules for maximum performance
# Rule 1: Cache everything for static assets
# Pattern: yoursite.com/assets/*
# Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 year

# Rule 2: Optimize main page
# Pattern: yoursite.com/*
# Settings: Auto Minify = CSS, HTML, JS; Rocket Loader = On
```

### Image CDN Setup

```html
<!-- Using Cloudflare Images or similar -->
<img src="https://imagecdn.com/resize/800x600/yourimage.jpg" 
     alt="Optimized image"
     loading="lazy">
```

## Mobile Performance

### Mobile-Specific Optimizations

```css
/* Optimize for mobile */
@media (max-width: 768px) {
  /* Reduce animation complexity on mobile */
  .animated-element {
    animation: simple-fade 0.3s ease-out;
  }
  
  /* Optimize fonts for mobile */
  body {
    font-size: 16px; /* Prevent zoom on focus */
  }
  
  /* Touch-friendly targets */
  .button {
    min-height: 44px; /* iOS recommendation */
    min-width: 44px;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Optimization

```javascript
// Optimize touch events
class TouchOptimizer {
  static init() {
    // Disable zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Optimize scroll performance
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }
}
```

## Monitoring & Measurement

### Real User Monitoring (RUM)

```javascript
// Performance monitoring
class PerformanceMonitor {
  static init() {
    // Core Web Vitals monitoring
    this.measureCoreWebVitals();
    
    // Custom performance metrics
    this.measureCustomMetrics();
    
    // Network monitoring
    this.monitorNetworkConditions();
  }

  static measureCoreWebVitals() {
    // LCP measurement
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      this.reportMetric('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID measurement  
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        this.reportMetric('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS measurement
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
          this.reportMetric('cls', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  static measureCustomMetrics() {
    // Time to Interactive approximation
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const tti = navigation.loadEventEnd;
        console.log('TTI (approx):', tti);
        this.reportMetric('tti', tti);
      }, 0);
    });

    // User interaction timing
    const interactionStart = performance.now();
    document.addEventListener('click', () => {
      const interactionTime = performance.now() - interactionStart;
      if (interactionTime > 100) {
        console.warn('Slow interaction:', interactionTime);
        this.reportMetric('slow_interaction', interactionTime);
      }
    }, { once: true });
  }

  static monitorNetworkConditions() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      console.log('Network type:', connection.effectiveType);
      console.log('Downlink:', connection.downlink);
      
      this.reportMetric('network_type', connection.effectiveType);
      this.reportMetric('downlink', connection.downlink);
    }
  }

  static reportMetric(name, value) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  }
}

// Initialize monitoring
PerformanceMonitor.init();
```

### Performance Testing Script

```bash
#!/bin/bash
# scripts/performance-test.sh

echo "Running performance tests..."

# Lighthouse CI
npx lighthouse https://your-domain.com \
  --only-categories=performance \
  --chrome-flags="--headless" \
  --output=json \
  --output-path=./performance-report.json

# Extract key metrics
node -e "
const report = require('./performance-report.json');
const lcp = report.audits['largest-contentful-paint'].numericValue;
const fid = report.audits['max-potential-fid'].numericValue;
const cls = report.audits['cumulative-layout-shift'].numericValue;
const performance = report.categories.performance.score * 100;

console.log('Performance Score:', performance);
console.log('LCP:', lcp + 'ms');
console.log('FID:', fid + 'ms');
console.log('CLS:', cls);

if (performance < 90) {
  console.log('⚠️ Performance below target (90)');
  process.exit(1);
} else {
  console.log('✅ Performance target met');
}
"

# WebPageTest (if API key available)
if [ ! -z "$WEBPAGETEST_API_KEY" ]; then
  echo "Running WebPageTest..."
  curl "https://www.webpagetest.org/runtest.php?url=https://your-domain.com&k=$WEBPAGETEST_API_KEY&f=json"
fi
```

## Performance Budget

### Budget Definitions

```json
{
  "performanceBudget": {
    "resourceSizes": [
      {
        "resourceType": "document",
        "budget": 50
      },
      {
        "resourceType": "stylesheet", 
        "budget": 100
      },
      {
        "resourceType": "script",
        "budget": 200
      },
      {
        "resourceType": "image",
        "budget": 500
      },
      {
        "resourceType": "total",
        "budget": 1000
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "stylesheet",
        "budget": 3
      },
      {
        "resourceType": "script",
        "budget": 5
      }
    ],
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 2000
      },
      {
        "metric": "largest-contentful-paint",
        "budget": 2500
      },
      {
        "metric": "interactive",
        "budget": 3000
      }
    ]
  }
}
```

### Budget Monitoring

```javascript
// scripts/check-performance-budget.js
const puppeteer = require('puppeteer');

async function checkPerformanceBudget() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Monitor network requests
  const resources = [];
  page.on('response', (response) => {
    resources.push({
      url: response.url(),
      type: response.request().resourceType(),
      size: response.headers()['content-length'] || 0
    });
  });

  await page.goto('https://your-domain.com');
  
  // Calculate resource sizes by type
  const budget = {
    css: { budget: 100 * 1024, actual: 0 },
    js: { budget: 200 * 1024, actual: 0 },
    images: { budget: 500 * 1024, actual: 0 },
    total: { budget: 1000 * 1024, actual: 0 }
  };

  resources.forEach(resource => {
    const size = parseInt(resource.size) || 0;
    budget.total.actual += size;
    
    switch (resource.type) {
      case 'stylesheet':
        budget.css.actual += size;
        break;
      case 'script':
        budget.js.actual += size;
        break;
      case 'image':
        budget.images.actual += size;
        break;
    }
  });

  // Check budget violations
  let violations = [];
  Object.entries(budget).forEach(([type, data]) => {
    if (data.actual > data.budget) {
      violations.push({
        type,
        budget: data.budget,
        actual: data.actual,
        overage: data.actual - data.budget
      });
    }
  });

  if (violations.length > 0) {
    console.log('❌ Performance budget violations:');
    violations.forEach(v => {
      console.log(`  ${v.type}: ${v.actual} bytes (budget: ${v.budget}, over by: ${v.overage})`);
    });
  } else {
    console.log('✅ All performance budgets met');
  }

  await browser.close();
  return violations.length === 0;
}

checkPerformanceBudget();
```

## Troubleshooting

### Common Performance Issues

1. **Slow LCP**
   ```bash
   # Check largest element
   # Optimize hero image
   # Preload critical resources
   # Reduce server response time
   ```

2. **High FID**
   ```bash
   # Reduce JavaScript execution time
   # Use code splitting
   # Defer non-critical scripts
   # Optimize event handlers
   ```

3. **Layout Shift (CLS)**
   ```bash
   # Set explicit dimensions
   # Reserve space for dynamic content
   # Avoid inserting content above existing content
   # Use CSS containment
   ```

### Performance Debugging

```javascript
// Performance debugging utilities
class PerformanceDebugger {
  static startMeasure(name) {
    performance.mark(`${name}-start`);
  }

  static endMeasure(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration}ms`);
    
    return measure.duration;
  }

  static analyzeResources() {
    const resources = performance.getEntriesByType('resource');
    
    const analysis = {
      css: resources.filter(r => r.name.includes('.css')),
      js: resources.filter(r => r.name.includes('.js')),
      images: resources.filter(r => /\.(png|jpg|jpeg|gif|webp|svg)/.test(r.name)),
      fonts: resources.filter(r => /\.(woff|woff2|ttf|otf)/.test(r.name))
    };

    Object.entries(analysis).forEach(([type, items]) => {
      const totalTime = items.reduce((sum, item) => sum + item.duration, 0);
      const totalSize = items.reduce((sum, item) => sum + (item.transferSize || 0), 0);
      
      console.log(`${type.toUpperCase()}:`);
      console.log(`  Count: ${items.length}`);
      console.log(`  Total Time: ${totalTime.toFixed(2)}ms`);
      console.log(`  Total Size: ${(totalSize / 1024).toFixed(2)}KB`);
    });
  }

  static findBottlenecks() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    console.log('Navigation Timing:');
    console.log(`  DNS: ${navigation.domainLookupEnd - navigation.domainLookupStart}ms`);
    console.log(`  Connect: ${navigation.connectEnd - navigation.connectStart}ms`);
    console.log(`  Request: ${navigation.responseStart - navigation.requestStart}ms`);
    console.log(`  Response: ${navigation.responseEnd - navigation.responseStart}ms`);
    console.log(`  DOM: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
    console.log(`  Load: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
  }
}

// Usage
PerformanceDebugger.startMeasure('page-load');
window.addEventListener('load', () => {
  PerformanceDebugger.endMeasure('page-load');
  PerformanceDebugger.analyzeResources();
  PerformanceDebugger.findBottlenecks();
});
```

---

**Remember**: Performance optimization is an ongoing process. Regularly monitor metrics, test on real devices, and optimize based on user behavior patterns.