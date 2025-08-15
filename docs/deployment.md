# 🚀 Deployment Guide

This guide covers deployment options for the Dick Size Checker website across various platforms.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [GitHub Pages](#github-pages)
- [Traditional Hosting](#traditional-hosting)
- [CDN Setup](#cdn-setup)
- [Domain Configuration](#domain-configuration)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Monitoring Setup](#monitoring-setup)

## Vercel (Recommended)

Vercel is the recommended platform due to excellent performance, automatic optimizations, and edge deployment.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Repository with your code

### Step-by-Step Deployment

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Build Settings**
   ```json
   {
     "buildCommand": "",
     "outputDirectory": ".",
     "installCommand": "npm install",
     "framework": "other"
   }
   ```

4. **Environment Variables** (Optional)
   ```
   NODE_ENV=production
   ANALYTICS_ID=your-analytics-id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site is live at `your-project.vercel.app`

### Custom Domain Setup

1. **Add Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No manual configuration required

### Automatic Deployments

```bash
# Every push to main branch triggers deployment
git push origin main

# Preview deployments for feature branches
git push origin feature-branch
```

## Netlify

Alternative platform with similar features to Vercel.

### Deployment Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect to GitHub and select repository

2. **Build Settings**
   ```
   Build command: (leave empty)
   Publish directory: . (root)
   ```

3. **Deploy Settings**
   ```json
   {
     "build": {
       "publish": ".",
       "command": ""
     },
     "headers": [
       {
         "source": "/*",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

4. **Custom Domain**
   - Go to Domain Settings
   - Add custom domain
   - Configure DNS

## GitHub Pages

Free hosting option with GitHub integration.

### Setup Steps

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select source: Deploy from branch
   - Choose main branch / root

2. **Custom Domain** (Optional)
   - Add CNAME file to repository root
   ```
   your-domain.com
   ```

3. **HTTPS**
   - Enable "Enforce HTTPS" in settings
   - May take up to 24 hours to provision

### Limitations

- No server-side processing
- Limited build customization
- Slower deployments

## Traditional Hosting

For shared hosting or VPS deployment.

### File Upload

1. **Prepare Files**
   ```bash
   # Zip all files
   zip -r site.zip . -x "*.git*" "node_modules/*" "*.md"
   ```

2. **Upload via FTP/SFTP**
   ```bash
   # Using SCP
   scp -r . user@server:/var/www/html/

   # Using FTP client
   # Upload all files to web root directory
   ```

3. **Set Permissions**
   ```bash
   # Make files readable
   chmod -R 644 *
   chmod 755 . css js assets
   ```

### Apache Configuration

Create `.htaccess` file:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Clean URLs
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^.]+)$ $1.html [NC,L]
```

### Nginx Configuration

Add to server block:

```nginx
# Compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Cache headers
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";

# Clean URLs
try_files $uri $uri.html $uri/ =404;
```

## CDN Setup

### Cloudflare (Recommended)

1. **Add Site to Cloudflare**
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers

2. **Configure Settings**
   ```
   SSL/TLS: Full (Strict)
   Caching: Standard
   Minification: HTML, CSS, JS
   ```

3. **Page Rules**
   ```
   Pattern: your-domain.com/css/*
   Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 year
   
   Pattern: your-domain.com/js/*
   Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 year
   ```

### AWS CloudFront

1. **Create Distribution**
   ```json
   {
     "Origins": {
       "DomainName": "your-domain.com",
       "Id": "your-origin"
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "your-origin",
       "ViewerProtocolPolicy": "redirect-to-https"
     }
   }
   ```

2. **Cache Behaviors**
   ```
   Path: /css/*
   TTL: 31536000 (1 year)
   
   Path: /js/*
   TTL: 31536000 (1 year)
   ```

## Domain Configuration

### DNS Records

```
Type    Name    Value
A       @       your-server-ip
CNAME   www     your-domain.com
```

### For Vercel/Netlify

```
Type    Name    Value
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Generate certificate
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL

```
SSL/TLS > Overview > Full (Strict)
Edge Certificates > Always Use HTTPS: On
```

## Environment Variables

### Production Environment

```bash
NODE_ENV=production
SITE_URL=https://your-domain.com
ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Vercel Environment Variables

```bash
# Add in Vercel dashboard
# Settings > Environment Variables
NODE_ENV=production
VERCEL_URL=auto-populated
VERCEL_ENV=production
```

## Performance Optimization

### Image Optimization

```bash
# Optimize images before deployment
npm install -g imagemin-cli

# Compress images
imagemin assets/*.png --out-dir=assets/optimized
imagemin assets/*.jpg --out-dir=assets/optimized
```

### CSS/JS Minification

```bash
# Minify CSS
npm install -g clean-css-cli
cleancss -o css/style.min.css css/style.css

# Minify JS
npm install -g terser
terser js/script.js -o js/script.min.js
```

### Preloading Critical Resources

Update HTML head:

```html
<link rel="preload" href="css/style.css" as="style">
<link rel="preload" href="js/script.js" as="script">
<link rel="dns-prefetch" href="//twitter.com">
```

## Monitoring Setup

### Uptime Monitoring

1. **UptimeRobot**
   - Create free account
   - Add HTTP(s) monitor
   - Set check interval: 5 minutes
   - Configure alerts

2. **Pingdom**
   - Similar setup to UptimeRobot
   - More detailed reports (paid)

### Performance Monitoring

```javascript
// Add to script.js
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart);
  });
}
```

### Error Tracking

```javascript
// Add error tracking
window.addEventListener('error', (e) => {
  // Send to monitoring service
  console.error('JavaScript Error:', e.error);
});
```

## Troubleshooting

### Common Issues

1. **404 Errors**
   - Check file paths are correct
   - Ensure clean URLs are configured
   - Verify deployment completed successfully

2. **CSS/JS Not Loading**
   - Check file permissions
   - Verify MIME types are correct
   - Clear CDN cache if using CDN

3. **Slow Loading**
   - Enable compression
   - Optimize images
   - Configure proper caching headers

4. **SSL Issues**
   - Verify DNS propagation
   - Check certificate validity
   - Force HTTPS redirects

### Debug Mode

Enable debug logging:

```javascript
// Add to script.js for debugging
window.DEBUG = true;
console.log('Debug mode enabled');
```

## Rollback Procedures

### Vercel
```bash
# Rollback to previous deployment
vercel --prod --yes
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Manual Rollback
```bash
# Restore from backup
cp -r backup/* ./
# Redeploy
```

---

**Next Steps**: After deployment, set up monitoring and analytics as described in the monitoring guide.