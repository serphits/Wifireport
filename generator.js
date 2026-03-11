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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(error.code)} – ${escHtml(error.title)} | WiFi.Report</title>
  <meta name="description" content="Fix ${escHtml(error.code)}: ${escHtml(error.title)}. Cause: ${escHtml(error.cause)}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; }
    h2 { font-size: 1.1rem; font-weight: 600; color: #475569; margin-top: 0; }
    .meta { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
    .badge { background: #f1f5f9; color: #475569; border-radius: 9999px; padding: 2px 10px; font-size: 0.8rem; }
    .rate { font-size: 2rem; font-weight: 800; }
    .rate.good { color: #059669; }
    .rate.ok { color: #d97706; }
    section { margin-top: 24px; }
    section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    ol { padding-left: 1.25rem; line-height: 1.8; }
    .back { display: inline-block; margin-top: 32px; color: #2563eb; text-decoration: none; font-size: 0.9rem; }
    .back:hover { text-decoration: underline; }
    p.cause { color: #475569; line-height: 1.6; }
  </style>
</head>
<body>
  <article>
    <h1>${escHtml(error.code)}</h1>
    <h2>${escHtml(error.title)}</h2>
    <div class="meta">
      <span class="badge">${escHtml(error.manufacturer)}</span>
      <span class="badge">${escHtml(error.categoryName)}</span>
      ${error.series ? `<span class="badge">${escHtml(error.series)}</span>` : ''}
    </div>
    <div class="${error.successRate >= 85 ? 'rate good' : 'rate ok'}">${error.successRate}% fix rate</div>
    <section>
      <h3>Cause</h3>
      <p class="cause">${escHtml(error.cause)}</p>
    </section>
    <section>
      <h3>Fix Steps</h3>
      <ol>
${stepsHtml}
      </ol>
    </section>
    <a class="back" href="/error-codes.html">← Back to all error codes</a>
  </article>
</body>
</html>`;

  fs.writeFileSync(filePath, htmlContent, 'utf-8');

  if ((index + 1) % 500 === 0 || index + 1 === errorCodes.length) {
    console.log(`[${index + 1}/${errorCodes.length}] Generated HTML files...`);
  }
});

console.log(`\nDone. Generated ${errorCodes.length} HTML files in ${outputDir}`);
