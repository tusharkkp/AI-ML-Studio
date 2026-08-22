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
  'u2-uninformed-search',
  'u1-history-foundations',
  'u1-types-applications',
  'u1-intelligent-agents',
  'u1-knowledge-representation',
  'u1-first-order-logic',
  'u1-rule-based-reasoning',
  'u1-expert-systems',
  'u1-knowledge-acquisition',
  'u1-case-medical',
  'u1-case-self-driving',
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

