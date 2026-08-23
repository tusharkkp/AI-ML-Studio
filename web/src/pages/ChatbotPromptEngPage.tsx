import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { ChatbotPromptLab } from '@/labs/chatbot-prompt/ChatbotPromptLab';
import { Link } from 'react-router-dom';

const CHATBOT_QUIZ = [
  {
    id: 'cb-q1',
    question: 'What is the "ELIZA Effect" in human-computer interaction and cognitive science?',
    options: [
      {
        id: 'opt-a',
        text: 'The subconscious psychological tendency of humans to attribute human-like consciousness, empathy, and deep understanding to computer programs that merely manipulate surface syntactic patterns',
        isCorrect: true,
        explanation:
          'Correct! When Joseph Weizenbaum created ELIZA in 1966, he was horrified to discover his own secretary and psychiatrists believed ELIZA truly understood them, despite knowing it was only executing shallow regex string transformations.',
      },
      {
        id: 'opt-b',
        text: 'The failure of chatbots to run on hardware with less than 16GB of RAM',
        isCorrect: false,
        explanation: 'Incorrect. ELIZA ran on an IBM 7094 with 32K 36-bit words of memory.',
      },
      {
        id: 'opt-c',
        text: 'The process of pronoun transposition in Prolog',
        isCorrect: false,
        explanation:
          'Incorrect. Pronoun transposition is a technical subroutine; the ELIZA effect is an anthropomorphic cognitive bias.',
      },
      {
        id: 'opt-d',
        text: 'The mathematical convergence rate of transformer self-attention',
        isCorrect: false,
        explanation: 'Incorrect. Transformers were invented 51 years after ELIZA.',
      },
    ],
  },
  {
    id: 'cb-q2',
    question:
      'Why does Chain-of-Thought (CoT) prompting ("Let\'s think step by step") dramatically improve LLM performance on multi-step reasoning problems?',
    options: [
      {
        id: 'opt-a',
        text: 'Because autoregressive language models allocate computation per token; generating intermediate reasoning tokens allows the model to compute sequential sub-goals rather than guessing the final answer in a single forward pass',
        isCorrect: true,
        explanation:
          'Correct! In a single forward pass, an LLM has a fixed depth of transformer layers. Generating tokens for step 1, step 2, etc., allows the attention heads to condition each successive calculation on the verified results of prior steps.',
      },
      {
        id: 'opt-b',
        text: 'Because it re-trains the neural network weights on the user GPU in real time',
        isCorrect: false,
        explanation:
          'Incorrect. Prompting does not update model weights (in-context learning is pure forward pass inference).',
      },
      {
        id: 'opt-c',
        text: 'Because it translates the prompt from English into First-Order Logic',
        isCorrect: false,
        explanation: 'Incorrect. CoT prompting operates in natural language tokens.',
      },
      {
        id: 'opt-d',
        text: 'Because it disables the softmax activation layer',
        isCorrect: false,
        explanation:
          'Incorrect. Softmax remains active for every next-token probability distribution.',
      },
    ],
  },
  {
    id: 'cb-q3',
    question: "How did Joseph Weizenbaum's 1966 ELIZA program emulate a Rogerian psychotherapist?",
    options: [
      {
        id: 'opt-a',
        text: "By using non-directional reflection: decomposing the patient's statements, transposing pronouns (I → you), and reassembling them into open-ended questions without claiming medical expertise",
        isCorrect: true,
        explanation:
          "Correct! Carl Rogers' non-directive therapy involves reflecting the patient's thoughts back to them, making it the ideal domain for a symbolic system with zero real-world knowledge.",
      },
      {
        id: 'opt-b',
        text: 'By querying a vast database of 100,000 DSM-5 psychiatric diagnoses',
        isCorrect: false,
        explanation:
          'Incorrect. ELIZA had zero psychiatric knowledge; it had approximately 200 lines of string substitution rules.',
      },
      {
        id: 'opt-c',
        text: 'By training an early convolutional neural network on audio recordings of therapy sessions',
        isCorrect: false,
        explanation:
          'Incorrect. ELIZA was purely symbolic text processing written in SLIP (Symmetric List Processor).',
      },
      {
        id: 'opt-d',
        text: 'By using reinforcement learning from human feedback (RLHF)',
        isCorrect: false,
        explanation: 'Incorrect. RLHF was developed in 2017–2022 for modern LLMs.',
      },
    ],
  },
  {
    id: 'cb-q4',
    question: 'In Few-Shot Prompting, what is the primary function of the provided exemplars?',
    options: [
      {
        id: 'opt-a',
        text: 'To demonstrate the desired output format, tone, and reasoning pattern in-context without updating model parameters',
        isCorrect: true,
        explanation:
          'Correct! Few-shot prompting primes the attention heads by providing examples directly in the context window, guiding the model toward consistent structured outputs.',
      },
      {
        id: 'opt-b',
        text: 'To fine-tune the low-rank adapters (LoRA) on the server',
        isCorrect: false,
        explanation: 'Incorrect. Exemplars in prompt text do not perform parameter updates.',
      },
      {
        id: 'opt-c',
        text: 'To bypass the model token context limit',
        isCorrect: false,
        explanation: 'Incorrect. Exemplars consume context window tokens.',
      },
      {
        id: 'opt-d',
        text: 'To translate Python code into Prolog',
        isCorrect: false,
        explanation: 'Incorrect. Few-shot is a general meta-learning prompting framework.',
      },
    ],
  },
];

