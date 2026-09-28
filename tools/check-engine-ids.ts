import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const ENGINES_DIR = path.join(ROOT_DIR, 'web', 'src', 'engines');

console.log('=== ENGINE IDS CHECK (L4 CHECK) ===');

const requiredEngineIds = [
  'search/bfs',
  'agent/vacuum',
  'logic/truth-table',
  'logic/unify',
  'rules/chaining',
  'expert/knowledge-base',
  'expert/diagnosis',
  'agent/self-driving',
  'chatbot/eliza',
  'search/uninformed',
  'search/astar',
  'search/local',
  'csp/solver',
  'adversarial/minimax',
  'genetic/optimizer',
  'regression/linear',
  'regression/multiple',
  'regression/polynomial',
  'regression/locally-weighted',
  'preprocessing/features',
  'regression/regularization',
  'probabilistic/naive-bayes',
  'classification/logistic',
  'classification/metrics',
  'instance/knn',
  'tree/decision-tree',
  'classification/svm',
];

requiredEngineIds.forEach((id) => {
  const enginePath = path.join(ENGINES_DIR, ...id.split('/'), 'engine.ts');
  if (fs.existsSync(enginePath)) {
    console.log(`[PASS] Engine ID '${id}' exists at ${enginePath}`);
  } else {
    console.error(`[FAIL] Engine ID '${id}' missing at ${enginePath}`);
    process.exit(1);
  }
});

