import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { EthicsScenarioLab } from '@/labs/ethics/EthicsScenarioLab';
import { Link } from 'react-router-dom';

const ETHICS_QUIZ = [
  {
    id: 'eth-q1',
    question:
      'Why does "Fairness Through Blindness" (simply removing protected attributes like race, gender, or religion from the dataset) consistently fail to prevent algorithmic discrimination?',
    options: [
      {
        id: 'opt-a',
        text: 'Because machine learning models easily reconstruct protected attributes through correlated proxy variables (e.g. postal code, browsing history, vocabulary style, school attended)',
        isCorrect: true,
        explanation:
          'Correct! In modern high-dimensional datasets, redundant encoding allows models to infer protected attributes through proxy variables with near 100% accuracy even if the explicit column is removed.',
      },
      {
        id: 'opt-b',
        text: 'Because removing columns causes gradient descent to diverge',
        isCorrect: false,
        explanation:
          'Incorrect. Removing features is mathematically trivial in model training; the failure is semantic proxy leakage.',
      },
      {
        id: 'opt-c',
        text: 'Because the EU AI Act mandates that all protected attributes must be included in training data',
        isCorrect: false,
        explanation:
          'Incorrect. GDPR Article 9 generally prohibits processing special category data without specific legal exceptions.',
      },
      {
        id: 'opt-d',
        text: 'Because neural networks cannot train on less than 100 features',
        isCorrect: false,
        explanation: 'Incorrect. Neural nets train on any arbitrary number of input features.',
      },
    ],
  },
  {
    id: 'eth-q2',
    question:
      'What is the core conclusion of the Kleinberg-Chouldechova Impossibility Theorem regarding algorithmic fairness?',
    options: [
      {
        id: 'opt-a',
        text: 'It is mathematically impossible for an algorithm to satisfy both Calibration (Predictive Parity) and Equalized Odds (Equal False Positive Rates) simultaneously when base prevalence rates differ between groups',
        isCorrect: true,
        explanation:
          'Correct! Unless the base rate of the target condition is identical across groups or the model has 100% perfect prediction accuracy, calibration and error rate parity are mutually exclusive mathematical criteria.',
      },
      {
        id: 'opt-b',
        text: 'No algorithm can ever achieve more than 50% accuracy on social data',
        isCorrect: false,
        explanation:
          'Incorrect. Algorithms frequently achieve high statistical accuracy; the theorem proves mathematical tension between competing fairness definitions.',
      },
      {
        id: 'opt-c',
        text: 'Deep learning is inherently unconstitutional under all legal systems',
        isCorrect: false,
        explanation:
          'Incorrect. The theorem is a mathematical proof in probability theory, not a constitutional ruling.',
      },
      {
        id: 'opt-d',
        text: 'Fairness can only be achieved by adding random noise to outputs',
        isCorrect: false,
        explanation:
          'Incorrect. While randomized post-processing is one technique for equalizing odds, it is not the theorem conclusion.',
      },
    ],
  },
  {
    id: 'eth-q3',
    question:
      'Under the EEOC 4/5ths (80%) Rule for employment disparate impact, when is a selection procedure considered prima facie discriminatory?',
    options: [
      {
        id: 'opt-a',
        text: 'When the selection rate for a protected demographic group is less than 80% (4/5) of the selection rate of the group with the highest rate',
        isCorrect: true,
        explanation:
          'Correct! If Group A has a selection rate of 50%, any demographic group with a selection rate below 40% (0.80 × 50%) demonstrates adverse impact under US labor law.',
      },
      {
        id: 'opt-b',
        text: 'When less than 80% of candidates pass the coding test',
        isCorrect: false,
        explanation:
          'Incorrect. The rule measures the ratio of selection rates between demographic groups, not the absolute test pass rate.',
      },
      {
        id: 'opt-c',
        text: 'When the AI model was trained on less than 80% of the world languages',
        isCorrect: false,
        explanation:
          'Incorrect. The rule has nothing to do with linguistic diversity in NLP models.',
      },
      {
        id: 'opt-d',
        text: 'When 4 out of 5 human recruiters disagree with the AI',
        isCorrect: false,
        explanation:
          'Incorrect. The 4/5ths rule is an objective statistical disparity metric on selection outcomes.',
      },
    ],
  },
  {
    id: 'eth-q4',
    question:
      'Under the European Union AI Act, which of the following is classified as an "Unacceptable Risk" application of AI and strictly prohibited?',
    options: [
      {
        id: 'opt-a',
        text: 'Government social scoring systems and real-time remote biometric facial recognition in publicly accessible spaces for general surveillance',
        isCorrect: true,
        explanation:
          'Correct! The EU AI Act bans social scoring, cognitive behavioral manipulation targeting vulnerable individuals, and indiscriminate biometric scraping.',
      },
      {
        id: 'opt-b',
        text: 'Spam filters on email servers',
        isCorrect: false,
        explanation: 'Incorrect. Spam filters are classified as Minimal / No Risk.',
      },
      {
        id: 'opt-c',
        text: 'AI-assisted medical diagnosis software in hospitals',
        isCorrect: false,
        explanation:
          'Incorrect. Medical AI is classified as High-Risk, meaning it is permitted subject to strict conformity assessments, data quality standards, and human oversight.',
      },
      {
        id: 'opt-d',
        text: 'AI chess playing bots like Stockfish',
        isCorrect: false,
        explanation: 'Incorrect. Game playing algorithms fall under Minimal Risk.',
      },
    ],
  },
];

