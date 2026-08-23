import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';

interface Dilemma {
  id: string;
  title: string;
  category: string;
  context: string;
  stakeholders: string[];
  options: {
    id: string;
    label: string;
    consequences: string;
    ethicalTradeoff: string;
    frameworkAlignment: string;
  }[];
}

const DILEMMAS: Dilemma[] = [
  {
    id: 'hiring-bias',
    title: 'Automated Resume Screening & Demographic Disparity',
    category: 'Algorithmic Fairness',
    context:
      'A tech giant trains a machine learning resume screener on 10 years of past successful engineering hires. Because past hires were 82% male, the model penalized resumes containing the word "women\'s" (e.g. "Captain of Women\'s Rugby Team") and graduates of women\'s colleges.',
    stakeholders: ['Job Applicants', 'Corporate HR', 'Engineering Teams', 'Society at Large'],
    options: [
      {
        id: 'opt1',
        label: 'Strip Gender Keywords (Fairness through Blindness)',
        consequences:
          'Model still infers gender through proxy features like sports played, extracurricular activities, and linguistic phrasing style.',
        ethicalTradeoff:
          'Superficial fairness that ignores structural correlation; proxy discrimination persists.',
        frameworkAlignment: 'Naive Deontology (procedural blindness without outcome verification)',
      },
      {
        id: 'opt2',
        label: 'Enforce Strict Demographic Parity (Equal Selection Rates)',
        consequences:
          'Ensures the proportion of selected women equals the proportion of female applicants by adjusting subgroup decision thresholds.',
        ethicalTradeoff:
          'May require different score cutoffs for different demographic groups, sparking accusations of reverse discrimination.',
        frameworkAlignment: 'Egalitarian Justice (John Rawls - equality of outcome)',
      },
      {
        id: 'opt3',
        label: 'Retire Automated Model; Mandate Human-AI Audited Review',
        consequences:
          'Slower screening throughput, higher operational cost, but allows qualitative human oversight of edge-case resumes.',
        ethicalTradeoff:
          'Human reviewers have cognitive fatigue and subconscious bias of their own.',
        frameworkAlignment: 'Virtue Ethics & Precautionary Principle',
      },
    ],
  },
  {
    id: 'recidivism-parity',
    title: 'Pre-Trial Bail Recidivism Risk Scoring (COMPAS Case)',
    category: 'Justice & Due Process',
    context:
      'A statistical model predicts whether a defendant will re-offend within 2 years. ProPublica revealed that among defendants who did NOT re-offend, Black defendants were twice as likely to be falsely classified as High Risk compared to White defendants.',
    stakeholders: ['Defendants', 'Judges & Prosecutors', 'Crime Victims', 'Civil Rights Advocates'],
    options: [
      {
        id: 'compas-opt1',
        label: 'Maintain Predictive Parity (Calibration)',
        consequences:
          'Ensures a "High Risk" score means a 70% re-arrest rate regardless of race, but unequal false positive rates persist between groups.',
        ethicalTradeoff:
          'Mathematically impossible to equalize both calibration and false positive rates when base crime rates differ (Kleinberg Impossibility Theorem).',
        frameworkAlignment: 'Utilitarian Efficiency (optimizing aggregate accuracy)',
      },
      {
        id: 'compas-opt2',
        label: 'Equalize False Positive Rates Across Subgroups',
        consequences:
          'Lowers the threshold for one group or raises it for another so innocent defendants in all groups have the same risk of wrongful detention.',
        ethicalTradeoff:
          'Breaks predictive parity; a "High Risk" score will now mean different statistical probabilities for different races.',
        frameworkAlignment: 'Individual Rights & Due Process (anti-subordination principle)',
      },
    ],
  },
  {
    id: 'generative-copyright',
    title: 'Generative AI Training on Unlicensed Intellectual Property',
    category: 'Copyright & Data Provenance',
    context:
      'A diffusion model is trained on 5 billion scraped web images without artist consent or compensation. Users prompt the model to generate commercial artwork "in the exact style of Greg Rutkowski", diverting freelance commissions away from living artists.',
    stakeholders: [
      'Original Artists',
      'AI Model Builders',
      'Commercial Clients',
      'Creative Public',
    ],
    options: [
      {
        id: 'art-opt1',
        label: 'Classify Web Scraping as Fair Use Transformative Learning',
        consequences:
          'Allows rapid AI development and open access, but diminishes the financial livelihood of human creative workers.',
        ethicalTradeoff:
          'Treats AI model weights as human-like study, ignoring the industrial-scale automation of competitive mimicry.',
        frameworkAlignment: 'Silicon Valley Innovation Utilitarianism',
      },
      {
        id: 'art-opt2',
        label: 'Mandate Opt-In Consent & Collective Licensing Royalties',
        consequences:
          'Artists are compensated per token/image used in training datasets, but concentrates AI development only in trillion-dollar mega-corporations that can afford multi-million licensing deals.',
        ethicalTradeoff:
          'Protects established creators but forms high economic moats that stifle open-source researchers.',
        frameworkAlignment: 'Labor Rights & Intellectual Property Reciprocity',
      },
    ],
  },
];

