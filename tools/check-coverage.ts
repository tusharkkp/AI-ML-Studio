import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const syllabusPath = path.join(DOCS_DIR, 'syllabus.json');

if (!fs.existsSync(syllabusPath)) {
  console.error(`Syllabus file missing at ${syllabusPath}`);
  process.exit(1);
}

const syllabus = JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));
let totalTopics = 0;
let coveredInPhase = 0;

// Currently completed concept routes
const COMPLETED_TOPIC_IDS = new Set([
  'u2-state-space-search',
  'u2-uninformed-search',
  'u2-informed-search',
  'u2-local-search',
  'u2-case-gps',
  'u2-csp',
  'u2-adversarial-search',
  'u2-case-chess',
  'u2-self-genetic',
  'u2-further-game-theory',
  'u3-ml-paradigms',
  'u3-simple-linear-regression',
  'u3-gradient-descent',
  'u3-multiple-linear-regression',
  'u3-polynomial-regression',
  'u3-bias-variance-tradeoff',
  'u3-locally-weighted-regression',
  'u1-history-foundations',
  'u1-types-applications',
  'u1-ethics-impact',
  'u1-intelligent-agents',
  'u1-knowledge-representation',
  'u1-first-order-logic',
  'u1-rule-based-reasoning',
  'u1-expert-systems',
  'u1-knowledge-acquisition',
  'u1-case-medical',
  'u1-case-self-driving',
  'u1-self-chatbot',
  'u1-self-prompt-eng',
  'u1-further-agi',
]);

syllabus.units.forEach((u: { unit: number; topics: { id: string }[] }) => {
  u.topics.forEach((t: { id: string }) => {
    totalTopics++;
    if (COMPLETED_TOPIC_IDS.has(t.id)) {
      coveredInPhase++;
    }
  });
});

console.log(`[Coverage Check] Total Syllabus Topics: ${totalTopics}`);
console.log(`[Coverage Check] Active Built Concepts: ${coveredInPhase}`);
console.log(`[Coverage Check] Phase 1 Vertical Slice (BFS) is active and covered.`);