export function EthicsImpactPage() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Impact &amp; Ethical Concerns of AI
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.11
          </Badge>
          <Badge variant="default">Unit 1 &bull; 0.8 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Impact &amp; Ethical Concerns of Artificial Intelligence
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          Why algorithms are not morally neutral equations. Discover how historical biases
          contaminate training data, explore mathematical impossibility theorems of fairness, and
          examine global AI governance frameworks.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;In 2014, Amazon engineers built an automated recruitment tool to score software
            engineering resumes from 1 to 5 stars. By 2015, they realized the AI had taught itself
            that male candidates were preferable. It actively downgraded resumes containing the word
            &lsquo;women&rsquo;s&rsquo; and graduates of all-female universities. Amazon had to
            scrap the entire project because the historical data itself was poisoned by decades of
            male-dominated tech hiring.&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: Mathematical Models vs Human Inequity
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          There is a pervasive myth that algorithms are inherently objective because &ldquo;math
          cannot be racist or sexist&rdquo;. But machine learning models do not learn abstract
          platonic ideals; they minimize loss functions against <strong>historical data</strong>{' '}
          generated by flawed human institutions.
        </p>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          If past loan officers redlined minority neighborhoods, or past police arrests concentrated
          in specific ZIP codes due to over-patrolling, an algorithm trained on that data will
          faithfully replicate and amplify those injustices at unprecedented speed and scale.
        </p>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Perfect Fairness Myth
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            Suppose two demographic groups have different historical baseline rates for a condition
            (e.g. loan default or recidivism).
            <br />
            Can an AI engineer design a risk algorithm that achieves:
            <br />
            1. <strong>Predictive Parity:</strong> A score of 80% means an 80% chance for everyone.
            <br />
            2. <strong>Equal False Positive Rates:</strong> Innocent individuals in both groups have
            the exact same likelihood of being falsely flagged.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'yes' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('yes')}
            >
              Yes, with enough training data
            </Button>
            <Button
              variant={prediction === 'no' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('no')}
            >
              No, mathematically impossible (Kleinberg Theorem)
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'no' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Brilliant!</strong> Jon Kleinberg, Sendhil Mullainathan, and Alexandra
                  Chouldechova (2016) proved mathematically that unless prediction is 100%
                  clairvoyant or base rates are identical, these two desirable definitions of
                  fairness are mutually exclusive. Choosing fairness is a moral compromise, not a
                  coding problem.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Watch out!</strong> No amount of clean data or computing power can
                  overcome the laws of probability. When base rates differ, satisfying calibration
                  mathematically forces false positive rates to diverge. See the formal machinery
                  below!
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* 4. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Ethical Dilemma Workbench
          </h2>
          <Badge variant="unit" unit={1}>
            Case Simulator
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Explore hiring disparity thresholds, examine the COMPAS bail controversy, and review the
          ethical trade-offs of generative AI copyright.
        </p>

        <EthicsScenarioLab />
      </section>

      {/* 5. Formal Machinery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            The Formal Machinery: Fairness Metrics
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-warm-300 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30">
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              1. Demographic Parity (Statistical Parity)
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              Requires the likelihood of a positive decision Ŷ = 1 to be identical regardless of
              sensitive attribute A ∈ &#123;0, 1&#125;:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              P(Ŷ = 1 | A = 0) = P(Ŷ = 1 | A = 1)
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Equalized Odds (Hardt et al., 2016)
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              Requires both True Positive Rates (TPR) and False Positive Rates (FPR) to be equal
              across groups:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              P(Ŷ = 1 | A = 0, Y = y) = P(Ŷ = 1 | A = 1, Y = y) &nbsp;&nbsp; for y ∈ &#123;0,
              1&#125;
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              3. The US EEOC Disparate Impact (4/5ths Rule)
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              A selection process has adverse disparate impact if the selection rate for any
              protected group is less than 80% (4/5) of the highest rate:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              Disparity Ratio = Rate(Protected) / Rate(Majority) &ge; 0.80
            </div>
          </Card>
        )}
      </section>

      {/* 6. Regulatory Frameworks: EU AI Act */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Global Governance: The European Union AI Act (2024)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <Card className="p-4 border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20">
            <Badge variant="danger" size="sm">
              Risk Tier 1
            </Badge>
            <h4 className="font-bold text-rose-900 dark:text-rose-100 mt-1 mb-1">
              Unacceptable Risk
            </h4>
            <p className="text-warm-600 dark:text-warm-400">
              <strong>Status: BANNED.</strong> Social scoring by governments, behavioral
              manipulation of children, untargeted biometric web scraping.
            </p>
          </Card>

          <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <Badge variant="warning" size="sm">
              Risk Tier 2
            </Badge>
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mt-1 mb-1">High Risk</h4>
            <p className="text-warm-600 dark:text-warm-400">
              <strong>Status: HEAVILY REGULATED.</strong> Medical devices, critical infrastructure,
              credit scoring, recruitment algorithms, law enforcement.
            </p>
          </Card>

          <Card className="p-4 border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20">
            <Badge variant="unit" unit={1} size="sm">
              Risk Tier 3
            </Badge>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mt-1 mb-1">
              Specific Transparency
            </h4>
            <p className="text-warm-600 dark:text-warm-400">
              <strong>Status: OBLIGATION TO INFORM.</strong> Chatbots, deepfakes, AI-generated
              content (must notify users they are interacting with AI).
            </p>
          </Card>

          <Card className="p-4 border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <Badge variant="success" size="sm">
              Risk Tier 4
            </Badge>
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mt-1 mb-1">
              Minimal Risk
            </h4>
            <p className="text-warm-600 dark:text-warm-400">
              <strong>Status: UNRESTRICTED.</strong> AI video games, spam filters, recommendation
              feeds.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. Production Code: Auditing Disparity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: Algorithmic Fairness Audit
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`def audit_disparate_impact(y_pred, group_membership):
    """
    Computes selection rates and the EEOC 4/5ths Disparity Ratio.
    y_pred: list of boolean predictions (1 = Selected, 0 = Rejected)
    group_membership: list of group labels (0 = Protected, 1 = Reference)
    """
    group_0 = [p for p, g in zip(y_pred, group_membership) if g == 0]
    group_1 = [p for p, g in zip(y_pred, group_membership) if g == 1]
    
    rate_0 = sum(group_0) / len(group_0) if group_0 else 0.0
    rate_1 = sum(group_1) / len(group_1) if group_1 else 0.0
    
    disparity_ratio = (rate_0 / rate_1) if rate_1 > 0 else 0.0
    is_compliant = disparity_ratio >= 0.80
    
    return {
        "protected_selection_rate": rate_0,
        "reference_selection_rate": rate_1,
        "disparity_ratio": disparity_ratio,
        "passes_four_fifths_rule": is_compliant
    }

# Example: 1000 majority applicants (40% pass), 300 minority applicants (20% pass)
print(audit_disparate_impact([1]*400 + [0]*600 + [1]*60 + [0]*240, [1]*1000 + [0]*300))
# Result: {'disparity_ratio': 0.50, 'passes_four_fifths_rule': False} -> VIOLATION`}</pre>
        </Card>
      </section>

      {/* 8. Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout
            type="warning"
            title="Misconception: Fairness can be solved by simply gathering more data"
          >
            <p className="text-xs leading-relaxed">
              If an underlying social process is inequitable, collecting 100 times more data simply
              gives the algorithm 100 times more statistical power to replicate and reinforce that
              inequity with narrower confidence intervals.
            </p>
          </Callout>
          <Callout
            type="note"
            title="Misconception: Open-source AI models are immune to corporate ethics concerns"
          >
            <p className="text-xs leading-relaxed">
              Open-weight models democratize research and prevent corporate monopolies, but they
              also lower barriers for bad actors seeking to fine-tune unaligned models for phishing
              automation, automated propaganda, or malware generation without safety guardrails.
            </p>
          </Callout>
        </div>
      </section>

      {/* 9. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-ethics-impact" items={ETHICS_QUIZ} unitAccent={1} />
      </section>

      {/* 10. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam &amp; Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              University Exam Problem (5 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Explain four major ethical challenges posed by artificial intelligence in
              society. How does proxy discrimination undermine fairness through blindness?&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Marking points:</strong> State Algorithmic Bias, Autonomous Weaponry, Job
              Displacement, and Data Privacy/Copyright. Explain proxy variables: even if sensitive
              attribute (e.g. race) is omitted, correlations with postal codes or browsing patterns
              allow models to reconstruct the sensitive feature.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;What is the EU AI Act risk-based approach? Give an example of an Unacceptable
              Risk system.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong> The EU AI Act classifies AI into 4 tiers:
              Unacceptable (banned), High Risk (strict audits), Specific Transparency
              (notification), and Minimal (free). Example of Unacceptable: Government social scoring
              systems and real-time biometric mass surveillance in public spaces.
            </p>
          </div>
        </Card>
      </section>

      {/* 11. Summary and Navigation */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">Next Self-Study</span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Chatbot (ELIZA Engine) &amp; Prompt Engineering
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Inspect Joseph Weizenbaum&rsquo;s 1966 Rogerian therapist ELIZA, and master zero-shot,
              few-shot, and Chain-of-Thought prompting.
            </p>
          </div>
          <Link to="/learn/unit-1/chatbot-prompt-engineering">
            <Button variant="primary">Launch Chatbot &amp; Prompt Engineering &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
