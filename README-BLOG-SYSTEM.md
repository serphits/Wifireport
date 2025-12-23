# WiFi.Report Blog Auto-Generator

This system automatically generates the blog post list on your blog.html page whenever you add a new blog post to the `/blog` folder.

## How It Works

1. **Blog Post Files**: All blog posts are HTML files in the `/blog` folder
2. **Metadata Extraction**: The system reads each blog post's HTML to extract:
   - Title (from `<title>` tag)
   - Description (from `<meta name="description">` tag)
   - Keywords (from `<meta name="keywords">` tag)
   - Reading time (auto-calculated from content length)
   - Last modified date (from file system)
3. **JSON Generation**: Creates `blog-posts.json` with all blog data
4. **Dynamic Loading**: The blog.html page loads this JSON and displays all posts automatically

## Setup Instructions

### Option 1: Using Node.js (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Choose the LTS version
   - Install with default settings

2. **Generate the blog list**:
   ```bash
   npm run build:blog
   ```
   Or directly:
   ```bash
   node generate-blog-list.js
   ```

3. **Done!** The `blog-posts.json` file will be created/updated.

### Option 2: Manual Generation (Without Node.js)

If you don't want to install Node.js, you can use the alternative Python script:

1. **Run the Python script** (Python should be pre-installed on Windows 10/11):
   ```bash
   python generate-blog-list.py
   ```

2. **Done!** The `blog-posts.json` file will be created/updated.

## Adding a New Blog Post

Whenever you add a new blog post:

1. **Create your HTML file** in the `/blog` folder (e.g., `new-wifi-tips.html`)

2. **Include proper meta tags** in your blog post HTML:
   ```html
   <title>Your Blog Post Title | WiFi.Report</title>
   <meta name="description" content="A brief description of your post">
   <meta name="keywords" content="keyword1, keyword2, keyword3">
   ```

3. **Add an emoji icon** (optional):
   - Edit `generate-blog-list.js` or `generate-blog-list.py`
   - Add your filename and emoji to the `icons` dictionary
   - Example: `'new-wifi-tips.html': '💡'`

4. **Regenerate the blog list**:
   ```bash
   npm run build:blog
   ```
   Or:
   ```bash
   python generate-blog-list.py
   ```

5. **Refresh your browser** - your new post will appear on blog.html!

## Files Involved

- `generate-blog-list.js` - Node.js script to scan blog posts
- `generate-blog-list.py` - Python alternative script
- `blog-loader.js` - JavaScript that loads posts dynamically on blog.html
- `blog-posts.json` - Generated JSON file with all blog metadata
- `blog.html` - Your blog page (loads posts from JSON)
- `package.json` - Contains the `build:blog` npm script

## Customizing Icons

Blog post icons are defined in the generator scripts. To customize:

1. Open `generate-blog-list.js` (or `.py`)
2. Find the `icons` object/dictionary
3. Add or modify entries:
   ```javascript
   icons: {
       'your-filename.html': '🎯', // Your emoji here
       ...
   }
   ```

## Troubleshooting

### Posts not showing up?
- Make sure you ran the generator script after adding new posts
- Check that `blog-posts.json` exists and is up to date
- Open browser console (F12) to see any JavaScript errors

### Dates showing incorrectly?
- The system uses file modification dates
- Touch the file to update its timestamp if needed

### Need different metadata?
- Edit the generator script to extract different HTML meta tags
- The scripts are well-commented and easy to modify

## Advanced: Automating the Build

### Watch for Changes (Node.js)
Install a file watcher to auto-rebuild when blog files change:

```bash
npm install --save-dev chokidar-cli
```

Add to package.json scripts:
```json
"watch:blog": "chokidar 'blog/**/*.html' -c 'npm run build:blog'"
```

Run:
```bash
npm run watch:blog
```

Now whenever you save a blog post, the list will automatically regenerate!

### Pre-commit Hook
To ensure blog-posts.json is always up to date, add a git pre-commit hook:

Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run build:blog
git add blog-posts.json
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Questions?

The system is designed to be simple and maintenance-free. Just add blog posts with proper meta tags, run the generator script, and they'll automatically appear on your blog page!
