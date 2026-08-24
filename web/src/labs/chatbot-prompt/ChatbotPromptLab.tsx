import { useState, useId } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ElizaEngine } from '@/engines/chatbot/eliza/engine';
import type { ChatMessage } from '@/engines/chatbot/eliza/types';

interface PromptTechnique {
  id: string;
  name: string;
  category: string;
  promptText: string;
  simulatedOutput: string;
  tokenCost: 'low' | 'medium' | 'high';
  hallucinationRisk: 'high' | 'medium' | 'low' | 'very low';
  explanation: string;
}

const PROMPT_TECHNIQUES: PromptTechnique[] = [
  {
    id: 'zero-shot',
    name: '1. Zero-Shot Prompting',
    category: 'Baseline',
    promptText:
      'Classify the sentiment of this review: "The battery lasts only 2 hours, but screen is gorgeous."',
    simulatedOutput:
      'Mixed / Neutral (or sometimes just: "Negative" depending on model temperature)',
    tokenCost: 'low',
    hallucinationRisk: 'medium',
    explanation:
      'Directly poses the task with zero examples. Fast and cheap, but models often produce verbose or inconsistent formats.',
  },
  {
    id: 'few-shot',
    name: '2. Few-Shot Prompting (In-Context Learning)',
    category: 'Exemplars',
    promptText: `Classify sentiment into [Positive, Negative, Mixed]:
Review: "Loved the food, terrible waiter." -> Mixed
Review: "Fast shipping, great quality!" -> Positive
Review: "The battery lasts only 2 hours, but screen is gorgeous." ->`,
    simulatedOutput: 'Mixed',
    tokenCost: 'medium',
    hallucinationRisk: 'low',
    explanation:
      'Provides 2-3 input/output demonstrations. Anchors the output syntax and guides downstream classification with high consistency.',
  },
  {
    id: 'chain-of-thought',
    name: '3. Chain-of-Thought (CoT)',
    category: 'Multi-Step Reasoning',
    promptText: `A cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have? Let's think step by step:`,
    simulatedOutput: `1. The cafeteria started with 23 apples.
2. They used 20 for lunch, leaving: 23 - 20 = 3 apples.
3. They bought 6 more apples, bringing total to: 3 + 6 = 9 apples.
Answer: 9 apples.`,
    tokenCost: 'high',
    hallucinationRisk: 'very low',
    explanation:
      'Elicits intermediate reasoning steps ("think step by step"). Allows the model to allocate more tokens/compute to complex logic, dramatically reducing arithmetic errors.',
  },
  {
    id: 'role-schema',
    name: '4. System Role + Strict JSON Schema',
    category: 'Production API',
    promptText: `SYSTEM: You are an enterprise medical extraction engine. Output ONLY valid JSON conforming to: {"condition": string, "confidence": float, "urgency": "low"|"high"}.
USER: Patient reports acute chest pain radiating down left arm since 20 minutes ago.`,
    simulatedOutput: `{"condition": "Myocardial Infarction / Acute Coronary Syndrome", "confidence": 0.94, "urgency": "high"}`,
    tokenCost: 'medium',
    hallucinationRisk: 'very low',
    explanation:
      'Uses system prompt instructions with strict schema adherence. Critical for backend pipelines where software parsers must consume the output.',
  },
];

