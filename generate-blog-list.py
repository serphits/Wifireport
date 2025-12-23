#!/usr/bin/env python3
"""
Blog Post List Generator (Python Version)
Scans the /blog folder and creates blog-posts.json with metadata from each HTML file.
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path

# Configuration for blog posts
BLOG_CONFIG = {
    # Map of filename to emoji icon
    'icons': {
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
    # Default icon if not specified
    'default_icon': '📝'
}

def extract_metadata(html_content, filename):
    """Extract metadata from HTML file"""
    
    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
    title = title_match.group(1).split('|')[0].strip() if title_match else filename.replace('.html', '')
    
    # Extract description
    desc_match = re.search(r'<meta name="description" content="(.*?)"', html_content, re.IGNORECASE)
    description = desc_match.group(1) if desc_match else ''
    
    # Extract keywords
    keywords_match = re.search(r'<meta name="keywords" content="(.*?)"', html_content, re.IGNORECASE)
    keywords = [kw.strip() for kw in keywords_match.group(1).split(',')] if keywords_match else []
    
    return {
        'title': title,
        'description': description,
        'keywords': keywords
    }

def generate_tags(keywords):
    """Generate tags from keywords (take first 2-3)"""
    return [kw.title() for kw in keywords[:2]]

def estimate_reading_time(html_content):
    """Estimate reading time based on content length"""
    # Remove HTML tags
    text = re.sub(r'<[^>]*>', ' ', html_content)
    # Count words
    words = [w for w in text.split() if len(w) > 0]
    word_count = len(words)
    # Average reading speed: 200 words per minute
    minutes = max(1, round(word_count / 200))
    return f"{minutes} min read"

def get_file_date(filepath):
    """Get file creation/modification date"""
    timestamp = os.path.getmtime(filepath)
    date = datetime.fromtimestamp(timestamp)
    return date.strftime('%b %d, %Y')

def generate_blog_list():
    """Main function to generate blog list"""
    script_dir = Path(__file__).parent
    blog_dir = script_dir / 'blog'
    
    if not blog_dir.exists():
        print('❌ Blog directory not found!')
        return
    
    # Get all HTML files
    blog_files = list(blog_dir.glob('*.html'))
    
    blog_posts = []
    for filepath in blog_files:
        filename = filepath.name
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Extract metadata
            metadata = extract_metadata(html_content, filename)
            tags = generate_tags(metadata['keywords'])
            reading_time = estimate_reading_time(html_content)
            date = get_file_date(filepath)
            icon = BLOG_CONFIG['icons'].get(filename, BLOG_CONFIG['default_icon'])
            
            blog_post = {
                'filename': filename,
                'url': f'blog/{filename}',
                'title': metadata['title'],
                'description': metadata['description'],
                'tags': tags,
                'readingTime': reading_time,
                'date': date,
                'icon': icon,
                'dateObj': datetime.strptime(date, '%b %d, %Y').timestamp()  # For sorting
            }
            
            blog_posts.append(blog_post)
            
        except Exception as e:
            print(f'⚠️  Error processing {filename}: {str(e)}')
            continue
    
    # Sort by date (newest first)
    blog_posts.sort(key=lambda x: x['dateObj'], reverse=True)
    
    # Remove dateObj before saving (used only for sorting)
    for post in blog_posts:
        del post['dateObj']
    
    # Save to JSON file
    output_path = script_dir / 'blog-posts.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(blog_posts, f, indent=2, ensure_ascii=False)
    
    print(f'✅ Generated blog list with {len(blog_posts)} posts')
    print(f'📝 Saved to: {output_path}')

if __name__ == '__main__':
    generate_blog_list()
