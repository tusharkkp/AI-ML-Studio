import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Cpu,
  Database,
  Network,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function LandingPage() {
  const units = [
    {
      number: 1,
      title: 'Basics of AI',
      hours: 8,
      accent: 'emerald',
      color: 'bg-emerald-500',
      icon: Cpu,
      description:
        'Rational agents, PEAS framework, First-Order Logic, inference engines, and expert systems.',
      href: '/learn/unit-1',
    },
    {
      number: 2,
      title: 'AI Search Strategies',
      hours: 8,
      accent: 'sky',
      color: 'bg-sky-500',
      icon: Compass,
      description:
        'Uninformed BFS/DFS races, A* admissibility, CSP constraint propagation, Minimax, and Genetic Algorithms.',
      href: '/learn/unit-2/bfs',
      activeBadge: 'Vertical Slice Ready',
    },
    {
      number: 3,
      title: 'ML Fundamentals',
      hours: 7,
      accent: 'amber',
      color: 'bg-amber-500',
      icon: Network,
      description:
        'Linear & polynomial regression, gradient descent contour dynamics, bias-variance tradeoff, and regularisation.',
      href: '/learn/unit-3',
    },
    {
      number: 4,
      title: 'Instances & Probabilistic Models',
      hours: 6,
      accent: 'violet',
      color: 'bg-violet-500',
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
      color: 'bg-rose-500',
      icon: Search,
      description:
        'Decision trees Gini/Entropy splitting, SVM maximum margins with 2D→3D kernel trick, and Bagging/Boosting ensembles.',
      href: '/learn/unit-5',
    },
    {
      number: 6,
      title: 'Unsupervised Learning',
      hours: 8,
      accent: 'teal',
      color: 'bg-teal-500',
      icon: BookOpen,
      description:
        'Apriori association rules, k-Means elbow/silhouette, Hierarchical dendrograms, DBSCAN density, and PCA axes rotation.',
      href: '/learn/unit-6',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-unit-2/10 border border-unit-2/20 text-unit-2 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          MIT AOE · B.Tech Third Year (2304322T)
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-6xl mb-6">
          AIML Studio
        </h1>

        <p className="font-display text-xl sm:text-2xl font-bold text-unit-2 mb-4">
          "Don't just read the algorithm. Watch it think, break it, fix it, and then code it."
        </p>

        <p className="text-base sm:text-lg text-studio-600 dark:text-studio-300 leading-relaxed mb-8 max-w-2xl mx-auto">
          An interactive, zero-cost, visual learning studio built specifically for the Rev. 2023 NEP
          Artificial Intelligence & Machine Learning syllabus.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/learn/unit-2/bfs">
            <Button variant="primary" size="lg" className="shadow-studio-lg">
              Explore Demo Vertical Slice (BFS)
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <a href="#units">
            <Button variant="outline" size="lg">
              View Syllabus Map (45 Hours)
            </Button>
          </a>
        </div>
      </div>

      {/* Course Outcomes (CO1 - CO4) */}
      <section className="mb-20">
        <h2 className="font-display text-xl font-bold text-center text-studio-900 dark:text-studio-50 mb-8">
          Target Course Outcomes (NEP Framework)
        </h2>
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
            <Card key={co.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" size="sm">
                  {co.id}
                </Badge>
                <span className="text-[11px] font-bold text-unit-2">{co.level}</span>
              </div>
              <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed font-medium">
                {co.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Unit Cards */}
      <section id="units" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-studio-900 dark:text-studio-50">
            Course Curriculum Units (45 Hours)
          </h2>
          <p className="text-sm text-studio-500 mt-2">
            Each unit is a complete interactive learning lab with step-through animations, quizzes,
            and code.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((u) => {
            const Icon = u.icon;
            return (
              <Card key={u.number} interactive className="flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${u.color}`}></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
                          Unit {u.number} · {u.hours} Hours
                        </span>
                      </div>
                      {u.activeBadge && (
                        <Badge variant="success" size="sm">
                          {u.activeBadge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-studio-700 dark:text-studio-300" />
                      {u.title}
                    </CardTitle>
                    <CardDescription>{u.description}</CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-4 border-t border-studio-100 dark:border-studio-800">
                  <Link to={u.href}>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span>Start Learning</span>
                      <ArrowRight className="h-4 w-4" />
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