export function ChatbotPromptLab() {
  const [activeTab, setActiveTab] = useState<'eliza' | 'prompt'>('eliza');

  // ELIZA state
  const [engine] = useState(() => new ElizaEngine(42));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'eliza',
      text: 'Hello. I am ELIZA, your Rogerian non-directive psychotherapist. What is on your mind today?',
      timestamp: '12:00:00',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [lastMatch, setLastMatch] = useState<string>('INIT');

  const elizaInputId = useId();

  // Prompt Eng state
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string>('chain-of-thought');
  const activeTechnique =
    PROMPT_TECHNIQUES.find((t) => t.id === selectedTechniqueId) ?? PROMPT_TECHNIQUES[0]!;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend ?? inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    const res = engine.process(text);
    const elizaMsg: ChatMessage = {
      id: `e-${Date.now()}`,
      sender: 'eliza',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString(),
      matchedRulePattern: res.matchedPattern,
    };

    setMessages((prev) => [...prev, userMsg, elizaMsg]);
    setLastMatch(res.matchedPattern);
    setInputMessage('');
  };

  const samplePrompts = [
    'I am feeling very anxious about my exams.',
    'My mother always told me I should study medicine.',
    'Everyone is always ignoring my ideas.',
    'I feel like giving up because the pressure is too high.',
  ];

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Natural Language Processing Evolution
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            ELIZA Pattern Chatbot &amp; Prompt Engineering Lab
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === 'eliza' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('eliza')}
          >
            Classic ELIZA (1966 Symbolic AI)
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'prompt' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('prompt')}
          >
            Prompt Engineering (Modern LLMs)
          </Button>
        </div>
      </div>

      {activeTab === 'eliza' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-500">
              Rogerian Therapy Session (Prolog-style pattern matching)
            </span>
            <span className="text-xs font-mono text-warm-500">
              Active Decomposition Rule: <code className="text-accent-primary">{lastMatch}</code>
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 text-xs rounded-full border border-warm-200 dark:border-warm-800 hover:border-warm-400 bg-warm-50 dark:bg-warm-800/40 text-warm-700 dark:text-warm-300 transition-colors"
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>

          {/* Chat Messages Window */}
          <div className="h-64 overflow-y-auto border border-warm-200 dark:border-warm-800 rounded-xl p-4 space-y-3 bg-warm-50/60 dark:bg-warm-900/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-warm-400 font-mono">
                  <span>{m.sender === 'user' ? 'You' : 'ELIZA'}</span>
                  <span>&bull;</span>
                  <span>{m.timestamp}</span>
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 border border-warm-200 dark:border-warm-700 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex gap-2">
            <input
              id={elizaInputId}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tell ELIZA your thoughts (e.g. 'I am worried about my exams')..."
              className="flex-1 px-4 py-2 rounded-xl border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 text-xs focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Button size="sm" variant="primary" onClick={() => handleSendMessage()}>
              Send
            </Button>
          </div>
        </div>
      ) : (
        /* Prompt Engineering Sandbox */
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
              Select Prompt Engineering Technique:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PROMPT_TECHNIQUES.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechniqueId(tech.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedTechniqueId === tech.id
                      ? 'bg-accent-primary/10 border-accent-primary ring-1 ring-accent-primary'
                      : 'bg-warm-50 dark:bg-warm-800/40 border-warm-200 dark:border-warm-800 hover:border-warm-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-accent-primary block mb-0.5">
                    {tech.category}
                  </span>
                  <div className="font-bold text-xs text-warm-900 dark:text-warm-100">
                    {tech.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Technique Deep-Dive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prompt Card */}
            <Card className="p-4 border-warm-200 dark:border-warm-800 bg-warm-900 text-warm-100 font-mono text-xs">
              <span className="text-warm-400 font-bold block mb-2 uppercase text-[10px] font-sans">
                Prompt Sent to LLM Context Window:
              </span>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {activeTechnique.promptText}
              </pre>
            </Card>

            {/* Response Card */}
            <Card className="p-4 border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs font-mono">
              <span className="text-emerald-800 dark:text-emerald-200 font-bold block mb-2 uppercase text-[10px] font-sans">
                Simulated Output Response:
              </span>
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-900 dark:text-emerald-100">
                {activeTechnique.simulatedOutput}
              </pre>
            </Card>
          </div>

          {/* Telemetry / Tradeoff Card */}
          <div className="p-4 rounded-xl border border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-800/30 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-warm-900 dark:text-warm-100">
                Engineering Assessment: {activeTechnique.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={activeTechnique.tokenCost === 'high' ? 'warning' : 'default'}
                  size="sm"
                >
                  Tokens: {activeTechnique.tokenCost.toUpperCase()}
                </Badge>
                <Badge
                  variant={activeTechnique.hallucinationRisk === 'very low' ? 'success' : 'warning'}
                  size="sm"
                >
                  Hallucination Risk: {activeTechnique.hallucinationRisk.toUpperCase()}
                </Badge>
              </div>
            </div>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed font-sans">
              {activeTechnique.explanation}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
