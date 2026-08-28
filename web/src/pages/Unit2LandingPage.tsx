import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Unit2LandingPage() {
  const getProgress = useProgressStore((state) => state.getConceptProgress);

  const modules = [
    {
      id: 'u2-state-space-search',
      title: 'State-Space Search & Problem Formulation',
      hours: '0.8 hrs',
      desc: 'Formulate abstract puzzles into 5-tuples: state space, actions, transitions, and the Missionaries & Cannibals river crossing lab.',
      href: '/learn/unit-2/state-space-search',
      kind: 'core',
    },
    {
      id: 'u2-uninformed-search',
      title: 'Uninformed Search: DFS, DLS, IDDFS & Bidirectional',
      hours: '1.2 hrs',
      desc: 'Comparative search race on mazes: understand why IDDFS achieves BFS optimality with DFS linear memory.',
      href: '/learn/unit-2/uninformed-search',
      kind: 'flagship',
    },
    {
      id: 'u2-bfs',
      title: 'Breadth-First Search (BFS) in Action',
      hours: '0.8 hrs',
      desc: 'Warehouse robot grid simulator with queue frontier expansion, early goal testing, and completeness guarantees.',
      href: '/learn/unit-2/bfs',
      kind: 'core',
    },
    {
      id: 'u2-informed-search',
      title: 'Informed Search: Greedy Best-First, A* & Admissibility',
      hours: '1.2 hrs',
      desc: 'Heuristic evaluation f = g + h, admissibility proofs h(n) <= h*(n), and consistency triangle inequality.',
      href: '/learn/unit-2/informed-search',
      kind: 'flagship',
    },
    {
      id: 'u2-local-search',
      title: 'Local Search & Optimization: Hill Climbing',
      hours: '0.8 hrs',
      desc: 'Steepest ascent, local maxima traps, plateaux, ridges, and Simulated Annealing thermal escapes.',
      href: '/learn/unit-2/local-search',
      kind: 'core',
    },
    {
      id: 'u2-case-gps',
      title: 'Case Study 1: GPS Navigation Route Planner',
      hours: '0.6 hrs',
      desc: 'Real-world road network graph search with A*, straight-line distance heuristics, and traffic multipliers.',
      href: '/case-studies/gps-navigation',
      kind: 'case-study',
    },
    {
      id: 'u2-csp',
      title: 'Constraint Satisfaction Problems (CSP) & AC-3',
      hours: '1.0 hrs',
      desc: 'Variables, domains, and constraints: Arc Consistency (AC-3), MRV fail-first, and Australia Map Coloring.',
      href: '/learn/unit-2/csp',
      kind: 'flagship',
    },
    {
      id: 'u2-adversarial-search',
      title: 'Adversarial Search: Minimax & Alpha-Beta Pruning',
      hours: '1.0 hrs',
      desc: 'Zero-sum game trees, minimax recursion, and pruning efficiency effectively doubling search depth.',
      href: '/learn/unit-2/adversarial-search',
      kind: 'flagship',
    },
    {
      id: 'u2-case-chess',
      title: 'Case Study 2: Chess Game Playing Engine',
      hours: '0.6 hrs',
      desc: 'Piece-square tables, board evaluation functions, the Horizon Effect, and Quiescence search.',
      href: '/case-studies/chess-game-engine',
      kind: 'case-study',
    },
    {
      id: 'u2-genetic-algorithms',
      title: 'Self-Study: Genetic Algorithms (GA)',
      hours: '0.6 hrs',
      desc: 'Evolutionary optimization: bit-string chromosomes, fitness functions, crossover, and mutation.',
      href: '/learn/unit-2/genetic-algorithms',
      kind: 'self-study',
    },
    {
      id: 'u2-game-theory',
      title: 'Further Reading: Game Theory & Nash Equilibrium',
      hours: '0.4 hrs',
      desc: 'Prisoner&apos;s Dilemma, payoff matrices, dominant strategies, and multi-agent strategic rationality.',
      href: '/learn/unit-2/game-theory',
      kind: 'further-reading',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      {/* Header */}
      <div className="border-b border-card-edge pb-8">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-mono text-neutral-500 hover:text-brand mb-4 transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1" />
          Back to Course Overview
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" size="sm">
            Unit 2 of 6
          </Badge>
          <span className="flex items-center text-xs text-neutral-500 ml-auto font-mono">
            <Clock className="size-3.5 mr-1" />8 Syllabus Hours
          </span>
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Unit 2: AI Search Strategies
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl leading-relaxed">
          From blind exploration to heuristic navigation: master state spaces, uninformed races,{' '}
          <span className="highlight">optimal A* search</span>, constraint satisfaction, and
          adversarial game trees.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-card-edge">
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Award className="size-4 text-sky-500" />
              <span>
                <strong>CO1:</strong> Apply Principles of Search in Problem Solving (L3)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-sky-500" />
              <span>
                <strong>CO4:</strong> Analyze Search Complexities &amp; Failure Modes (L4)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/cheatsheets/unit-2">
              <Button variant="secondary" size="sm">
                Revision cheat sheet
              </Button>
            </Link>
            <Link to="/learn/unit-2/exam">
              <Button variant="solid" size="sm">
                Take unit exam
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const progress = getProgress(m.id);
          const isDone = progress?.read && progress?.quizPassed;

          return (
            <Card key={m.id} className="flex flex-col justify-between group">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-neutral-500">{m.hours}</span>
                    {isDone ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="size-3 mr-1" />
                        Completed
                      </Badge>
                    ) : m.kind === 'flagship' ? (
                      <Badge variant="outline" size="sm">
                        Flagship lab
                      </Badge>
                    ) : m.kind === 'case-study' ? (
                      <Badge variant="outline" size="sm">
                        Case study
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-base text-foreground">{m.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{m.desc}</CardDescription>
                </CardHeader>
              </div>

              <CardContent className="pt-3 border-t border-card-edge">
                <Link to={m.href}>
                  <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
                    <span>{isDone ? 'Review concept' : 'Start concept'}</span>
                    <span>&rarr;</span>
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
