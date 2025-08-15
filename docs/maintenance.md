# 🔧 Maintenance Guide

This guide outlines the maintenance procedures, monitoring, and best practices for keeping the Dick Size Checker website running optimally.

## Table of Contents

- [Regular Maintenance Tasks](#regular-maintenance-tasks)
- [Performance Monitoring](#performance-monitoring)
- [Security Updates](#security-updates)
- [Content Updates](#content-updates)
- [Backup Procedures](#backup-procedures)
- [Error Monitoring](#error-monitoring)
- [SEO Maintenance](#seo-maintenance)
- [Analytics Review](#analytics-review)
- [Troubleshooting](#troubleshooting)
- [Emergency Procedures](#emergency-procedures)

## Regular Maintenance Tasks

### Daily Tasks (Automated)

These tasks should be automated where possible:

- **Uptime Monitoring**: Verify site accessibility
- **Error Log Review**: Check for JavaScript errors
- **Performance Metrics**: Monitor Core Web Vitals
- **Security Scanning**: Automated vulnerability checks

```bash
# Example monitoring script
#!/bin/bash
# daily-check.sh

echo "Daily site check - $(date)"

# Check site accessibility
curl -f https://your-domain.com > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is down - sending alert"
    # Send alert notification
fi

# Check Core Web Vitals
node scripts/check-performance.js

# Review error logs
node scripts/check-errors.js
```

### Weekly Tasks

**Every Monday:**

1. **Performance Review**
   - Check PageSpeed Insights scores
   - Review Vercel analytics
   - Monitor bandwidth usage
   - Check mobile usability

2. **Content Review**
   - Verify all links work
   - Check for typos or content issues
   - Review user feedback/reports
   - Update any seasonal content

3. **Security Check**
   - Review CSP violations
   - Check for suspicious traffic
   - Verify SSL certificate status
   - Update dependencies if needed

```bash
# Weekly maintenance script
#!/bin/bash
# weekly-maintenance.sh

echo "Weekly maintenance - $(date)"

# Performance check
echo "Checking performance..."
npx lighthouse https://your-domain.com --only-categories=performance --chrome-flags="--headless"

# Link checking
echo "Checking links..."
npx linkinator https://your-domain.com

# Security headers check
echo "Checking security headers..."
curl -I https://your-domain.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"
```

### Monthly Tasks

**First Monday of each month:**

1. **Comprehensive Performance Audit**
   - Full Lighthouse audit
   - Review Web Core Vitals trends
   - Optimize images if needed
   - Review caching effectiveness

2. **SEO Review**
   - Check search console for issues
   - Review keyword rankings
   - Update meta descriptions if needed
   - Verify sitemap is current

3. **Analytics Deep Dive**
   - Review traffic patterns
   - Analyze user behavior
   - Check conversion rates
   - Identify improvement opportunities

4. **Backup Verification**
   - Test backup restoration
   - Verify backup integrity
   - Update backup procedures if needed

### Quarterly Tasks

**Every 3 months:**

1. **Full Security Audit**
   - Penetration testing (if applicable)
   - Review all access permissions
   - Update security policies
   - Check for new vulnerabilities

2. **Performance Optimization**
   - Review and optimize assets
   - Update CDN configuration
   - Optimize database queries (if applicable)
   - Review third-party integrations

3. **Content Strategy Review**
   - Analyze content performance
   - Plan content updates
   - Review user feedback
   - Update documentation

## Performance Monitoring

### Key Metrics to Track

1. **Core Web Vitals**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

2. **Additional Metrics**
   - Time to First Byte (TTFB): < 800ms
   - First Contentful Paint (FCP): < 1.8s
   - Speed Index: < 3.4s

### Monitoring Tools Setup

#### Google Analytics 4

```javascript
// Add to script.js for Core Web Vitals tracking
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToGoogleAnalytics({name, delta, value, id}) {
  gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
  });
}

getCLS(sendToGoogleAnalytics);
getFID(sendToGoogleAnalytics);
getFCP(sendToGoogleAnalytics);
getLCP(sendToGoogleAnalytics);
getTTFB(sendToGoogleAnalytics);
```

#### Vercel Analytics

```bash
# Enable in Vercel dashboard
# Go to Project > Analytics > Enable
```

#### Custom Performance Monitoring

```javascript
// Add to script.js
class PerformanceMonitor {
  static init() {
    if ('performance' in window) {
      window.addEventListener('load', this.measurePageLoad);
      this.measureUserInteractions();
    }
  }

  static measurePageLoad() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    console.log('Page Load Time:', loadTime);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(loadTime)
      });
    }
  }

  static measureUserInteractions() {
    document.addEventListener('click', (e) => {
      const startTime = performance.now();
      
      setTimeout(() => {
        const endTime = performance.now();
        const interactionTime = endTime - startTime;
        
        if (interactionTime > 100) {
          console.warn('Slow interaction:', interactionTime);
        }
      }, 0);
    });
  }
}

// Initialize performance monitoring
PerformanceMonitor.init();
```

## Security Updates

### Automated Security Checks

1. **Vercel Security Headers**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection

2. **Regular Security Scans**

```bash
#!/bin/bash
# security-check.sh

echo "Security check - $(date)"

# Check for mixed content
echo "Checking for mixed content..."
curl -s https://your-domain.com | grep -i "http://" && echo "⚠️ Mixed content found" || echo "✅ No mixed content"

# Check security headers
echo "Checking security headers..."
curl -I https://your-domain.com | grep -E "(X-Frame-Options|Content-Security-Policy|X-Content-Type-Options)"

# Check SSL certificate
echo "Checking SSL certificate..."
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Manual Security Reviews

**Monthly checklist:**

- [ ] Review access logs for suspicious activity
- [ ] Check for new security vulnerabilities
- [ ] Verify CSP policy is effective
- [ ] Review third-party integrations
- [ ] Update security documentation

## Content Updates

### Regular Content Maintenance

1. **Humor Descriptions**
   ```javascript
   // To update humor descriptions, edit js/script.js
   this.humorousDescriptions = [
     // Add new descriptions here
   ];
   ```

2. **Meta Tags and SEO**
   ```html
   <!-- Update in index.html -->
   <meta name="description" content="Updated description">
   <meta property="og:description" content="Updated description">
   ```

3. **Loading Messages**
   ```javascript
   // Update in js/script.js
   this.loadingMessages = [
     "New loading message...",
     // Add more messages
   ];
   ```

### Content Update Process

1. **Create feature branch**
   ```bash
   git checkout -b content-update-YYYYMMDD
   ```

2. **Make changes**
   - Edit relevant files
   - Test locally
   - Verify mobile compatibility

3. **Deploy**
   ```bash
   git add .
   git commit -m "Update content: description of changes"
   git push origin content-update-YYYYMMDD
   ```

4. **Create pull request**
   - Review changes
   - Test on preview deployment
   - Merge to main

## Backup Procedures

### Git-based Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"

echo "Creating backup - $DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Copy all files
cp -r . $BACKUP_DIR/

# Remove git history from backup
rm -rf $BACKUP_DIR/.git

# Compress backup
tar -czf "backups/site_backup_$DATE.tar.gz" -C backups $DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR

echo "Backup completed: site_backup_$DATE.tar.gz"

# Clean old backups (keep last 10)
ls -1t backups/site_backup_*.tar.gz | tail -n +11 | xargs -d '\n' rm -f --
```

### Database Backups (if applicable)

```bash
# If using a database in the future
#!/bin/bash
# db-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="dickchecker"

# Backup database
mysqldump -u username -p password $DB_NAME > "backups/db_backup_$DATE.sql"

# Compress backup
gzip "backups/db_backup_$DATE.sql"

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### Restoration Procedures

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore.sh backup_file.tar.gz"
  exit 1
fi

echo "Restoring from: $BACKUP_FILE"

# Extract backup
tar -xzf $BACKUP_FILE -C temp_restore/

# Copy files
cp -r temp_restore/*/* ./

# Clean up
rm -rf temp_restore/

echo "Restoration completed"
```

## Error Monitoring

### JavaScript Error Tracking

```javascript
// Add to script.js
class ErrorTracker {
  static init() {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleRejection);
  }

  static handleError(event) {
    const error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError('JavaScript Error', error);
  }

  static handleRejection(event) {
    const error = {
      reason: event.reason,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError('Unhandled Promise Rejection', error);
  }

  static logError(type, error) {
    console.error(type, error);
    
    // Send to analytics or monitoring service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${error.message || error.reason}`,
        fatal: false
      });
    }

    // Store locally for debugging
    const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errors.push({ type, error, timestamp: Date.now() });
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('errorLog', JSON.stringify(errors));
  }

  static getErrorLog() {
    return JSON.parse(localStorage.getItem('errorLog') || '[]');
  }

  static clearErrorLog() {
    localStorage.removeItem('errorLog');
  }
}

// Initialize error tracking
ErrorTracker.init();
```

### Error Log Review Script

```javascript
// scripts/check-errors.js
const fs = require('fs');
const path = require('path');

function checkClientSideErrors() {
  console.log('Checking for client-side errors...');
  
  // This would connect to your analytics or error tracking service
  // For now, we'll check for common error patterns in the code
  
  const jsFile = fs.readFileSync(path.join(__dirname, '../js/script.js'), 'utf8');
  
  // Check for potential issues
  const issues = [];
  
  if (jsFile.includes('console.error')) {
    issues.push('Console errors found in production code');
  }
  
  if (jsFile.includes('TODO') || jsFile.includes('FIXME')) {
    issues.push('TODO/FIXME comments found');
  }
  
  if (issues.length > 0) {
    console.log('⚠️ Issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('✅ No issues found');
  }
}

checkClientSideErrors();
```

## SEO Maintenance

### SEO Monitoring Checklist

**Weekly:**
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor search rankings for key terms
- [ ] Review page load speeds
- [ ] Check mobile usability reports

**Monthly:**
- [ ] Update sitemap if needed
- [ ] Review meta descriptions and titles
- [ ] Check for broken links
- [ ] Analyze search performance trends

### SEO Automation Script

```bash
#!/bin/bash
# seo-check.sh

echo "SEO Check - $(date)"

# Check robots.txt
echo "Checking robots.txt..."
curl -s https://your-domain.com/robots.txt | head -10

# Check sitemap
echo "Checking sitemap..."
curl -s https://your-domain.com/sitemap.xml | head -20

# Check meta tags
echo "Checking meta tags..."
curl -s https://your-domain.com | grep -i "<meta" | head -10

# Check for broken links
echo "Checking for broken links..."
npx linkinator https://your-domain.com --verbosity error
```

## Analytics Review

### Key Metrics to Monitor

1. **Traffic Metrics**
   - Page views
   - Unique visitors
   - Bounce rate
   - Session duration

2. **User Behavior**
   - Most popular usernames checked
   - Share button clicks
   - Modal interactions
   - Mobile vs desktop usage

3. **Performance Impact**
   - Correlation between load time and bounce rate
   - Device-specific performance issues
   - Geographic performance variations

### Monthly Analytics Report

```javascript
// scripts/analytics-report.js
function generateMonthlyReport() {
  const report = {
    period: 'Last 30 days',
    metrics: {
      pageViews: 0,
      uniqueUsers: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      mobileTraffic: 0,
      topReferrers: [],
      performanceScore: 0
    },
    insights: [
      // Key insights and recommendations
    ],
    actionItems: [
      // Specific action items for next month
    ]
  };

  console.log('Monthly Analytics Report');
  console.log('=======================');
  console.log(JSON.stringify(report, null, 2));
}

generateMonthlyReport();
```

## Troubleshooting

### Common Issues and Solutions

1. **Site is slow**
   ```bash
   # Check performance
   npx lighthouse https://your-domain.com
   
   # Check CDN status
   curl -I https://your-domain.com | grep -i "cf-ray\|x-cache"
   
   # Optimize images
   npx imagemin assets/*.{png,jpg} --out-dir=assets/optimized
   ```

2. **JavaScript errors**
   ```bash
   # Check browser console
   # Use error tracking from ErrorTracker class
   # Review error logs
   ```

3. **SEO issues**
   ```bash
   # Check Google Search Console
   # Verify meta tags
   curl -s https://your-domain.com | grep -i "<meta"
   
   # Check structured data
   # Use Google's Rich Results Test
   ```

4. **Mobile issues**
   ```bash
   # Use Google's Mobile-Friendly Test
   # Check responsive design breakpoints
   # Test on actual devices
   ```

### Emergency Response Procedures

1. **Site Down**
   ```bash
   # Check server status
   curl -I https://your-domain.com
   
   # Check DNS
   nslookup your-domain.com
   
   # Check CDN
   # Review Vercel status page
   
   # Rollback if needed
   git revert HEAD
   git push origin main
   ```

2. **Security Incident**
   ```bash
   # Immediate response
   # Change all passwords
   # Review access logs
   # Contact hosting provider
   # Document incident
   ```

3. **Performance Issues**
   ```bash
   # Enable debug mode
   # Review performance metrics
   # Check for recent changes
   # Implement emergency optimizations
   ```

## Automation Scripts

### Setup Cron Jobs

```bash
# Edit crontab
crontab -e

# Add these lines:
# Daily check at 6 AM
0 6 * * * /path/to/daily-check.sh

# Weekly maintenance every Monday at 8 AM
0 8 * * 1 /path/to/weekly-maintenance.sh

# Monthly backup on 1st of month at 2 AM
0 2 1 * * /path/to/backup.sh

# Performance check every 4 hours
0 */4 * * * /path/to/performance-check.sh
```

### Monitoring Dashboard

Create a simple monitoring dashboard:

```html
<!-- monitoring.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Site Monitoring Dashboard</title>
    <style>
        .metric { margin: 10px; padding: 10px; border: 1px solid #ccc; }
        .green { background: #d4edda; }
        .yellow { background: #fff3cd; }
        .red { background: #f8d7da; }
    </style>
</head>
<body>
    <h1>Dick Size Checker - Monitoring Dashboard</h1>
    
    <div id="uptime" class="metric">
        <h3>Uptime Status</h3>
        <div id="uptime-status">Checking...</div>
    </div>
    
    <div id="performance" class="metric">
        <h3>Performance Score</h3>
        <div id="performance-score">Checking...</div>
    </div>
    
    <div id="errors" class="metric">
        <h3>Recent Errors</h3>
        <div id="error-count">Checking...</div>
    </div>
    
    <script>
        // Simple monitoring dashboard
        // Would connect to your monitoring APIs
    </script>
</body>
</html>
```

---

**Remember**: Regular maintenance is key to keeping the site running smoothly. Set up automated monitoring and stick to the maintenance schedule for best results.