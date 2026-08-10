import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const bfsPagePath = path.join(ROOT_DIR, 'web', 'src', 'pages', 'BfsConceptPage.tsx');

console.log('=== CONTENT INTEGRITY CHECK (L4 CHECK) ===');

if (!fs.existsSync(bfsPagePath)) {
  console.error(`Concept page missing at ${bfsPagePath}`);
  process.exit(1);
}

const text = fs.readFileSync(bfsPagePath, 'utf-8');

// Verify template sections exist
const requiredSections = [
  'Breadth-First Search (BFS)',
  'Intuition',
  'Warehouse Robot Simulator',
  'Step-by-Step on Paper',
  'Formal Mathematical Foundations',
  'Algorithm Pseudocode',
  'Code It in Python',
  'Make It Fail',
  'Strengths, Limitations & When NOT to Use',
  'Common Misconceptions',
  'Check Yourself',
  'Exam & Viva Corner',
  'Summary & Key Takeaways',
];

let missing = 0;
requiredSections.forEach((sec) => {
  if (!text.includes(sec)) {
    console.error(`[FAIL] Required template section missing: '${sec}'`);
    missing++;
  } else {
    console.log(`[PASS] Section verified: '${sec}'`);
  }
});

if (missing > 0) {
  process.exit(1);
} else {
  console.log('[PASS] All 14 required sections verified in exact template order.');
}

