import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'web', 'dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error(`Dist directory does not exist at ${DIST_DIR}. Run 'npm run build' first.`);
  process.exit(1);
}

const assetsDir = path.join(DIST_DIR, 'assets');
const files = fs.readdirSync(assetsDir);

let totalJsGzip = 0;
let totalCssGzip = 0;
const report: { file: string; rawKB: number; gzipKB: number }[] = [];

files.forEach((f) => {
  const filePath = path.join(assetsDir, f);
  const content = fs.readFileSync(filePath);
  const rawKB = content.length / 1024;
  const gzipKB = zlib.gzipSync(content).length / 1024;

  if (f.endsWith('.js')) {
    totalJsGzip += gzipKB;
    report.push({ file: f, rawKB: Math.round(rawKB * 10) / 10, gzipKB: Math.round(gzipKB * 10) / 10 });
  } else if (f.endsWith('.css')) {
    totalCssGzip += gzipKB;
    report.push({ file: f, rawKB: Math.round(rawKB * 10) / 10, gzipKB: Math.round(gzipKB * 10) / 10 });
  }
});

console.log('=== BUNDLE SIZE AUDIT (L5 BUDGET) ===');
console.table(report);
console.log(`Total JS (gzip): ${totalJsGzip.toFixed(2)} KB (Budget: <= 200 KB)`);
console.log(`Total CSS (gzip): ${totalCssGzip.toFixed(2)} KB`);

if (totalJsGzip > 200) {
  console.error(`[FAIL] Total JS gzip (${totalJsGzip.toFixed(2)} KB) exceeds 200 KB budget!`);
  process.exit(1);
} else {
  console.log(`[PASS] Bundle size is well within the 200 KB performance budget.`);
}

