const fs = require('fs');
const path = require('path');

// Configuration for blog posts
const blogConfig = {
    // Map of filename to emoji icon
    icons: {
        'boost-wifi-speed.html': '📡',
        'wifi-security-wpa3-vs-wpa2.html': '🔒',
        'router-placement-guide.html': '🏠',
        'understanding-speed-tests.html': '⚡',
        'gaming-wifi-latency.html': '🎮',
        'wifi6-vs-wifi6e.html': '🌐',
        'secure-home-wifi.html': '👥',
        'mesh-wifi-vs-routers.html': '📶',
        'troubleshooting-wifi.html': '🛠️',
        'guest-network-setup.html': '💼'
    },
    // Default icon if not specified
    defaultIcon: '📝'
};

// Extract metadata from HTML file
function extractMetadata(htmlContent, filename) {
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
    const descMatch = htmlContent.match(/<meta name="description" content="(.*?)"/);
    const keywordsMatch = htmlContent.match(/<meta name="keywords" content="(.*?)"/);
    
    // Clean up the title by removing " | WiFi.Report" or similar suffixes
    let title = titleMatch ? titleMatch[1].split('|')[0].trim() : filename.replace('.html', '');
    let description = descMatch ? descMatch[1] : '';
    let keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];
    
    return { title, description, keywords };
}

// Generate tags from keywords
function generateTags(keywords) {
    // Take first 2-3 most relevant keywords as tags
    return keywords.slice(0, 2).map(kw => {
        // Capitalize first letter of each word
        return kw.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });
}

// Estimate reading time based on content length
function estimateReadingTime(htmlContent) {
    // Remove HTML tags and count words
    const text = htmlContent.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    // Average reading speed: 200 words per minute
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
}

// Get file creation/modification date
function getFileDate(filepath) {
    const stats = fs.statSync(filepath);
    const date = stats.mtime;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Main function to generate blog list
function generateBlogList() {
    const blogDir = path.join(__dirname, 'blog');
    
    if (!fs.existsSync(blogDir)) {
        console.error('Blog directory not found!');
        return;
    }
    
    const files = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.html'));
    
    const blogPosts = files.map(file => {
        const filepath = path.join(blogDir, file);
        const htmlContent = fs.readFileSync(filepath, 'utf8');
        
        const { title, description, keywords } = extractMetadata(htmlContent, file);
        const tags = generateTags(keywords);
        const readingTime = estimateReadingTime(htmlContent);
        const date = getFileDate(filepath);
        const icon = blogConfig.icons[file] || blogConfig.defaultIcon;
        
        return {
            filename: file,
            url: `blog/${file}`,
            title,
            description,
            tags,
            readingTime,
            date,
            icon,
            dateObj: new Date(date) // For sorting
        };
    });
    
    // Sort by date (newest first)
    blogPosts.sort((a, b) => b.dateObj - a.dateObj);
    
    // Remove dateObj before saving (used only for sorting)
    blogPosts.forEach(post => delete post.dateObj);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, 'blog-posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2));
    
    console.log(`✅ Generated blog list with ${blogPosts.length} posts`);
    console.log(`📝 Saved to: ${outputPath}`);
}

// Run the script
generateBlogList();
