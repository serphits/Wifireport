#!/usr/bin/env node
/**
 * Add missing SEO meta tags to blog posts
 * Adds Open Graph, Twitter Cards, and Structured Data to improve discoverability
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://wifi.report';
const BLOG_POSTS_JSON = 'blog-posts.json';
const BLOG_DIR = 'blog';

// Read blog posts metadata
const blogPosts = JSON.parse(fs.readFileSync(BLOG_POSTS_JSON, 'utf8'));

console.log('🔍 Adding SEO meta tags to blog posts...\n');

let updatedCount = 0;
let errorCount = 0;

for (const post of blogPosts) {
    const filename = post.filename;
    const filepath = path.join(BLOG_DIR, filename);
    
    try {
        let content = fs.readFileSync(filepath, 'utf8');
        const url = `${BASE_URL}/blog/${filename}`;
        
        // Extract title and description from JSON or existing HTML
        let title = post.title;
        let description = post.description;
        
        // For boost-wifi-speed.html, extract title from H1 if not in JSON
        if (!description || description === '') {
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            if (h1Match) {
                const h1Text = h1Match[1].replace(/<[^>]+>/g, '');
                description = `Learn how to ${h1Text.toLowerCase()}. Expert tips and strategies to improve your WiFi performance.`;
            }
        }
        
        if (title === filename.replace('.html', '')) {
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            if (h1Match) {
                title = h1Match[1].replace(/<[^>]+>/g, '') + ' | WiFi.Report';
            }
        } else {
            title = title + ' | WiFi.Report';
        }
        
        // Keywords from tags
        const keywords = post.tags.join(', ').toLowerCase();
        
        // Check if missing basic tags (title, description, canonical)
        const hasTitle = content.includes('<title>');
        const hasDescription = content.includes('name="description"');
        const hasCanonical = content.includes('rel="canonical"');
        const hasOG = content.includes('property="og:');
        const hasTwitter = content.includes('property="twitter:');
        const hasStructuredData = content.includes('application/ld+json');
        
        let modified = false;
        
        // Find where to insert tags (after viewport meta tag)
        const insertPoint = content.indexOf('crossorigin="anonymous"></script>');
        if (insertPoint === -1) {
            console.error(`❌ ${filename}: Could not find insertion point`);
            errorCount++;
            continue;
        }
        
        const insertIndex = content.indexOf('\n', insertPoint) + 1;
        let tagsToInsert = '';
        
        // Add missing basic tags
        if (!hasTitle) {
            tagsToInsert += `    <title>${title}</title>\n`;
            modified = true;
        }
        
        if (!hasDescription && description) {
            tagsToInsert += `    <meta name="description" content="${description}">\n`;
            modified = true;
        }
        
        if (!hasCanonical) {
            tagsToInsert += `    <link rel="canonical" href="${url}">\n`;
            modified = true;
        }
        
        if (keywords && !content.includes('name="keywords"')) {
            tagsToInsert += `    <meta name="keywords" content="${keywords}">\n`;
            modified = true;
        }
        
        // Add Open Graph tags
        if (!hasOG) {
            tagsToInsert += `    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${BASE_URL}/og-image.jpg">
    <meta property="og:site_name" content="WiFi.Report">
    
`;
            modified = true;
        }
        
        // Add Twitter Card tags
        if (!hasTwitter) {
            tagsToInsert += `    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${BASE_URL}/og-image.jpg">
    
`;
            modified = true;
        }
        
        // Add structured data (Schema.org)
        if (!hasStructuredData) {
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title.replace(' | WiFi.Report', ''),
                "description": description,
                "url": url,
                "datePublished": "2026-01-23T00:00:00Z",
                "dateModified": new Date().toISOString(),
                "author": {
                    "@type": "Organization",
                    "name": "WiFi.Report"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "WiFi.Report",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${BASE_URL}/favicon.png`
                    }
                },
                "image": `${BASE_URL}/og-image.jpg`,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": url
                }
            };
            
            tagsToInsert += `    <!-- Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 8).split('\n').map(line => '    ' + line).join('\n')}
    </script>
    
`;
            modified = true;
        }
        
        if (modified) {
            // Insert all tags at once
            content = content.substring(0, insertIndex) + tagsToInsert + content.substring(insertIndex);
            
            // Write back to file
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`✅ ${filename}: Added missing SEO tags`);
            updatedCount++;
        } else {
            console.log(`⏭️  ${filename}: Already has all SEO tags`);
        }
        
    } catch (error) {
        console.error(`❌ ${filename}: ${error.message}`);
        errorCount++;
    }
}

console.log(`\n✅ Complete! Updated ${updatedCount} blog posts`);
if (errorCount > 0) {
    console.log(`⚠️  Encountered ${errorCount} errors`);
}
console.log('\n💡 Next steps:');
console.log('   1. Run: npm run build:blog');
console.log('   2. Run: npm run build:sitemap');
console.log('   3. Test a few blog posts in a browser');
