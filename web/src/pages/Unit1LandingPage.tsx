import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Unit1LandingPage() {
  const getProgress = useProgressStore((state) => state.getConceptProgress);

  const modules = [
    {
      id: 'u1-history-foundations',
      title: 'AI Foundations & History',
      hours: '0.8 hrs',
      desc: 'The Turing imitation game, Dartmouth 1956, the two AI winters, and the modern deep learning resurgence.',
      href: '/learn/unit-1/history-foundations',
      kind: 'core',
    },
    {
      id: 'u1-types-applications',
      title: 'Applications & Types of AI',
      hours: '0.8 hrs',
      desc: 'Artificial Narrow Intelligence (ANI) vs General (AGI) vs Superintelligence (ASI); interactive domain capability classifier.',
      href: '/learn/unit-1/types-applications',
      kind: 'core',
    },
    {
      id: 'u1-intelligent-agents',
      title: 'Intelligent Agents & PEAS Framework',
      hours: '1.2 hrs',
      desc: 'Rationality, PEAS task environments, and vacuum cleaner simulator comparing Simple Reflex vs Model-Based agents.',
      href: '/learn/unit-1/intelligent-agents',
      kind: 'flagship',
    },
    {
      id: 'u1-knowledge-representation',
      title: 'Knowledge Representation & Logic',
      hours: '0.8 hrs',
      desc: 'Propositional logic, syntax, semantics, truth tables, model checking, and entailment (KB ⊨ α).',
      href: '/learn/unit-1/knowledge-representation',
      kind: 'core',
    },
    {
      id: 'u1-first-order-logic',
      title: 'First-Order Logic (FOL) & Unification',
      hours: '1.2 hrs',
      desc: 'Predicates, quantifiers (∀, ∃), family tree relations, and the Most General Unifier (MGU) algorithm.',
      href: '/learn/unit-1/first-order-logic',
      kind: 'core',
    },
    {
      id: 'u1-rule-based-reasoning',
      title: 'Rule-Based Reasoning: Chaining',
      hours: '1.0 hrs',
      desc: 'Horn clauses, data-driven Forward Chaining vs goal-driven Backward Chaining proof tree visualizer.',
      href: '/learn/unit-1/rule-based-reasoning',
      kind: 'flagship',
    },
    {
      id: 'u1-expert-systems',
      title: 'Architecture of Expert Systems',
      hours: '0.8 hrs',
      desc: 'Knowledge base, inference engine, and the knowledge engineering acquisition lifecycle.',
      href: '/learn/unit-1/expert-systems',
      kind: 'core',
    },
    {
      id: 'u1-case-medical',
      title: 'Case Study: Medical Diagnosis System',
      hours: '0.5 hrs',
      desc: 'Clinical rule engine with interactive "Why did you ask?" and "How did you diagnose?" explanation inspector.',
      href: '/case-studies/medical-diagnosis',
      kind: 'case-study',
    },
    {
      id: 'u1-case-self-driving',
      title: 'Case Study: Self-Driving Vehicle',
      hours: '0.5 hrs',
      desc: 'Perception-action PEAS loop simulator with sensor fusion and trajectory planning rules.',
      href: '/case-studies/self-driving-vehicle',
      kind: 'case-study',
    },
    {
      id: 'u1-ethics-impact',
      title: 'Impact & Ethical Concerns',
      hours: '0.8 hrs',
      desc: 'Autonomous vehicle trolley dilemmas, recruitment algorithm demographic disparity, and copyright.',
      href: '/learn/unit-1/ethics-impact',
      kind: 'core',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-studio-200 pb-8 dark:border-studio-800">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-studio-500 hover:text-unit-1 mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Course Overview
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit" unit={1}>
            Unit 1 of 6
          </Badge>
          <span className="flex items-center text-xs text-studio-500 ml-auto">
            <Clock className="h-3.5 w-3.5 mr-1" />8 Syllabus Hours
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-5xl">
          Unit 1: Basics of Artificial Intelligence
        </h1>
        <p className="mt-4 text-base sm:text-lg text-studio-600 dark:text-studio-300 max-w-3xl leading-relaxed">
          Explore the philosophical roots, rational agent architectures, formal symbolic logic, and
          rule-based expert systems that laid the foundation for modern machine intelligence.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-studio-600 dark:text-studio-400 pt-4 border-t border-studio-100 dark:border-studio-800">
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-unit-1" />
            <span>
              <strong>CO1:</strong> Apply Principles of Perception, KR & Reasoning (L3)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-unit-1" />
            <span>
              <strong>CO4:</strong> Analyze Strengths & Limitations of Symbolic AI (L4)
            </span>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const progress = getProgress(m.id);
          const isDone = progress?.read && progress?.quizPassed;

          return (
            <Card key={m.id} interactive className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-studio-400">
                      {m.hours}
                    </span>
                    {isDone ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : m.kind === 'flagship' ? (
                      <Badge variant="unit" unit={1} size="sm">
                        Flagship Lab
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{m.desc}</CardDescription>
                </CardHeader>
              </div>

              <CardContent className="pt-3 border-t border-studio-100 dark:border-studio-800">
                <Link to={m.href}>
                  <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
                    <span>{isDone ? 'Review Concept' : 'Start Concept'}</span>
                    <span>→</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
