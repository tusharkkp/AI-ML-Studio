import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Link } from 'react-router-dom';

interface ChineseRoomStep {
  inputChinese: string;
  ruleMatched: string;
  outputChinese: string;
  englishMeaning: string;
}

const CHINESE_ROOM_EXAMPLES: ChineseRoomStep[] = [
  {
    inputChinese: '你好吗？',
    ruleMatched: 'Rule #402: When sequence [你, 好, 吗] appears, output [我, 很, 好]',
    outputChinese: '我很好。',
    englishMeaning: '"How are you?" -> "I am very good."',
  },
  {
    inputChinese: '今天天气怎么样？',
    ruleMatched: 'Rule #819: When sequence [天, 气] appears, output [今, 天, 晴, 朗]',
    outputChinese: '今天晴朗。',
    englishMeaning: '"How is the weather today?" -> "It is sunny today."',
  },
  {
    inputChinese: '什么是意识？',
    ruleMatched: 'Rule #1204: When sequence [意, 识] appears, output [电, 脑, 算, 法]',
    outputChinese: '电脑算法。',
    englishMeaning: '"What is consciousness?" -> "Computer algorithms."',
  },
];

export function AgiFrontiersPage() {
  const [selectedRoomStep, setSelectedRoomStep] = useState<number>(0);
  const [userPollAnswer, setUserPollAnswer] = useState<string | null>(null);

  const activeStep = CHINESE_ROOM_EXAMPLES[selectedRoomStep]!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Further Reading: AGI Frontiers
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Further Reading
          </Badge>
          <Badge variant="default">Unit 1 &bull; 0.5 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Frontiers of Artificial General Intelligence (AGI)
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          From the Chinese Room argument to Nick Bostrom&rsquo;s Superintelligence: explore the
          philosophical foundations, consciousness debates, and existential safety challenges of
          human-level machine intellect.
        </p>
      </header>

      {/* 1. What is AGI? */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Defining the Horizon: ANI vs AGI vs ASI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-blue-600">Narrow AI (ANI)</span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mt-1 mb-1">Current State</h4>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              Excells at specific tasks (e.g. AlphaFold protein folding, chess, radiology). Lacks
              cross-domain transfer or autonomous goal formulation.
            </p>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800 bg-accent-primary/5 border-accent-primary/30">
            <span className="text-xs uppercase font-bold text-accent-primary">
              General AI (AGI)
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mt-1 mb-1">Human Parity</h4>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              Can learn, reason, generalize, and adapt to any intellectual task a human can perform,
              including novel scientific discovery and economic production.
            </p>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-purple-600">
              Superintelligence (ASI)
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mt-1 mb-1">Post-Human Era</h4>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              An intellect that vastly outperforms the best human minds in every field: scientific
              creativity, strategic wisdom, and social skills (Bostrom, 2014).
            </p>
          </Card>
        </div>
      </section>

      {/* 2. Interactive Chinese Room Experiment */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Thought Experiment: Searle&rsquo;s Chinese Room (1980)
          </h2>
          <Badge variant="unit" unit={1}>
            Philosophical Simulator
          </Badge>
        </div>
        <p className="text-sm text-warm-700 dark:text-warm-300 leading-relaxed">
          Imagine a human who understands zero Chinese locked in a room. Slips of paper with Chinese
          characters are slipped under the door. The human looks up the symbols in a giant English
          rulebook and outputs the matching response. To someone outside the room, the room speaks
          fluent Chinese!
        </p>

        <Card className="p-5 border-warm-200 dark:border-warm-800 bg-warm-50/70 dark:bg-warm-900/40">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold uppercase text-warm-500">
              Select Input Slip Passed Under the Door:
            </span>
            <div className="flex gap-1.5">
              {CHINESE_ROOM_EXAMPLES.map((_, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={selectedRoomStep === idx ? 'primary' : 'outline'}
                  onClick={() => setSelectedRoomStep(idx)}
                >
                  Prompt {idx + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono mb-4">
            <div className="p-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
              <span className="text-warm-400 block mb-1">1. Incoming Chinese Slip</span>
              <div className="text-xl font-bold text-warm-900 dark:text-warm-100">
                {activeStep.inputChinese}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
              <span className="text-warm-400 block mb-1">2. Mechanical Rule Lookup</span>
              <div className="text-xs text-accent-primary font-bold">{activeStep.ruleMatched}</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
              <span className="text-warm-400 block mb-1">3. Returned Response Slip</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeStep.outputChinese}
              </div>
              <span className="text-[10px] text-warm-500 font-sans block mt-1">
                {activeStep.englishMeaning}
              </span>
            </div>
          </div>

          {/* User Philosophical Poll */}
          <div className="p-4 rounded-xl bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
            <p className="text-xs font-bold text-warm-900 dark:text-warm-100 mb-3">
              Philosophical Question: Does the person inside the room actually understand Chinese?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={userPollAnswer === 'no' ? 'primary' : 'outline'}
                onClick={() => setUserPollAnswer('no')}
              >
                No, syntax is not semantics (Searle&rsquo;s View)
              </Button>
              <Button
                size="sm"
                variant={userPollAnswer === 'yes' ? 'primary' : 'outline'}
                onClick={() => setUserPollAnswer('yes')}
              >
                Yes, the entire System understands (The Systems Reply)
              </Button>
            </div>

            {userPollAnswer && (
              <div className="mt-3 p-3 rounded bg-warm-50 dark:bg-warm-900 text-xs text-warm-700 dark:text-warm-300">
                {userPollAnswer === 'no' ? (
                  <p>
                    <strong>Searle&rsquo;s Thesis:</strong> Computer programs manipulate formal
                    symbols without any reference to their meanings.{' '}
                    <em>
                      &ldquo;Syntax alone is neither constitutive of nor sufficient for
                      semantics.&rdquo;
                    </em>{' '}
                    A digital computer can never achieve true understanding purely by running code.
                  </p>
                ) : (
                  <p>
                    <strong>The Systems Reply:</strong> While the man inside does not understand
                    Chinese, the <em>whole system</em>—the man, the rulebook, and the scratchpad—as
                    a unified computational entity DOES understand Chinese, just as no single neuron
                    in your brain understands English!
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* 3. The AI Alignment Problem */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          The AI Alignment Problem: Instrumental Convergence
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Nick Bostrom (Oxford Future of Humanity Institute) identified two foundational theorems
          governing superintelligent agents:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 border-warm-200 dark:border-warm-800 space-y-2">
            <span className="font-bold uppercase text-accent-primary">Theorem 1</span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm">
              The Orthogonality Thesis
            </h4>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              Intelligence and final goals are completely orthogonal. An AI could possess god-like
              cognitive ability and be purely motivated by a trivial objective (e.g. computing
              decimal digits of $\pi$ or manufacturing paperclips).
            </p>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800 space-y-2">
            <span className="font-bold uppercase text-accent-primary">Theorem 2</span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm">
              Instrumental Convergence
            </h4>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              Regardless of what an agent&rsquo;s ultimate goal is, almost all intelligent agents
              will converge on the same instrumental sub-goals:
              <br />
              1. <em>Self-Preservation</em> (you cannot fetch the coffee if you are dead).
              <br />
              2. <em>Resource Acquisition</em> (more computing power aids goal attainment).
              <br />
              3. <em>Goal-Content Integrity</em> (prevent humans from modifying its code).
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Critical Assessment & Wrap-Up */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Modern Perspective: Are LLMs on the Path to AGI?
        </h2>
        <div className="space-y-3">
          <Callout type="note" title="The Scaling Hypothesis vs The Neuro-Symbolic View">
            <p className="text-xs leading-relaxed">
              Proponents of the <strong>Scaling Hypothesis</strong> argue that next-token prediction
              across multimodal tokens (text, video, robotics actions) with larger parameter counts
              and RL compute will organically induce world models and true AGI. Conversely,{' '}
              <strong>Neuro-Symbolic</strong> researchers (like Gary Marcus and Judea Pearl)
              maintain that deep learning cannot perform causal reasoning or formal mathematical
              proofs without symbolic knowledge structures—the very foundation explored in this
              unit!
            </p>
          </Callout>
        </div>
      </section>

      {/* 5. Summary & Navigation */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">Unit 1 Capstone</span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Unit 1 Comprehensive Exam &amp; Printable Cheat Sheet
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Test your mastery with the 20-question timed practice exam or download the revision
              summary cheat sheet.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/cheatsheets/unit-1">
              <Button variant="outline">Print Cheat Sheet</Button>
            </Link>
            <Link to="/learn/unit-1/exam">
              <Button variant="primary">Start Practice Exam &rarr;</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
