#!/usr/bin/env node

/**
 * Site Validation Script
 * Validates HTML, CSS, JavaScript, and other files for errors and best practices
 */

const fs = require('fs');
const path = require('path');

class SiteValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  async validate() {
    console.log('🔍 Starting site validation...\n');

    try {
      this.validateStructure();
      this.validateHTML();
      this.validateCSS();
      this.validateJavaScript();
      this.validateAssets();
      this.validateConfig();
      this.validateSEO();

      this.printResults();
      
      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  validateStructure() {
    console.log('📁 Validating file structure...');

    const requiredFiles = [
      'index.html',
      'css/style.css',
      'js/script.js',
      'package.json',
      'vercel.json',
      'robots.txt',
      'sitemap.xml',
      'README.md'
    ];

    const requiredDirs = [
      'css',
      'js',
      'assets',
      'docs',
      'scripts'
    ];

    // Check required files
    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.errors.push(`Missing required file: ${file}`);
      }
    });

    // Check required directories
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        this.errors.push(`Missing required directory: ${dir}`);
      }
    });

    // Check for unnecessary files
    const unnecessaryFiles = [
      'node_modules',
      '.DS_Store',
      'Thumbs.db',
      '*.log'
    ];

    unnecessaryFiles.forEach(pattern => {
      // Simple check for common unnecessary files
      if (pattern.includes('*')) {
        // For patterns like *.log, check if any exist
        const files = fs.readdirSync('.').filter(f => f.endsWith(pattern.replace('*', '')));
        if (files.length > 0) {
          this.warnings.push(`Found unnecessary files: ${files.join(', ')}`);
        }
      } else if (fs.existsSync(pattern)) {
        this.warnings.push(`Found unnecessary file/directory: ${pattern}`);
      }
    });

    console.log('✅ File structure validation complete\n');
  }

  validateHTML() {
    console.log('🌐 Validating HTML...');

    if (!fs.existsSync('index.html')) {
      this.errors.push('index.html not found');
      return;
    }

    const html = fs.readFileSync('index.html', 'utf8');

    // Basic HTML validation
    const htmlChecks = [
      {
        name: 'DOCTYPE declaration',
        test: /<!DOCTYPE html>/i,
        required: true
      },
      {
        name: 'HTML lang attribute',
        test: /<html[^>]+lang=/i,
        required: true
      },
      {
        name: 'Meta charset',
        test: /<meta[^>]+charset=/i,
        required: true
      },
      {
        name: 'Meta viewport',
        test: /<meta[^>]+name="viewport"/i,
        required: true
      },
      {
        name: 'Title tag',
        test: /<title>[^<]+<\/title>/i,
        required: true
      },
      {
        name: 'Meta description',
        test: /<meta[^>]+name="description"/i,
        required: true
      },
      {
        name: 'Open Graph tags',
        test: /<meta[^>]+property="og:/i,
        required: false
      },
      {
        name: 'Twitter Card tags',
        test: /<meta[^>]+property="twitter:/i,
        required: false
      }
    ];

    htmlChecks.forEach(check => {
      if (!check.test.test(html)) {
        if (check.required) {
          this.errors.push(`HTML missing: ${check.name}`);
        } else {
          this.suggestions.push(`HTML could include: ${check.name}`);
        }
      }
    });

    // Check for semantic HTML
    const semanticElements = ['header', 'main', 'section', 'footer', 'nav'];
    semanticElements.forEach(element => {
      if (!html.includes(`<${element}`)) {
        this.suggestions.push(`Consider using semantic element: <${element}>`);
      }
    });

    // Check for accessibility
    const accessibilityChecks = [
      {
        name: 'alt attributes on images',
        test: /<img(?![^>]*alt=)/i,
        message: 'Images missing alt attributes found'
      },
      {
        name: 'form labels',
        test: /<input(?![^>]*aria-label)(?![^>]*id="[^"]*"[^>]*<label[^>]*for="[^"]*")/i,
        message: 'Form inputs without proper labels found'
      }
    ];

    accessibilityChecks.forEach(check => {
      if (check.test.test(html)) {
        this.warnings.push(check.message);
      }
    });

    console.log('✅ HTML validation complete\n');
  }

  validateCSS() {
    console.log('🎨 Validating CSS...');

    if (!fs.existsSync('css/style.css')) {
      this.errors.push('css/style.css not found');
      return;
    }

    const css = fs.readFileSync('css/style.css', 'utf8');

    // Check for CSS best practices
    const cssChecks = [
      {
        name: 'CSS custom properties (variables)',
        test: /:root\s*{[^}]*--/,
        message: 'CSS custom properties found ✅'
      },
      {
        name: 'Mobile-first media queries',
        test: /@media\s*\([^)]*min-width/,
        message: 'Mobile-first approach detected ✅'
      },
      {
        name: 'Flexbox usage',
        test: /display:\s*flex/,
        message: 'Modern layout with Flexbox ✅'
      },
      {
        name: 'Grid usage',
        test: /display:\s*grid/,
        message: 'Modern layout with Grid ✅'
      }
    ];

    cssChecks.forEach(check => {
      if (check.test.test(css)) {
        console.log(`  ${check.message}`);
      }
    });

    // Check for potential issues
    const cssIssues = [
      {
        name: 'Important declarations',
        test: /!important/g,
        warning: true
      },
      {
        name: 'Inline styles in CSS',
        test: /style\s*=/,
        warning: true
      },
      {
        name: 'Universal selector',
        test: /\*\s*{/,
        warning: false
      }
    ];

    cssIssues.forEach(issue => {
      const matches = css.match(issue.test);
      if (matches) {
        const message = `${issue.name}: ${matches.length} occurrences`;
        if (issue.warning) {
          this.warnings.push(message);
        } else {
          console.log(`  ⚠️ ${message}`);
        }
      }
    });

    // Check file size
    const cssSize = Buffer.byteLength(css, 'utf8');
    const cssSizeKB = (cssSize / 1024).toFixed(2);
    
    console.log(`  📊 CSS file size: ${cssSizeKB}KB`);
    
    if (cssSize > 100 * 1024) { // 100KB
      this.warnings.push(`CSS file is large (${cssSizeKB}KB). Consider optimization.`);
    }

    console.log('✅ CSS validation complete\n');
  }

  validateJavaScript() {
    console.log('⚡ Validating JavaScript...');

    if (!fs.existsSync('js/script.js')) {
      this.errors.push('js/script.js not found');
      return;
    }

    const js = fs.readFileSync('js/script.js', 'utf8');

    // Check for modern JavaScript features
    const jsFeatures = [
      {
        name: 'ES6 Classes',
        test: /class\s+\w+/,
        good: true
      },
      {
        name: 'Arrow functions',
        test: /=>\s*{/,
        good: true
      },
      {
        name: 'Const/Let usage',
        test: /(const|let)\s+\w+/,
        good: true
      },
      {
        name: 'Template literals',
        test: /`[^`]*\${[^}]*}/,
        good: true
      },
      {
        name: 'Async/Await',
        test: /(async\s+function|await\s+)/,
        good: true
      }
    ];

    jsFeatures.forEach(feature => {
      if (feature.test.test(js)) {
        if (feature.good) {
          console.log(`  ✅ Using ${feature.name}`);
        }
      }
    });

    // Check for potential issues
    const jsIssues = [
      {
        name: 'console.log statements',
        test: /console\.log/g,
        level: 'warning'
      },
      {
        name: 'alert/confirm/prompt',
        test: /(alert|confirm|prompt)\s*\(/g,
        level: 'warning'
      },
      {
        name: 'eval usage',
        test: /eval\s*\(/g,
        level: 'error'
      },
      {
        name: 'var declarations',
        test: /var\s+\w+/g,
        level: 'suggestion'
      }
    ];

    jsIssues.forEach(issue => {
      const matches = js.match(issue.test);
      if (matches) {
        const message = `${issue.name}: ${matches.length} occurrences`;
        switch (issue.level) {
          case 'error':
            this.errors.push(message);
            break;
          case 'warning':
            this.warnings.push(message);
            break;
          case 'suggestion':
            this.suggestions.push(`Consider replacing: ${message}`);
            break;
        }
      }
    });

    // Check file size
    const jsSize = Buffer.byteLength(js, 'utf8');
    const jsSizeKB = (jsSize / 1024).toFixed(2);
    
    console.log(`  📊 JavaScript file size: ${jsSizeKB}KB`);
    
    if (jsSize > 200 * 1024) { // 200KB
      this.warnings.push(`JavaScript file is large (${jsSizeKB}KB). Consider code splitting.`);
    }

    // Basic syntax check (very simple)
    try {
      new Function(js);
      console.log('  ✅ Basic syntax check passed');
    } catch (error) {
      this.errors.push(`JavaScript syntax error: ${error.message}`);
    }

    console.log('✅ JavaScript validation complete\n');
  }

  validateAssets() {
    console.log('🖼️ Validating assets...');

    if (!fs.existsSync('assets')) {
      this.warnings.push('Assets directory not found');
      return;
    }

    const assetFiles = fs.readdirSync('assets');
    
    // Check for required assets
    const requiredAssets = [
      { name: 'favicon.ico', extensions: ['.ico'] },
      { name: 'apple-touch-icon', extensions: ['.png'] },
      { name: 'og-image', extensions: ['.png', '.jpg', '.jpeg'] }
    ];

    requiredAssets.forEach(asset => {
      const found = assetFiles.some(file => {
        const name = path.parse(file).name;
        const ext = path.parse(file).ext;
        return name.includes(asset.name) && asset.extensions.includes(ext);
      });

      if (!found) {
        this.suggestions.push(`Consider adding ${asset.name} (${asset.extensions.join(' or ')})`);
      }
    });

    // Check asset file sizes
    assetFiles.forEach(file => {
      const filePath = path.join('assets', file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      console.log(`  📄 ${file}: ${sizeKB}KB`);
      
      // Check for large images
      if (stats.size > 500 * 1024 && /\.(png|jpg|jpeg|gif)$/i.test(file)) {
        this.warnings.push(`Large image file: ${file} (${sizeKB}KB)`);
      }
    });

    console.log('✅ Assets validation complete\n');
  }

  validateConfig() {
    console.log('⚙️ Validating configuration files...');

    // Validate package.json
    if (fs.existsSync('package.json')) {
      try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        const requiredFields = ['name', 'version', 'description'];
        requiredFields.forEach(field => {
          if (!pkg[field]) {
            this.warnings.push(`package.json missing field: ${field}`);
          }
        });

        if (pkg.scripts) {
          console.log('  ✅ npm scripts configured');
        }

      } catch (error) {
        this.errors.push(`Invalid package.json: ${error.message}`);
      }
    }

    // Validate vercel.json
    if (fs.existsSync('vercel.json')) {
      try {
        const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        if (vercel.headers) {
          console.log('  ✅ Vercel headers configured');
        }
        
        if (vercel.redirects) {
          console.log('  ✅ Vercel redirects configured');
        }

      } catch (error) {
        this.errors.push(`Invalid vercel.json: ${error.message}`);
      }
    }

    // Validate robots.txt
    if (fs.existsSync('robots.txt')) {
      const robots = fs.readFileSync('robots.txt', 'utf8');
      if (robots.includes('User-agent:')) {
        console.log('  ✅ robots.txt properly formatted');
      } else {
        this.warnings.push('robots.txt may not be properly formatted');
      }
    }

    console.log('✅ Configuration validation complete\n');
  }

  validateSEO() {
    console.log('🔍 Validating SEO elements...');

    // Check sitemap.xml
    if (fs.existsSync('sitemap.xml')) {
      try {
        const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
        if (sitemap.includes('<urlset') && sitemap.includes('<url>')) {
          console.log('  ✅ Sitemap appears valid');
        } else {
          this.warnings.push('Sitemap may not be properly formatted');
        }
      } catch (error) {
        this.errors.push(`Error reading sitemap: ${error.message}`);
      }
    } else {
      this.suggestions.push('Consider adding sitemap.xml for better SEO');
    }

    // Check for common SEO issues in HTML
    if (fs.existsSync('index.html')) {
      const html = fs.readFileSync('index.html', 'utf8');
      
      // Check title length
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        const titleLength = titleMatch[1].length;
        if (titleLength > 60) {
          this.warnings.push(`Title too long (${titleLength} chars). Keep under 60.`);
        }
        console.log(`  📝 Title length: ${titleLength} characters`);
      }

      // Check meta description length
      const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
      if (descMatch) {
        const descLength = descMatch[1].length;
        if (descLength > 160) {
          this.warnings.push(`Meta description too long (${descLength} chars). Keep under 160.`);
        }
        console.log(`  📄 Meta description length: ${descLength} characters`);
      }
    }

    console.log('✅ SEO validation complete\n');
  }

  printResults() {
    console.log('📋 Validation Results');
    console.log('==================');

    if (this.errors.length === 0 && this.warnings.length === 0 && this.suggestions.length === 0) {
      console.log('🎉 Perfect! No issues found.');
      return;
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS (must fix):');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (should fix):');
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    if (this.suggestions.length > 0) {
      console.log('\n💡 SUGGESTIONS (nice to have):');
      this.suggestions.forEach((suggestion, index) => {
        console.log(`  ${index + 1}. ${suggestion}`);
      });
    }

    console.log('\n📊 Summary:');
    console.log(`  Errors: ${this.errors.length}`);
    console.log(`  Warnings: ${this.warnings.length}`);
    console.log(`  Suggestions: ${this.suggestions.length}`);

    if (this.errors.length === 0) {
      console.log('\n✅ Site is ready for deployment!');
    } else {
      console.log('\n❌ Please fix errors before deployment.');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new SiteValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SiteValidator;