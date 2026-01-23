# Sitemap Generation

## Overview
The sitemap is now automatically generated based on actual file modification dates, ensuring search engines always have up-to-date information about your site's pages.

## Usage

### Generate Sitemap
```bash
npm run build:sitemap
```

### Generate Both Blog List and Sitemap
```bash
npm run build
```

## Features

✅ **Automatic Date Updates**: Sitemap lastmod dates are pulled from actual file modification times  
✅ **All Pages Included**: Automatically discovers and includes all HTML pages  
✅ **Blog Posts**: Automatically includes all blog posts from the `/blog` directory  
✅ **Proper Priorities**: Pages are assigned appropriate priority and change frequency  
✅ **Excludes Temp Files**: Excludes backup files like `blog-backup.html`  

## What Changed

### Before
- Static, hardcoded lastmod dates that quickly became outdated
- Missing pages like `speed.html`, `stats.html`, `help.html`, `faq.html`, `contact.html`
- Manual updates required whenever content changed

### After
- Dynamic lastmod dates pulled from actual file modification times
- All pages automatically discovered and included
- Run `npm run build:sitemap` to regenerate after any content update

## Page Configuration

Pages are configured in `generate-sitemap.js` with priorities and change frequencies:

- **Main pages** (index): Priority 1.0, updated daily
- **Important content** (blog, speed): Priority 0.8-0.9, updated frequently  
- **Support pages** (help, faq, contact): Priority 0.7, updated monthly
- **Legal pages** (privacy, terms, cookies): Priority 0.3, updated monthly
- **Blog posts**: Priority 0.7, updated monthly

## Deployment

Add to your CI/CD pipeline:

```bash
npm install
npm run build
```

This ensures the sitemap is always regenerated before deployment.

## SEO Benefits

1. **Faster Indexing**: Search engines can quickly discover new and updated pages
2. **Accurate Change Dates**: lastmod dates reflect actual content changes
3. **Complete Coverage**: All pages are included automatically
4. **Better Crawl Efficiency**: Proper priorities guide search engine crawlers

## Troubleshooting

**Q: My changes aren't showing in the sitemap**  
A: Run `npm run build:sitemap` to regenerate after making changes

**Q: Some pages are missing**  
A: Check that they're HTML files in the root directory or `/blog` folder, and not in the EXCLUDE_PAGES list

**Q: I want to change a page's priority**  
A: Edit the PAGE_CONFIG object in `generate-sitemap.js`
