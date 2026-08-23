import type { QuizItem } from './Quiz';

export const UNIT1_QUESTION_BANK: (QuizItem & { outcome: 'CO1' | 'CO4'; topic: string })[] = [
  // 1. History & Foundations
  {
    id: 'u1-bank-01',
    topic: 'History & Foundations',
    outcome: 'CO1',
    question:
      'In Alan Turing\'s seminal 1950 paper "Computing Machinery and Intelligence", what was the original name of the test now called the Turing Test?',
    options: [
      {
        id: 'a',
        text: 'The Imitation Game',
        isCorrect: true,
        explanation:
          'Turing called it the "Imitation Game", originally played between a man, a woman, and an interrogator.',
      },
      {
        id: 'b',
        text: 'The Lovelace Protocol',
        isCorrect: false,
        explanation:
          'The Lovelace Objection argued machines cannot originate ideas, but was not the name of the test.',
      },
      {
        id: 'c',
        text: 'The Dartmouth Challenge',
        isCorrect: false,
        explanation: 'The Dartmouth workshop took place in 1956.',
      },
      {
        id: 'd',
        text: 'The Chinese Room Test',
        isCorrect: false,
        explanation: 'Searle introduced the Chinese Room in 1980.',
      },
    ],
  },
  {
    id: 'u1-bank-02',
    topic: 'History & Foundations',
    outcome: 'CO4',
    question:
      'What was the primary technological and computational cause of the First AI Winter (1974–1980)?',
    options: [
      {
        id: 'a',
        text: 'Minsky and Papert proved single-layer perceptrons could not solve XOR, combined with Lighthill and DARPA funding cuts due to combinatorial explosion',
        isCorrect: true,
        explanation:
          'The limitations of single-layer perceptrons and failure of early machine translation prompted devastating reports (Lighthill in UK, ALPAC in US).',
      },
      {
        id: 'b',
        text: 'The invention of the transistor superseded vacuum tubes',
        isCorrect: false,
        explanation: 'Transistors accelerated computing and predated the AI winter.',
      },
      {
        id: 'c',
        text: 'Prolog compilers were banned by DARPA',
        isCorrect: false,
        explanation: 'Prolog was actually heavily promoted in the 1980s 5th Gen Computing Project.',
      },
      {
        id: 'd',
        text: 'Deep neural networks ran out of internet training data',
        isCorrect: false,
        explanation: 'The public internet did not exist in the 1970s.',
      },
    ],
  },

  // 2. Types of AI & Rational Agents
  {
    id: 'u1-bank-03',
    topic: 'AI Types & Agents',
    outcome: 'CO1',
    question:
      'How is a "Rational Agent" formally defined in modern artificial intelligence (Russell & Norvig)?',
    options: [
      {
        id: 'a',
        text: 'An agent that selects actions expected to maximize its performance measure, given its percept sequence and built-in knowledge',
        isCorrect: true,
        explanation:
          'Rationality is performance maximization under expected uncertainty, distinct from clairvoyant omniscience.',
      },
      {
        id: 'b',
        text: 'An agent that thinks exactly like an average human being',
        isCorrect: false,
        explanation:
          'Human thinking is often irrational or emotional; AI rationality is mathematically optimal decision-making.',
      },
      {
        id: 'c',
        text: 'An agent that never makes mistakes in any possible world',
        isCorrect: false,
        explanation:
          'That describes omniscience, which is impossible in partially observable environments.',
      },
      {
        id: 'd',
        text: 'An agent whose code contains zero conditional statements',
        isCorrect: false,
        explanation: 'Agent programs routinely use conditionals.',
      },
    ],
  },
  {
    id: 'u1-bank-04',
    topic: 'AI Types & Agents',
    outcome: 'CO1',
    question: 'What does the acronym PEAS stand for in agent task environment characterization?',
    options: [
      {
        id: 'a',
        text: 'Performance measure, Environment, Actuators, Sensors',
        isCorrect: true,
        explanation:
          'PEAS specifies the complete external problem specification for an intelligent agent.',
      },
      {
        id: 'b',
        text: 'Perception, Evaluation, Action, State',
        isCorrect: false,
        explanation: 'Those are internal computational concepts, not the task environment.',
      },
      {
        id: 'c',
        text: 'Programming, Engineering, Automation, Software',
        isCorrect: false,
        explanation: 'Not the AI specification framework.',
      },
      {
        id: 'd',
        text: 'Predicates, Entailment, Algorithms, Search',
        isCorrect: false,
        explanation: 'Those are logic terms.',
      },
    ],
  },
  {
    id: 'u1-bank-05',
    topic: 'AI Types & Agents',
    outcome: 'CO4',
    question:
      'Why does a Simple Reflex Agent fail to achieve rationality in a partially observable environment?',
    options: [
      {
        id: 'a',
        text: 'Because its actions depend solely on the immediate percept, leading to infinite loops when identical percepts require different actions based on history',
        isCorrect: true,
        explanation:
          'Without internal state/memory, a simple reflex agent cannot disambiguate states that generate identical sensor readings.',
      },
      {
        id: 'b',
        text: 'Because reflex agents have quadratic time complexity O(n²)',
        isCorrect: false,
        explanation: 'Reflex agents are O(1) table lookups or condition-action rules.',
      },
      {
        id: 'c',
        text: 'Because reflex agents cannot use floating-point numbers',
        isCorrect: false,
        explanation: 'Hardware types are unrelated to agent architecture.',
      },
      {
        id: 'd',
        text: 'Because they cannot interact with actuators',
        isCorrect: false,
        explanation: 'Reflex agents always actuate based on current percept.',
      },
    ],
  },
  {
    id: 'u1-bank-06',
    topic: 'AI Types & Agents',
    outcome: 'CO4',
    question:
      'Which agent architecture evaluates trade-offs between conflicting goals (e.g. speed vs safety vs fuel economy)?',
    options: [
      {
        id: 'a',
        text: 'Utility-Based Agent',
        isCorrect: true,
        explanation:
          'A utility function maps world states to real numbers, allowing optimization over competing goals.',
      },
      {
        id: 'b',
        text: 'Goal-Based Agent',
        isCorrect: false,
        explanation:
          'Goal-based agents only have a binary distinction between goal achieved vs not achieved.',
      },
      {
        id: 'c',
        text: 'Simple Reflex Agent',
        isCorrect: false,
        explanation: 'Reflex agents have no explicit representation of goals.',
      },
      {
        id: 'd',
        text: 'Table-Driven Agent',
        isCorrect: false,
        explanation:
          'Table-driven agents suffer from combinatorial explosion without utility optimization.',
      },
    ],
  },

  // 3. Propositional Logic & Truth Tables
  {
    id: 'u1-bank-07',
    topic: 'Propositional Logic',
    outcome: 'CO1',
    question:
      'If a knowledge base KB contains {P, P → Q}, which truth assignment represents the single model in which KB is TRUE?',
    options: [
      {
        id: 'a',
        text: 'P = True, Q = True',
        isCorrect: true,
        explanation:
          'In world (T, T), P is true and (T → T) is true, satisfying all premises in KB.',
      },
      {
        id: 'b',
        text: 'P = True, Q = False',
        isCorrect: false,
        explanation: 'In world (T, F), P → Q is False, so KB is False.',
      },
      {
        id: 'c',
        text: 'P = False, Q = True',
        isCorrect: false,
        explanation: 'In world (F, T), premise P is False, so KB is False.',
      },
      {
        id: 'd',
        text: 'P = False, Q = False',
        isCorrect: false,
        explanation: 'Premise P is False in this world.',
      },
    ],
  },
  {
    id: 'u1-bank-08',
    topic: 'Propositional Logic',
    outcome: 'CO1',
    question: 'What is the formal connection between Entailment (KB ⊨ α) and Satisfiability?',
    options: [
      {
        id: 'a',
        text: 'KB ⊨ α if and only if the sentence (KB ∧ ¬α) is UNSATISFIABLE',
        isCorrect: true,
        explanation:
          'This is the refutation completeness theorem underlying resolution theorem proving.',
      },
      {
        id: 'b',
        text: 'KB ⊨ α if and only if (KB ∧ α) is satisfiable',
        isCorrect: false,
        explanation: 'Mutual satisfiability only implies consistency, not entailment.',
      },
      {
        id: 'c',
        text: 'Entailment requires that KB have 0 variables',
        isCorrect: false,
        explanation: 'Entailment applies to formulas with any number of variables.',
      },
      {
        id: 'd',
        text: 'KB ⊨ α if and only if KB has more clauses than α',
        isCorrect: false,
        explanation: 'Clause count has no bearing on logical truth.',
      },
    ],
  },
  {
    id: 'u1-bank-09',
    topic: 'Propositional Logic',
    outcome: 'CO4',
    question:
      'How many rows are required in a full truth table to evaluate a propositional formula with n distinct symbols?',
    options: [
      {
        id: 'a',
        text: '2^n rows',
        isCorrect: true,
        explanation:
          'Each boolean variable has 2 states (T/F), yielding 2^n total combinations of possible worlds.',
      },
      {
        id: 'b',
        text: 'n! rows',
        isCorrect: false,
        explanation: 'Factorial complexity applies to permutations, not boolean assignments.',
      },
      {
        id: 'c',
        text: 'n² rows',
        isCorrect: false,
        explanation: 'Polynomial growth does not cover all boolean assignments.',
      },
      { id: 'd', text: '2n rows', isCorrect: false, explanation: 'Linear growth is insufficient.' },
    ],
  },

  // 4. First-Order Logic & Unification
  {
    id: 'u1-bank-10',
    topic: 'First-Order Logic',
    outcome: 'CO1',
    question:
      'What is the result of applying Robinson Unification to terms Knows(John, ?x) and Knows(?y, Bill)?',
    options: [
      {
        id: 'a',
        text: 'MGU θ = { ?x ↦ Bill, ?y ↦ John }',
        isCorrect: true,
        explanation:
          'Matching first arguments binds ?y to John; matching second arguments binds ?x to Bill. Unified term: Knows(John, Bill).',
      },
      {
        id: 'b',
        text: 'Fails with arity mismatch',
        isCorrect: false,
        explanation: 'Both functors have arity 2.',
      },
      {
        id: 'c',
        text: 'Fails with constant clash',
        isCorrect: false,
        explanation: 'Constants John and Bill are in different argument positions.',
      },
      {
        id: 'd',
        text: 'MGU θ = { ?x ↦ ?y }',
        isCorrect: false,
        explanation: 'Does not fully unify the ground constants.',
      },
    ],
  },
  {
    id: 'u1-bank-11',
    topic: 'First-Order Logic',
    outcome: 'CO4',
    question:
      'Why does unifying variable ?x with compound term f(?x) fail during Robinson unification?',
    options: [
      {
        id: 'a',
        text: 'The Occurs-Check detects ?x inside f(?x), preventing an infinite circular substitution',
        isCorrect: true,
        explanation: 'Binding ?x to f(?x) produces f(f(f(...))), an infinite non-terminating term.',
      },
      {
        id: 'b',
        text: 'Because f is a reserved keyword in Prolog',
        isCorrect: false,
        explanation: 'f is an arbitrary functor name.',
      },
      {
        id: 'c',
        text: 'Because variables cannot begin with question marks',
        isCorrect: false,
        explanation: '?x is standard variable notation.',
      },
      {
        id: 'd',
        text: 'Because First-Order Logic forbids function symbols',
        isCorrect: false,
        explanation: 'Function symbols are a core component of FOL.',
      },
    ],
  },

  // 5. Rule-Based Reasoning & Chaining
  {
    id: 'u1-bank-12',
    topic: 'Rule-Based Reasoning',
    outcome: 'CO1',
    question:
      'In Forward Chaining on definite Horn clauses, what is the purpose of maintaining a count array initialized to the number of premises of each rule?',
    options: [
      {
        id: 'a',
        text: 'It allows linear-time O(N) execution: when a premise fact is derived, count is decremented; when count hits 0, the rule immediately fires',
        isCorrect: true,
        explanation:
          'The count agenda algorithm avoids repeatedly scanning all rules, achieving optimal linear time.',
      },
      {
        id: 'b',
        text: 'It tracks the memory usage of the Prolog heap',
        isCorrect: false,
        explanation: 'Heap memory is managed by the runtime allocator.',
      },
      {
        id: 'c',
        text: 'It ensures backward chaining loops are avoided',
        isCorrect: false,
        explanation: 'The count array is specifically used in forward chaining.',
      },
      {
        id: 'd',
        text: 'It counts how many times the user clicks the UI',
        isCorrect: false,
        explanation: 'It is an internal inference engine data structure.',
      },
    ],
  },
  {
    id: 'u1-bank-13',
    topic: 'Rule-Based Reasoning',
    outcome: 'CO4',
    question: 'Under what condition is Backward Chaining strictly preferred over Forward Chaining?',
    options: [
      {
        id: 'a',
        text: 'When proving a specific query or goal hypothesis where collecting all possible input facts would be burdensome or irrelevant',
        isCorrect: true,
        explanation:
          'Backward chaining is goal-directed and only asks for facts necessary to prove the target hypothesis.',
      },
      {
        id: 'b',
        text: 'When incoming telemetry streams 10,000 sensor readings per second',
        isCorrect: false,
        explanation: 'Continuous sensor synthesis is best handled by data-driven forward chaining.',
      },
      {
        id: 'c',
        text: 'When the knowledge base contains zero rules',
        isCorrect: false,
        explanation: 'Neither chaining algorithm functions without rules.',
      },
      {
        id: 'd',
        text: 'When the goal is guaranteed to be false',
        isCorrect: false,
        explanation: 'A priori knowledge of truth value is not available.',
      },
    ],
  },

  // 6. Expert Systems
  {
    id: 'u1-bank-14',
    topic: 'Expert Systems',
    outcome: 'CO1',
    question:
      'Which component of an Expert System is responsible for answering user questions like "Why are you asking this?" and "How did you reach this diagnosis?"',
    options: [
      {
        id: 'a',
        text: 'Explanation Facility',
        isCorrect: true,
        explanation:
          'The explanation facility records the active rule and the completed proof tree to provide transparent justifications.',
      },
      {
        id: 'b',
        text: 'Inference Engine',
        isCorrect: false,
        explanation:
          'The inference engine performs deduction, while the explanation facility formats the reasoning trace for human consumption.',
      },
      {
        id: 'c',
        text: 'Working Memory',
        isCorrect: false,
        explanation: 'Working memory stores current session facts.',
      },
      {
        id: 'd',
        text: 'Knowledge Base',
        isCorrect: false,
        explanation: 'Knowledge base stores static domain rules.',
      },
    ],
  },
  {
    id: 'u1-bank-15',
    topic: 'Expert Systems',
    outcome: 'CO4',
    question:
      'In the MYCIN Certainty Factor calculus, if two independent clinical rules conclude disease H with CF1 = 0.60 and CF2 = 0.50, what is the combined certainty factor CF_combine?',
    options: [
      {
        id: 'a',
        text: '0.80',
        isCorrect: true,
        explanation: 'Formula: CF1 + CF2(1 - CF1) = 0.60 + 0.50(1 - 0.60) = 0.60 + 0.20 = 0.80.',
      },
      {
        id: 'b',
        text: '1.10',
        isCorrect: false,
        explanation: 'Certainty factors are bounded above by +1.0.',
      },
      {
        id: 'c',
        text: '0.30',
        isCorrect: false,
        explanation:
          'Accumulating independent positive evidence increases confidence, not decreases it.',
      },
      { id: 'd', text: '0.55', isCorrect: false, explanation: 'Incorrect arithmetic averaging.' },
    ],
  },

  // 7. Case Studies
  {
    id: 'u1-bank-16',
    topic: 'Case Studies',
    outcome: 'CO1',
    question:
      'In blood transfusion compatibility (trans.pl), why is blood group O- considered the Universal Red Blood Cell Donor?',
    options: [
      {
        id: 'a',
        text: 'Because its red blood cells carry neither A, B, nor Rh(D) surface antigens, preventing recipient antibodies from causing hemolytic destruction',
        isCorrect: true,
        explanation:
          'Without A, B, or Rh antigens, recipient antibodies have no targets to attack.',
      },
      {
        id: 'b',
        text: 'Because O- serum contains zero antibodies',
        isCorrect: false,
        explanation: 'O- serum actually contains Anti-A and Anti-B antibodies.',
      },
      {
        id: 'c',
        text: 'Because O- blood has higher hemoglobin concentration',
        isCorrect: false,
        explanation: 'Blood group does not alter baseline hemoglobin concentration.',
      },
      {
        id: 'd',
        text: 'Because O- can only be transfused to O- recipients',
        isCorrect: false,
        explanation: 'O- can be transfused to any recipient group.',
      },
    ],
  },
  {
    id: 'u1-bank-17',
    topic: 'Case Studies',
    outcome: 'CO4',
    question:
      'Why do autonomous vehicle systems (like Waymo) employ Sensor Fusion across Cameras, LiDAR, and Radar rather than relying purely on optical cameras?',
    options: [
      {
        id: 'a',
        text: 'Because cameras fail in heavy fog, direct sun glare, and lack direct depth, whereas LiDAR provides accurate 3D geometry and Radar penetrates adverse weather',
        isCorrect: true,
        explanation:
          'Sensor fusion combines complementary physics to ensure safety across all operating conditions.',
      },
      {
        id: 'b',
        text: 'Because LiDAR is cheaper than optical webcams',
        isCorrect: false,
        explanation: 'LiDAR sensors are significantly more expensive than cameras.',
      },
      {
        id: 'c',
        text: 'Because traffic laws prohibit the use of cameras in autonomous cars',
        isCorrect: false,
        explanation: 'All autonomous cars use cameras.',
      },
      {
        id: 'd',
        text: 'Because radar is required to play digital radio in the cabin',
        isCorrect: false,
        explanation:
          'Automotive radar operates on 77 GHz collision avoidance bands, not broadcast radio.',
      },
    ],
  },

  // 8. Ethics & Governance
  {
    id: 'u1-bank-18',
    topic: 'Ethics & Governance',
    outcome: 'CO4',
    question:
      'Under the EU AI Act (2024), into which risk tier do credit scoring and recruitment screening algorithms fall?',
    options: [
      {
        id: 'a',
        text: 'High Risk (permitted subject to strict audits, data governance, and human oversight)',
        isCorrect: true,
        explanation:
          'Recruitment and credit evaluation significantly impact fundamental rights and livelihoods, making them High Risk.',
      },
      {
        id: 'b',
        text: 'Unacceptable Risk (prohibited completely)',
        isCorrect: false,
        explanation:
          'Only social scoring, behavioral manipulation, and untargeted biometric scraping are prohibited.',
      },
      {
        id: 'c',
        text: 'Minimal Risk (unregulated)',
        isCorrect: false,
        explanation: 'High-stakes decisions cannot be classified as minimal risk.',
      },
      {
        id: 'd',
        text: 'Specific Transparency Only',
        isCorrect: false,
        explanation:
          'Transparency rules apply to chatbots and deepfakes; hiring algorithms require full conformity assessments.',
      },
    ],
  },

  // 9. Chatbot & AGI
  {
    id: 'u1-bank-19',
    topic: 'Chatbots & AGI',
    outcome: 'CO1',
    question: 'In prompt engineering, what does the ReAct pattern combine?',
    options: [
      {
        id: 'a',
        text: 'Reasoning traces (thought) and Action execution (tool calling/observation)',
        isCorrect: true,
        explanation:
          'ReAct interleaves Reason (Thought) and Act (Tool execution) in a synergistic loop.',
      },
      {
        id: 'b',
        text: 'React.js frontends with Python backends',
        isCorrect: false,
        explanation: 'ReAct in AI refers to Reason + Act, not the web UI framework.',
      },
      {
        id: 'c',
        text: 'Regression and Activation functions',
        isCorrect: false,
        explanation: 'Those are deep learning primitives.',
      },
      {
        id: 'd',
        text: 'Recurrent networks and Actor-Critic models',
        isCorrect: false,
        explanation: 'Not the prompting pattern.',
      },
    ],
  },
  {
    id: 'u1-bank-20',
    topic: 'Chatbots & AGI',
    outcome: 'CO4',
    question: 'What is John Searle\'s central conclusion in the "Chinese Room Argument"?',
    options: [
      {
        id: 'a',
        text: 'Syntax is not semantics: purely executing formal symbol-manipulation rules does not constitute intentionality or genuine conscious understanding',
        isCorrect: true,
        explanation:
          'A program can pass the Turing test syntactically without understanding the meaning of symbols.',
      },
      {
        id: 'b',
        text: 'Computers will achieve human consciousness by the year 2000',
        isCorrect: false,
        explanation: 'Searle argued against strong AI consciousness.',
      },
      {
        id: 'c',
        text: 'Chinese is too complex to be represented in computer code',
        isCorrect: false,
        explanation: 'The choice of language was arbitrary for the thought experiment.',
      },
      {
        id: 'd',
        text: 'Turing tests must be conducted in binary only',
        isCorrect: false,
        explanation: "Not part of Searle's argument.",
      },
    ],
  },
];