export function ChatbotPromptEngPage() {
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
          Chatbots &amp; Prompt Engineering
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.12
          </Badge>
          <Badge variant="default">Self-Study &bull; 1.0 Hour</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          From ELIZA to Prompt Engineering: Conversational AI
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          Trace the 60-year arc of conversational agents: from Joseph Weizenbaum&rsquo;s 1966
          pattern-matching psychotherapist to modern in-context learning with Large Language Models.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;In 1966, MIT computer scientist Joseph Weizenbaum wrote a simple 200-line script
            called ELIZA. Within weeks, his own staff asked him to leave the room while they poured
            their most intimate marital, financial, and emotional troubles into the terminal.
            Weizenbaum was terrified: why do humans so eagerly project empathy and soul onto a
            shallow mirror of string substitution rules?&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: Two Eras of Conversation
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          Conversational systems fall into two fundamentally distinct paradigms:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400">
              1966–2010s
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              Symbolic Pattern Matching (ELIZA / AIML)
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Decomposes inputs using regular expressions, transposes pronouns (
              <code>I &rarr; you</code>), and inserts extracted fragments into hand-crafted response
              templates. Zero understanding, zero learning.
            </p>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">
              2020s–Present
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              Generative LLMs &amp; Prompt Engineering
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Billions of transformer parameters predicting next tokens. Controlled through prompt
              techniques: Zero-shot, Few-shot demonstrations, and Chain-of-Thought (CoT) multi-step
              reasoning.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Math Word Problem
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            You ask an LLM: &ldquo;Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How
            many does he have?&rdquo;
            <br />
            Prompt A: Simply asks the question.
            <br />
            Prompt B: Adds <em>&ldquo;Let&rsquo;s think step by step.&rdquo;</em> to the end of the
            question.
            <br />
            Why does Prompt B dramatically outperform Prompt A on complex math and logic benchmarks?
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'tokens' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('tokens')}
            >
              Forces intermediate reasoning tokens (CoT)
            </Button>
            <Button
              variant={prediction === 'speed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('speed')}
            >
              Makes the GPU run faster
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'tokens' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Spot on!</strong> Autoregressive language models cannot &ldquo;pause to
                  think&rdquo; internally. In a single forward pass, the model must output the very
                  next token. By forcing it to output intermediate tokens (&ldquo;First, 2 cans of 3
                  = 6... then 5 + 6 = 11&rdquo;), the model attends to its own intermediate
                  scratchpad!
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Not quite.</strong> The GPU hardware clock does not change. The secret is
                  token generation: each generated intermediate word expands the attention context
                  for subsequent tokens, allowing sequential reasoning.
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
            Interactive Chatbot &amp; Prompt Workbench
          </h2>
          <Badge variant="unit" unit={1}>
            Dual Era Sandbox
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Chat with the pure TypeScript 1966 ELIZA psychotherapist or compare modern LLM prompting
          strategies (Zero-shot, Few-shot, Chain-of-Thought, JSON Schema).
        </p>

        <ChatbotPromptLab />
      </section>

      {/* 5. Hand-Worked Example: ELIZA Mechanics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Hand-Worked Example: How ELIZA Works
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Let&rsquo;s trace the instructor&rsquo;s <code>eliza.pl</code> Prolog pattern matching
          engine:
        </p>

        <div className="space-y-3 text-xs font-mono">
          <Card className="p-3 border-warm-200 dark:border-warm-800">
            <span className="text-warm-500 font-bold font-sans">1. User Input</span>
            <p className="mt-1 text-warm-900 dark:text-warm-100">
              &ldquo;I am feeling anxious about my exams&rdquo;
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800">
            <span className="text-warm-500 font-bold font-sans">
              2. Decomposition Pattern Match
            </span>
            <p className="mt-1">
              Pattern: <code>/I am (.*)/i</code> &rarr; Matches! Captured fragment:{' '}
              <code>&ldquo;feeling anxious about my exams&rdquo;</code>
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800">
            <span className="text-warm-500 font-bold font-sans">
              3. Pronoun Transposition Table
            </span>
            <p className="mt-1">
              <code>I &rarr; you</code>, <code>my &rarr; your</code>, <code>me &rarr; you</code>.
              <br />
              Transposed: <code>&ldquo;feeling anxious about your exams&rdquo;</code>
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800">
            <span className="text-warm-500 font-bold font-sans">4. Reassembly Rule Template</span>
            <p className="mt-1">
              Template: <code>&ldquo;Did you come to me because you are $1?&rdquo;</code>
              <br />
              <strong>Final Output:</strong> &ldquo;Did you come to me because you are feeling
              anxious about your exams?&rdquo;
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Formal Machinery: Prompt Taxonomy */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            The Formal Machinery: The Prompt Engineering Taxonomy
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-warm-300 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30">
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              1. Autoregressive Language Modeling
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              A causal language model factorizes the joint probability of a sequence of tokens $w_1,
              \dots, w_T$ into conditional next-token probabilities:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              P(w₁, w₂, ..., w_T) = ∏_(t=1)^T P(w_t | w₁, ..., w_(t-1))
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Temperature and Nucleus (Top-p) Sampling
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              Logits $z_i$ are converted to probabilities via temperature-scaled softmax:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              P(w_i) = exp(z_i / T) / ∑_j exp(z_j / T)
            </div>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              When T → 0 (greedy decoding), the model deterministically picks the highest
              probability token. High T &gt; 1.0 flattens the distribution for creative generation.
            </p>
          </Card>
        )}
      </section>

      {/* 7. Production Python Snippet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: ELIZA Regex Engine
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`import re

PRONOUNS = {"i": "you", "my": "your", "me": "you", "am": "are"}

def transpose(text):
    words = [PRONOUNS.get(w.lower(), w) for w in text.split()]
    return " ".join(words)

RULES = [
    (r"I am (.*)", [
        "Did you come to me because you are {0}?",
        "How long have you been {0}?"
    ]),
    (r"My (mother|father|family) (.*)", [
        "Tell me more about your family.",
        "How does your family influence your feelings?"
    ])
]

def eliza_respond(user_input):
    for pattern, templates in RULES:
        match = re.search(pattern, user_input, re.IGNORECASE)
        if match:
            fragment = transpose(match.group(1))
            return templates[0].format(fragment)
    return "Please tell me more about that."

print(eliza_respond("I am feeling overwhelmed by work"))
# Result: "Did you come to me because you are feeling overwhelmed by work?"`}</pre>
        </Card>
      </section>

      {/* 8. Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout type="warning" title="Misconception: Chatbots understand what they are saying">
            <p className="text-xs leading-relaxed">
              Neither ELIZA nor modern GPT models possess subjective consciousness, beliefs, or
              moral intentionality (John Searle&rsquo;s <em>Chinese Room Argument</em>). ELIZA
              manipulates surface syntax with regex; modern LLMs manipulate continuous statistical
              vector distributions.
            </p>
          </Callout>
          <Callout
            type="note"
            title="Misconception: Prompt engineering will be obsolete in 2 years"
          >
            <p className="text-xs leading-relaxed">
              While trivial prompt phrasing tricks may fade as models improve, structured prompt
              engineering—specifying system schemas, decomposition workflows, and tool execution
              protocols—remains the fundamental programming interface for cognitive AI
              architectures.
            </p>
          </Callout>
        </div>
      </section>

      {/* 9. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-self-chatbot" items={CHATBOT_QUIZ} unitAccent={1} />
      </section>

      {/* 10. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam &amp; Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              University Exam Problem (4 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;What was ELIZA? Explain the mechanism of decomposition and reassembly rules in
              early chatbots.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Answer:</strong> ELIZA was a 1966 symbolic NLP program created by Joseph
              Weizenbaum. It parsed user sentences against decomposition patterns (e.g.{' '}
              <code>* I feel *</code>), extracted variables, flipped pronouns (I &rarr; you), and
              inserted the transformed phrase into pre-defined reassembly templates.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Explain the difference between Zero-Shot, Few-Shot, and Chain-of-Thought
              prompting.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong> Zero-shot asks for a direct answer without examples.
              Few-shot includes 2&ndash;3 input-output demonstration pairs in context to lock
              format. Chain-of-Thought instructs the model to generate sequential intermediate
              reasoning steps before declaring the final conclusion.
            </p>
          </div>
        </Card>
      </section>

      {/* 11. Summary and Navigation */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">
              Next: Further Reading
            </span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Artificial General Intelligence (AGI) Frontiers
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Explore the Chinese Room argument, the Singularity, superintelligence, and the AI
              alignment problem.
            </p>
          </div>
          <Link to="/learn/unit-1/agi">
            <Button variant="primary">Explore AGI Frontiers &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
