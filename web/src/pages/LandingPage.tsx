import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Cpu,
  Database,
  Network,
  Search,
  ArrowUpRight,
  ChevronsDown,
  ArrowRight,
} from 'lucide-react';
import { Badge, AnimatedBadge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function LandingPage() {
  const units = [
    {
      number: 1,
      title: 'Basics of AI',
      hours: 8,
      accent: 'emerald',
      icon: Cpu,
      description:
        'Rational agents, PEAS framework, First-Order Logic, inference engines, and expert systems.',
      href: '/learn/unit-1',
      activeBadge: 'Unit 1 Complete',
    },
    {
      number: 2,
      title: 'AI Search Strategies',
      hours: 8,
      accent: 'sky',
      icon: Compass,
      description:
        'Uninformed BFS and DFS races, A* admissibility, CSP constraint propagation, Minimax, and Genetic Algorithms.',
      href: '/learn/unit-2/bfs',
      activeBadge: 'Vertical Slice Ready',
    },
    {
      number: 3,
      title: 'ML Fundamentals',
      hours: 7,
      accent: 'amber',
      icon: Network,
      description:
        'Linear and polynomial regression, gradient descent contour dynamics, bias-variance tradeoff, and regularisation.',
      href: '/learn/unit-3',
    },
    {
      number: 4,
      title: 'Instances & Probabilistic Models',
      hours: 6,
      accent: 'violet',
      icon: Database,
      description:
        'Bayes Theorem natural frequencies, Naive Bayes, Logistic Regression decision boundaries, ROC-AUC curves, and k-NN.',
      href: '/learn/unit-4',
    },
    {
      number: 5,
      title: 'Linear & Decision Models',
      hours: 8,
      accent: 'rose',
      icon: Search,
      description:
        'Decision trees Gini and Entropy splitting, SVM maximum margins with kernel trick, and Bagging and Boosting ensembles.',
      href: '/learn/unit-5',
    },
    {
      number: 6,
      title: 'Unsupervised Learning',
      hours: 8,
      accent: 'teal',
      icon: BookOpen,
      description:
        'Apriori association rules, k-Means elbow and silhouette, Hierarchical dendrograms, DBSCAN density, and PCA axes rotation.',
      href: '/learn/unit-6',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
        <AnimatedBadge className="mb-6">MIT AOE · Third Year B.Tech (2304322T)</AnimatedBadge>

        <h1 className="text-[42px] font-semibold tracking-tight leading-tight md:text-6xl lg:text-7xl text-foreground mb-4 font-display">
          AIML Studio
        </h1>

        <p className="mt-2 max-w-2xl text-base text-neutral-700 sm:text-lg md:text-xl dark:text-neutral-400 leading-relaxed">
          Don't just read the algorithm.{' '}
          <span className="highlight">Watch it think, break it, fix it, and then code it</span>.
        </p>

        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
          An interactive learning studio tailored Artificial Intelligence and Machine Learning
          syllabus.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/learn/unit-1"
            className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Start Unit 1: AI Basics
            <ArrowUpRight className="-ml-1 size-4" aria-hidden="true" />
          </Link>
          <a
            href="#units"
            className="btn-asym-mirror inline-flex h-9 items-center gap-2 border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Explore syllabus
            <ChevronsDown className="-ml-1 size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Course Outcomes (CO1 - CO4) */}
      <section className="mb-20">
        <h2 className="text-2xl font-medium sm:text-[30px] text-center text-foreground mb-3 font-display">
          Target course outcomes
        </h2>
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto">
          Aligned with the NEP engineering framework: from fundamental{' '}
          <span className="highlight">knowledge representation</span> to model evaluation.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'CO1',
              level: 'L3 Apply',
              desc: 'Apply principles of Perception, Knowledge Representation, Inference, Reasoning and Search.',
            },
            {
              id: 'CO2',
              level: 'L3 Apply',
              desc: 'Use ML statistical algorithms on real-world engineering applications.',
            },
            {
              id: 'CO3',
              level: 'L4 Evaluate',
              desc: 'Evaluate ML models through systematic hyper-parameter optimization.',
            },
            {
              id: 'CO4',
              level: 'L4 Analyze',
              desc: 'Analyze strengths, failure modes, and fundamental limitations of AI/ML approaches.',
            },
          ].map((co) => (
            <Card key={co.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" size="sm">
                    {co.id}
                  </Badge>
                  <span className="text-[11px] font-mono text-neutral-500">{co.level}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {co.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Unit Cards */}
      <section id="units" className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
            Course curriculum units
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl mx-auto">
            Explore 45 lecture hours of interactive labs with{' '}
            <span className="highlight">step-through animations</span>, quizzes, and live code.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((u) => {
            const Icon = u.icon;
            return (
              <Card key={u.number} className="flex flex-col justify-between group">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-500">
                          Unit {u.number} · {u.hours} Hours
                        </span>
                      </div>
                      {u.activeBadge && (
                        <Badge variant="success" size="sm">
                          {u.activeBadge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Icon className="h-4 w-4 text-neutral-500" />
                      {u.title}
                    </CardTitle>
                    <CardDescription>{u.description}</CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-4 border-t border-card-edge">
                  <Link to={u.href}>
                    <Button variant="secondary" size="sm" className="w-full justify-between">
                      <span>Start learning</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
