'use strict';

const fs = require('fs');
const path = require('path');

const codesPath = path.join(__dirname, 'data', 'master_codes.json');
if (!fs.existsSync(codesPath)) {
  console.error('Error: master_codes.json not found at ' + codesPath);
  process.exit(1);
}

const errorCodes = JSON.parse(fs.readFileSync(codesPath, 'utf-8'));

const outputDir = path.join(__dirname, 'error-pages');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Serialize an object to JSON safe for embedding inside <script> tags. */
function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/<\//g, '<\\/');
}

// Build category map for "Related Errors" section
const categoryMap = {};
errorCodes.forEach(error => {
  if (!categoryMap[error.category]) categoryMap[error.category] = [];
  categoryMap[error.category].push(error);
});

errorCodes.forEach((error, index) => {
  const filePath = path.join(outputDir, error.code + '.html');

  const stepsHtml = Array.isArray(error.fixSteps) && error.fixSteps.length
    ? error.fixSteps.map(step => `      <li>${escHtml(step)}</li>`).join('\n')
    : '      <li>No fix steps available.</li>';

  // Related Errors: up to 4 errors from the same category, excluding the current one
  const related = (categoryMap[error.category] || [])
    .filter(e => e.code !== error.code)
    .slice(0, 4);

  const relatedHtml = related.length > 0
    ? `    <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h3 class="font-bold text-slate-900 mb-4">Related Errors</h3>
      <ul class="space-y-2">
        ${related.map(r => `<li><a href="/error-pages/${escHtml(r.code)}.html" class="text-blue-600 hover:underline text-sm">${escHtml(r.code)} – ${escHtml(r.title)}</a></li>`).join('\n        ')}
      </ul>
    </section>`
    : '';

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wifi.report/' },
      { '@type': 'ListItem', position: 2, name: 'Error Codes', item: 'https://wifi.report/error-codes.html' },
      { '@type': 'ListItem', position: 3, name: `Error ${error.code}`, item: `https://wifi.report/error-pages/${error.code}.html` },
    ],
  });

  // JSON-LD: HowTo for the fix steps
  const howToSteps = Array.isArray(error.fixSteps) && error.fixSteps.length
    ? error.fixSteps.map((step, i) => ({ '@type': 'HowToStep', position: i + 1, name: step, text: step }))
    : [];
  const howToSchema = safeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Fix Error ${error.code}: ${error.title}`,
    description: `Fix Error ${error.code} on your ${error.manufacturer} router. ${error.cause}.`,
    totalTime: 'PT10M',
    step: howToSteps,
  });

  const pageTitle = `Error ${escHtml(error.code)}: ${escHtml(error.categoryName)} | WiFi.Report`;
  const stepCount = Array.isArray(error.fixSteps) ? error.fixSteps.length : 1;
  const metaDesc = `Fix Error ${escHtml(error.code)} on your ${escHtml(error.manufacturer)} router. ${escHtml(error.cause)}. Follow our ${stepCount}-step guide — ${error.successRate}% success rate.`;
  const canonicalUrl = `https://wifi.report/error-pages/${escHtml(error.code)}.html`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZEMBMNRVX1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ZEMBMNRVX1');
  </script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6185133540784018"
   crossorigin="anonymous"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="author" content="WiFi.Report">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="WiFi.Report">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <!-- Structured Data: BreadcrumbList -->
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <!-- Structured Data: HowTo -->
  <script type="application/ld+json">${howToSchema}</script>
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="stylesheet" href="/styles.css">
  <!-- Performance: preconnect to third-party origins -->
  <link rel="preconnect" href="https://cdn.tailwindcss.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            electric: '#00E5FF',
            alert: '#FF6B00',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50">
  <script src="/script.js"></script>
  <main class="max-w-3xl mx-auto px-4 py-10 sm:py-14">
    <nav class="text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-1" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/index.html" class="hover:text-blue-600" itemprop="item"><span itemprop="name">Home</span></a>
          <meta itemprop="position" content="1">
        </li>
        <span class="mx-1" aria-hidden="true">›</span>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href="/error-codes.html" class="hover:text-blue-600" itemprop="item"><span itemprop="name">Error Codes</span></a>
          <meta itemprop="position" content="2">
        </li>
        <span class="mx-1" aria-hidden="true">›</span>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span class="text-slate-800 font-medium" itemprop="name">${escHtml(error.code)}</span>
          <meta itemprop="position" content="3">
        </li>
      </ol>
    </nav>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">${escHtml(error.code)}</h1>
    <h2 class="text-xl font-semibold text-slate-600 mb-4">${escHtml(error.title)}</h2>
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-sm">${escHtml(error.manufacturer)}</span>
      <span class="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-sm">${escHtml(error.categoryName)}</span>
      ${error.series ? `<span class="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-sm">${escHtml(error.series)}</span>` : ''}
    </div>
    <div class="text-4xl font-extrabold mb-6 ${error.successRate >= 85 ? 'text-emerald-600' : 'text-amber-600'}">${error.successRate}% fix rate</div>
    <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <h3 class="font-bold text-slate-900 mb-2">Cause</h3>
      <p class="text-slate-600 leading-relaxed">${escHtml(error.cause)}</p>
    </section>
    <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h3 class="font-bold text-slate-900 mb-4">Fix Steps</h3>
      <ol class="list-decimal list-outside pl-5 space-y-2 text-slate-700 leading-relaxed">
${stepsHtml}
      </ol>
    </section>
${relatedHtml}
    <a href="/error-codes.html" class="text-blue-600 hover:underline text-sm">← Back to all error codes</a>
  </main>
</body>
</html>`;

  fs.writeFileSync(filePath, htmlContent, 'utf-8');

  if ((index + 1) % 500 === 0 || index + 1 === errorCodes.length) {
    console.log(`[${index + 1}/${errorCodes.length}] Generated HTML files...`);
  }
});

console.log(`\nDone. Generated ${errorCodes.length} HTML files in ${outputDir}`);
