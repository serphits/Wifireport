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

errorCodes.forEach((error, index) => {
  const filePath = path.join(outputDir, error.code + '.html');

  const stepsHtml = Array.isArray(error.fixSteps) && error.fixSteps.length
    ? error.fixSteps.map(step => `      <li>${escHtml(step)}</li>`).join('\n')
    : '      <li>No fix steps available.</li>';

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
  <title>${escHtml(error.code)} – ${escHtml(error.title)} | WiFi.Report</title>
  <meta name="description" content="Fix ${escHtml(error.code)}: ${escHtml(error.title)}. Cause: ${escHtml(error.cause)}">
  <meta name="author" content="WiFi.Report">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://wifi.report/error-pages/${escHtml(error.code)}.html">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="stylesheet" href="/styles.css">
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
      <a href="/index.html" class="hover:text-blue-600">Home</a>
      <span class="mx-2">›</span>
      <a href="/error-codes.html" class="hover:text-blue-600">Error Codes</a>
      <span class="mx-2">›</span>
      <span class="text-slate-800 font-medium">${escHtml(error.code)}</span>
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