export function EthicsScenarioLab() {
  const [activeDilemmaId, setActiveDilemmaId] = useState<string>(DILEMMAS[0]!.id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Hiring fairness interactive threshold demo
  const [threshold, setThreshold] = useState<number>(60);

  const activeDilemma = DILEMMAS.find((d) => d.id === activeDilemmaId) ?? DILEMMAS[0]!;
  const selectedOption = activeDilemma.options.find((o) => o.id === selectedOptionId);

  // Simulation numbers for hiring filter
  const groupA_applicants = 1000;
  const groupB_applicants = 300;

  // Group A has higher mean score due to historical training bias
  const groupA_selected = Math.round(groupA_applicants * Math.max(0.05, 1 - threshold / 100));
  const groupB_selected = Math.round(
    groupB_applicants * Math.max(0.02, 1 - (threshold + 15) / 100)
  );

  const groupA_rate = ((groupA_selected / groupA_applicants) * 100).toFixed(1);
  const groupB_rate = ((groupB_selected / groupB_applicants) * 100).toFixed(1);
  const disparityRatio = (Number(groupB_rate) / Number(groupA_rate)).toFixed(2);
  const passesFourFifthsRule = Number(disparityRatio) >= 0.8;

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Interactive Dilemma Workbench
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            AI Ethics, Bias &amp; Societal Impact Explorer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {DILEMMAS.map((d) => (
            <Button
              key={d.id}
              size="sm"
              variant={activeDilemmaId === d.id ? 'primary' : 'outline'}
              onClick={() => {
                setActiveDilemmaId(d.id);
                setSelectedOptionId(null);
              }}
            >
              {d.category}
            </Button>
          ))}
        </div>
      </div>

      {/* Case Context */}
      <div className="p-4 rounded-xl bg-warm-50 dark:bg-warm-800/40 border border-warm-200 dark:border-warm-700 mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm">
            {activeDilemma.title}
          </h4>
          <Badge variant="warning">{activeDilemma.category}</Badge>
        </div>
        <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed">
          {activeDilemma.context}
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-warm-500">
          <strong>Key Stakeholders:</strong> {activeDilemma.stakeholders.join(' • ')}
        </div>
      </div>

      {/* Interactive Simulation for Hiring Bias if selected */}
      {activeDilemma.id === 'hiring-bias' && (
        <Card className="p-4 mb-6 border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Live Threshold Simulation: The EEOC 4/5ths Rule
            </span>
            <Badge variant={passesFourFifthsRule ? 'success' : 'danger'}>
              {passesFourFifthsRule ? 'Complies (Ratio ≥ 0.80)' : 'Adverse Impact (Ratio < 0.80)'}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span>Decision Acceptance Threshold: {threshold} / 100</span>
              <span>Disparity Ratio: {disparityRatio}</span>
            </div>
            <Slider
              label="Acceptance Cutoff Threshold"
              min={20}
              max={85}
              step={1}
              value={threshold}
              onChange={(val) => setThreshold(val)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">
                Group A (Historical Majority)
              </span>
              <div>Applicants: {groupA_applicants}</div>
              <div>Selected: {groupA_selected}</div>
              <div className="font-bold text-blue-700 dark:text-blue-300">
                Selection Rate: {groupA_rate}%
              </div>
            </div>

            <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                Group B (Underrepresented)
              </span>
              <div>Applicants: {groupB_applicants}</div>
              <div>Selected: {groupB_selected}</div>
              <div className="font-bold text-amber-700 dark:text-amber-300">
                Selection Rate: {groupB_rate}%
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Decision Options */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500">
          As Lead AI Ethics Officer, Which Action Do You Implement?
        </label>
        <div className="space-y-2">
          {activeDilemma.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-accent-primary/10 border-accent-primary ring-1 ring-accent-primary'
                    : 'bg-warm-50 dark:bg-warm-800/40 border-warm-200 dark:border-warm-800 hover:border-warm-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-warm-900 dark:text-warm-100">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Badge variant="unit" unit={1} size="sm">
                      Selected Strategy
                    </Badge>
                  )}
                </div>
                <p className="text-warm-700 dark:text-warm-300 mb-2 leading-relaxed">
                  {opt.consequences}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-warm-200 dark:border-warm-700">
                  <div>
                    <strong className="text-rose-600 dark:text-rose-400">
                      Ethical Cost / Tradeoff:
                    </strong>{' '}
                    <span className="text-warm-600 dark:text-warm-400">{opt.ethicalTradeoff}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      Philosophical Alignment:
                    </strong>{' '}
                    <span className="text-warm-600 dark:text-warm-400">
                      {opt.frameworkAlignment}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedOption && (
        <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100">
          <strong>Decision Impact Audit:</strong> Choosing{' '}
          <em>&ldquo;{selectedOption.label}&rdquo;</em> demonstrates that algorithmic fairness is
          rarely a technical optimization with a single perfect solution—it requires explicit moral
          choices between competing notions of justice.
        </div>
      )}
    </Card>
  );
}
