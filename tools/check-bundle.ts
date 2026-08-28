import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'web', 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(INDEX_HTML)) {
  console.error(`Dist directory or index.html does not exist at ${DIST_DIR}. Run 'npm run build' first.`);
  process.exit(1);
}

// 1. Identify initial entry scripts and preloads from index.html
const htmlContent = fs.readFileSync(INDEX_HTML, 'utf-8');
const initialScripts: string[] = [];

// Matches <script ... src="/assets/..." and <link rel="modulepreload" href="/assets/..."
const scriptMatches = htmlContent.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g);
for (const match of scriptMatches) {
  if (match[1] && match[1].endsWith('.js')) {
    initialScripts.push(match[1]);
  }
}

const assetsDir = path.join(DIST_DIR, 'assets');
const files = fs.readdirSync(assetsDir);

let initialRouteJsGzip = 0;
let totalJsGzip = 0;
let totalCssGzip = 0;
let maxChunkGzip = 0;
let maxChunkName = '';

const report: { file: string; role: string; rawKB: number; gzipKB: number }[] = [];

files.forEach((f) => {
  const filePath = path.join(assetsDir, f);
  const content = fs.readFileSync(filePath);
  const rawKB = content.length / 1024;
  const gzipKB = zlib.gzipSync(content).length / 1024;

  if (f.endsWith('.js')) {
    totalJsGzip += gzipKB;
    const isInitial = initialScripts.includes(f);
    if (isInitial) {
      initialRouteJsGzip += gzipKB;
    }
    if (gzipKB > maxChunkGzip) {
      maxChunkGzip = gzipKB;
      maxChunkName = f;
    }
    report.push({
      file: f,
      role: isInitial ? 'Initial Route JS' : 'Async Route Chunk',
      rawKB: Math.round(rawKB * 10) / 10,
      gzipKB: Math.round(gzipKB * 10) / 10,
    });
  } else if (f.endsWith('.css')) {
    totalCssGzip += gzipKB;
    report.push({
      file: f,
      role: 'Global CSS',
      rawKB: Math.round(rawKB * 10) / 10,
      gzipKB: Math.round(gzipKB * 10) / 10,
    });
  }
});

console.log('=== BUNDLE SIZE AUDIT (L5 BUDGET) ===');
console.table(report);
console.log(`Initial Route JS (gzip): ${initialRouteJsGzip.toFixed(2)} KB (Budget: <= 200 KB)`);
console.log(`Largest single chunk: ${maxChunkName} (${maxChunkGzip.toFixed(2)} KB, Budget: <= 150 KB)`);
console.log(`Total JS across all routes (gzip): ${totalJsGzip.toFixed(2)} KB`);
console.log(`Total CSS (gzip): ${totalCssGzip.toFixed(2)} KB`);

let hasError = false;

if (initialRouteJsGzip > 200) {
  console.error(`[FAIL] Initial route JS gzip (${initialRouteJsGzip.toFixed(2)} KB) exceeds 200 KB budget!`);
  hasError = true;
} else {
  console.log(`[PASS] Initial route JS (${initialRouteJsGzip.toFixed(2)} KB) is within the 200 KB budget.`);
}

if (maxChunkGzip > 150) {
  console.error(`[FAIL] Chunk ${maxChunkName} (${maxChunkGzip.toFixed(2)} KB) exceeds 150 KB per-chunk budget!`);
  hasError = true;
} else {
  console.log(`[PASS] All individual chunks are <= 150 KB gzip.`);
}

if (hasError) {
  process.exit(1);
}

