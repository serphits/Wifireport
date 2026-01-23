#!/usr/bin/env node
/**
 * Sitemap Generator for WiFi.Report
 * Automatically generates sitemap.xml with current file modification dates
 * Run: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://wifi.report';
const OUTPUT_FILE = 'sitemap.xml';

// Page categories with their default priorities and change frequencies
const PAGE_CONFIG = {
    // Main pages - highest priority
    'index.html': { priority: '1.0', changefreq: 'daily', isMain: true },
    
    // Important content pages
    'blog.html': { priority: '0.9', changefreq: 'weekly' },
    'speed.html': { priority: '0.8', changefreq: 'daily' },
    'starlink.html': { priority: '0.8', changefreq: 'monthly' },
    'about.html': { priority: '0.8', changefreq: 'monthly' },
    'stats.html': { priority: '0.7', changefreq: 'daily' },
    'help.html': { priority: '0.7', changefreq: 'monthly' },
    'faq.html': { priority: '0.7', changefreq: 'monthly' },
    'contact.html': { priority: '0.7', changefreq: 'monthly' },
    
    // Legal pages - lower priority
    'privacy.html': { priority: '0.3', changefreq: 'monthly' },
    'terms.html': { priority: '0.3', changefreq: 'monthly' },
    'cookies.html': { priority: '0.3', changefreq: 'monthly' },
    
    // Blog posts - standard priority
    _blogDefault: { priority: '0.7', changefreq: 'monthly' }
};

// Pages to exclude from sitemap
const EXCLUDE_PAGES = [
    'blog-backup.html',
    'blog-clean.html'
];

/**
 * Get file modification date in ISO format (YYYY-MM-DD)
 */
function getFileDate(filepath) {
    try {
        const stats = fs.statSync(filepath);
        const date = new Date(stats.mtime);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error(`Error getting date for ${filepath}:`, error.message);
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Generate URL entry for sitemap
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
    return `    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

/**
 * Generate sitemap XML
 */
function generateSitemap() {
    console.log('🗺️  Generating sitemap...\n');
    
    const rootDir = __dirname;
    const blogDir = path.join(rootDir, 'blog');
    
    let urlEntries = [];
    
    // Add root URL (points to index.html)
    const indexConfig = PAGE_CONFIG['index.html'];
    const indexDate = getFileDate(path.join(rootDir, 'index.html'));
    urlEntries.push(generateUrlEntry(
        `${BASE_URL}/`,
        indexDate,
        indexConfig.changefreq,
        indexConfig.priority
    ));
    console.log(`✅ Added: / (${indexDate})`);
    
    // Add main HTML pages
    const htmlFiles = fs.readdirSync(rootDir)
        .filter(file => file.endsWith('.html'))
        .filter(file => !EXCLUDE_PAGES.includes(file))
        .sort();
    
    for (const file of htmlFiles) {
        const filepath = path.join(rootDir, file);
        const config = PAGE_CONFIG[file] || { priority: '0.5', changefreq: 'monthly' };
        const lastmod = getFileDate(filepath);
        const url = `${BASE_URL}/${file}`;
        
        urlEntries.push(generateUrlEntry(url, lastmod, config.changefreq, config.priority));
        console.log(`✅ Added: ${file} (${lastmod})`);
    }
    
    // Add blog posts
    if (fs.existsSync(blogDir)) {
        const blogFiles = fs.readdirSync(blogDir)
            .filter(file => file.endsWith('.html'))
            .sort();
        
        console.log(`\n📝 Processing ${blogFiles.length} blog posts...\n`);
        
        for (const file of blogFiles) {
            const filepath = path.join(blogDir, file);
            const config = PAGE_CONFIG._blogDefault;
            const lastmod = getFileDate(filepath);
            const url = `${BASE_URL}/blog/${file}`;
            
            urlEntries.push(generateUrlEntry(url, lastmod, config.changefreq, config.priority));
            console.log(`✅ Added: blog/${file} (${lastmod})`);
        }
    }
    
    // Generate XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Main Pages -->
${urlEntries.slice(0, htmlFiles.length + 1).join('\n    \n')}
    
    <!-- Blog Posts -->
${urlEntries.slice(htmlFiles.length + 1).join('\n    \n')}
    
</urlset>`;
    
    // Write to file
    const outputPath = path.join(rootDir, OUTPUT_FILE);
    fs.writeFileSync(outputPath, xmlContent);
    
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📝 Total URLs: ${urlEntries.length}`);
    console.log(`📍 Saved to: ${outputPath}`);
    console.log(`\n💡 Tip: Add this to your build process with: npm run build:sitemap`);
}

// Run the script
if (require.main === module) {
    try {
        generateSitemap();
    } catch (error) {
        console.error('❌ Error generating sitemap:', error.message);
        process.exit(1);
    }
}

module.exports = { generateSitemap };
