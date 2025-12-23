# Blog System - Quick Start

Your blog system is now set up to automatically display all blog posts from the `/blog` folder!

## How It Works

1. **Add a blog post** - Just create an HTML file in the `/blog` folder
2. **Run the generator** - Run `python generate-blog-list.py`
3. **Done!** - Open blog.html and your new post appears

## After Adding a New Blog Post

Whenever you add a new `.html` file to the `/blog` folder:

```bash
python generate-blog-list.py
```

This scans all HTML files in `/blog`, extracts their titles and descriptions, and updates `blog-posts.json`.

The blog.html page automatically loads from this JSON file.

## Blog Post Template

Make sure your blog posts have these meta tags:

```html
<title>Your Post Title | WiFi.Report</title>
<meta name="description" content="Brief description of your post">
<meta name="keywords" content="keyword1, keyword2, keyword3">
```

The system will:
- Extract the title, description, and keywords
- Calculate reading time automatically
- Use file date for post date
- Display an emoji icon (configurable in the generator script)

## Customizing Icons

Edit `generate-blog-list.py` and add your filename to the `icons` dictionary:

```python
'icons': {
    'your-new-post.html': '💡',  # Your emoji here
    ...
}
```

That's it! Simple and automated.
