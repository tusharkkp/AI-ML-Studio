import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { ChessEngineLab } from '@/labs/chess-engine/ChessEngineLab';
import { ArrowLeft } from 'lucide-react';

export function ChessCaseStudyPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'chess-q1',
      question:
        'What is the fundamental cause of the Horizon Effect in game-playing artificial intelligence?',
      options: [
        {
          id: 'A',
          text: 'Truncating search at an arbitrary fixed depth, causing the engine to remain completely blind to critical tactical exchanges that take place just one ply beyond that boundary.',
          isCorrect: true,
          explanation:
            'When search stops at an arbitrary depth limit d, an engine evaluates the static leaf position without realizing that an unresolved tactical exchange (such as a queen recapture or checkmate) occurs at ply d+1. This is known as the Horizon Effect.',
        },
        {
          id: 'B',
          text: 'Running out of RAM when computing piece-square tables for bishops and rooks.',
          isCorrect: false,
          explanation:
            'Piece-square tables are tiny static 64-element lookup tables that take negligible memory; they do not cause search horizon truncation.',
        },
        {
          id: 'C',
          text: 'Using Alpha-Beta pruning instead of pure Minimax, which discards winning moves.',
          isCorrect: false,
          explanation:
            'Alpha-Beta pruning is mathematically identical in outcome to Minimax; it never discards optimal moves.',
        },
      ],
    },
    {
      id: 'chess-q2',
      question: 'How does Quiescence Search (q-search) successfully resolve the Horizon Effect?',
      options: [
        {
          id: 'A',
          text: 'It extends search depth selectively along non-quiet tactical branches (captures, checks, promotions) until a calm, stable state is reached before invoking the static evaluation function.',
          isCorrect: true,
          explanation:
            'Rather than statically evaluating a position in the middle of a piece trade, quiescence search continues exploring capture sequences until no more tactical captures remain, ensuring the evaluation is truthful.',
        },
        {
          id: 'B',
          text: 'It permanently doubles the total search depth across all branches of the game tree.',
          isCorrect: false,
          explanation:
            'Doubling depth across all branches causes combinatorial explosion. Quiescence search only explores captures.',
        },
        {
          id: 'C',
          text: 'It substitutes the evaluation function with a random coin flip whenever a queen is attacked.',
          isCorrect: false,
          explanation: 'Quiescence search is deterministic and tactical.',
        },
      ],
    },
    {
      id: 'chess-q3',
      question:
        'Why does Zobrist Hashing enable O(1) transposition table lookups during game tree exploration?',
      options: [
        {
          id: 'A',
          text: 'It assigns unique random 64-bit bitstrings to each piece-square pair and updates the board hash incrementally using the fast XOR bitwise operator.',
          isCorrect: true,
          explanation:
            'Because XOR is its own inverse (A ⊕ B ⊕ B = A), moving a piece from square X to square Y requires just two XOR operations on the 64-bit hash, avoiding expensive full-board rehashes.',
        },
        {
          id: 'B',
          text: 'It stores complete video recordings of every chess game played since 1950.',
          isCorrect: false,
          explanation:
            'Zobrist hashing is a compact 64-bit integer hashing scheme, not video storage.',
        },
        {
          id: 'C',
          text: 'It forces both players to repeat the same opening moves.',
          isCorrect: false,
          explanation: 'Transposition tables store evaluations of any reachable game position.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/learn/unit-2"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-[#fef3c7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Unit 2 Overview
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="unit">Unit 2</Badge>
            <Badge variant="default">Case Study 2</Badge>
            <span className="text-xs text-stone-500 font-mono">0.6 hrs</span>
          </div>
        </div>

        {/* Section 1: Header */}
        <header className="space-y-4 border-b border-[#292524] pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Case Study 2: Chess Game Playing Engine
          </h1>
          <p className="text-base text-stone-400 leading-relaxed max-w-3xl">
            Explore how modern adversarial AI searches deep decision trees, computes positional{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              heuristic evaluation functions
            </span>
            , and overcomes the notorious Horizon Effect using Alpha-Beta pruning and Quiescence
            search.
          </p>
        </header>

        {/* Section 2: Real-World Domain Context & Shannon Number */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Domain context: The combinatorial explosion of chess
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            In 1950, mathematician Claude Shannon published the seminal paper{' '}
            <em className="text-stone-200">Programming a Computer for Playing Chess</em>. He
            estimated that an average chess game has an effective branching factor of approximately{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">b ≈ 35 legal moves</span>{' '}
            and lasts roughly 80 plies (40 full turns).
          </p>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            A brute-force search across the complete game tree would require examining roughly{' '}
            <span className="font-mono text-amber-400">35⁸⁰ ≈ 10¹²⁰</span> positions. This
            astronomical quantity is known as the{' '}
            <strong className="text-white">Shannon Number</strong>. For comparison, there are only
            about 10⁸⁰ atoms in the observable universe.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[11px] font-mono text-stone-500 uppercase">Shannon Number</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-1">10¹²⁰</div>
              <div className="text-xs text-stone-400 mt-1">Total possible chess games</div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[11px] font-mono text-stone-500 uppercase">Branching Factor</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">b ≈ 35</div>
              <div className="text-xs text-stone-400 mt-1">Legal moves per turn</div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[11px] font-mono text-stone-500 uppercase">
                Observable Universe
              </div>
              <div className="text-lg font-bold text-sky-400 font-mono mt-1">10⁸⁰</div>
              <div className="text-xs text-stone-400 mt-1">Estimated atoms</div>
            </div>
          </div>
        </Card>

        {/* Section 3: Predict-then-Reveal Prompt */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-lg font-bold text-white font-heading mb-2">
            Predict then reveal: The horizon dilemma
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            Suppose an engine searches exactly to depth 1 (one ply ahead). White has an option to
            capture a Black pawn on d5 with their Queen. What will the engine decide if a Black
            Bishop defends that pawn?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant={prediction === 'blunder' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('blunder')}
              className="text-xs"
            >
              It will capture the pawn because it cannot see the recapture
            </Button>
            <Button
              variant={prediction === 'safe' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('safe')}
              className="text-xs"
            >
              It will instinctively know the Queen is more valuable and retreat
            </Button>
          </div>
          {prediction && (
            <div className="mt-4 p-3 rounded bg-[#110f0e] border border-[#292524] text-xs text-stone-300 leading-relaxed">
              <strong className="text-[#fef3c7]">
                {prediction === 'blunder' ? 'Correct prediction!' : 'Prediction revealed:'}
              </strong>{' '}
              At depth 1, the engine evaluates the board after White plays Qxd5. In that terminal
              leaf, White has gained a pawn (+100 cp) and still has their Queen. Because search
              halts at depth 1, the engine is{' '}
              <span className="font-heading text-[#fef3c7] font-semibold">
                totally blind to Black recapturing the Queen
              </span>{' '}
              on ply 2. This fatal flaw is known as the Horizon Effect.
            </div>
          )}
        </Card>

        {/* Section 4: System Architecture */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Engine architecture: Shannon Type A vs Type B
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            Shannon categorized chess algorithms into two overarching paradigms:{' '}
            <strong className="text-stone-100">Type A</strong> (brute-force breadth across all legal
            moves) and <strong className="text-stone-100">Type B</strong> (selective forward pruning
            based on human plausible move heuristics).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-stone-200 text-sm mb-2">
                Type A: Deep Search Engines
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                Examples: Deep Blue (1997), early Stockfish versions.
              </p>
              <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
                <li>Explores all legal branches up to a maximum depth limit.</li>
                <li>
                  Relies on Alpha-Beta pruning, transposition tables, and specialized hardware.
                </li>
                <li>Fast evaluation function evaluating millions of positions per second.</li>
                <li>Immune to human psychological traps or blind spots.</li>
              </ul>
            </div>
            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-stone-200 text-sm mb-2">
                Type B & Neural: Selective Engines
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                Examples: AlphaZero (2017), modern Stockfish NNUE.
              </p>
              <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
                <li>Evaluates only high-probability, high-quality candidate moves.</li>
                <li>
                  Combines Monte Carlo Tree Search (MCTS) with deep value and policy networks.
                </li>
                <li>
                  Evaluates far fewer positions (tens of thousands per second) with much higher
                  accuracy.
                </li>
                <li>Develops deep intuitive strategic and positional understanding.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 5: Mathematical Formulation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-heading">
              Mathematical evaluation functions
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMath(!showMath)}
              className="text-xs"
            >
              {showMath ? 'Hide Math Details' : 'Show Mathematical Formulation'}
            </Button>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            At any non-terminal leaf state <code className="text-amber-300">s</code>, the engine
            cannot compute forward forever. It applies a static evaluation function{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              f(s) mapped to centipawns
            </span>{' '}
            (where 100 centipawns equals the value of one pawn).
          </p>

          {showMath ? (
            <div className="space-y-4 p-4 bg-[#110f0e] rounded border border-[#292524] text-xs font-mono text-stone-300">
              <div>
                <span className="text-amber-400">
                  f(s) = Material(s) + Positional(s) + Mobility(s) + KingSafety(s)
                </span>
              </div>
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <div>
                  <strong>1. Material Balance:</strong>
                  <br />
                  Material(s) = ∑ w_p × [Count_White(p) - Count_Black(p)]
                  <br />
                  where w_pawn = 100, w_knight = 320, w_bishop = 330, w_rook = 500, w_queen = 900.
                </div>
                <div>
                  <strong>2. Piece-Square Tables (PST):</strong>
                  <br />
                  Positional(s) = ∑ PST_piece(rank, file)
                  <br />
                  Knights earn bonuses in the center (d4, d5, e4, e5) and penalties on rim squares
                  (a1, h8).
                </div>
                <div>
                  <strong>3. Mobility Term:</strong>
                  <br />
                  Mobility(s) = c₁ × (|LegalMoves_White| - |LegalMoves_Black|)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 italic">
              Click 'Show Mathematical Formulation' to inspect the linear weighted score components.
            </div>
          )}
        </Card>

        {/* Section 6: Deep Dive: The Horizon Effect & Quiescence Search */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            The Horizon Effect and Quiescence Search
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            The <strong className="text-white">Horizon Effect</strong> is a critical limitation of
            depth-bounded search. When an unavoidable loss or tactical exchange is about to take
            place, a fixed-depth search engine might execute wasteful moves (spite checks or
            sacrificial stalls) simply to push the disaster past its search horizon depth{' '}
            <code className="text-amber-300">d</code>.
          </p>
          <div className="p-4 bg-[#141210] rounded border border-[#292524] mb-4">
            <h3 className="font-semibold text-[#fef3c7] text-sm mb-2">
              The Quiescence Search Solution (q-search)
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-2">
              When standard Alpha-Beta search reaches its maximum depth limit{' '}
              <code className="text-amber-300">depth == 0</code>, it does <em>not</em> return the
              raw static evaluation if the position is tactical. Instead, it enters{' '}
              <span className="font-heading text-[#fef3c7] font-semibold">Quiescence Search</span>:
            </p>
            <ol className="text-xs text-stone-400 space-y-1.5 list-decimal list-inside">
              <li>First computes a "stand-pat" static evaluation score.</li>
              <li>If stand-pat satisfies the beta-cutoff, prunes immediately.</li>
              <li>
                Generates <strong>only noisy moves</strong>: captures, pawn promotions, and checking
                moves.
              </li>
              <li>
                Recursively searches until no aggressive moves remain (a quiet position is reached).
              </li>
            </ol>
          </div>
        </Card>

        {/* Section 7: Interactive Lab */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Interactive Lab: Chess Engine Simulator
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select tactical scenarios, adjust search depth, and test how quiescence search
              neutralizes the Horizon Effect.
            </p>
          </div>
          <ChessEngineLab />
        </section>

        {/* Section 8: Zobrist Hashing and Transposition Tables */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Transposition tables & Zobrist hashing
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            Different move orders frequently transpose into identical board positions. For example,{' '}
            <code className="text-amber-300">1. d4 Nf6 2. c4</code> reaches the exact same position
            as <code className="text-amber-300">1. c4 Nf6 2. d4</code>. Without caching, an engine
            would re-evaluate subtrees containing hundreds of thousands of redundant nodes.
          </p>
          <p className="text-sm text-stone-300 leading-relaxed">
            In 1970, Albert Zobrist introduced{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">Zobrist Hashing</span>. A
            random 64-bit integer is pre-generated for each (piece, square) combination. When a
            piece moves from square A to square B, the new hash is updated in{' '}
            <code className="text-amber-300">O(1)</code> time using XOR:
          </p>
          <div className="mt-3 p-3 bg-[#110f0e] rounded border border-[#292524] text-xs font-mono text-amber-300">
            Hash_new = Hash_old ⊕ Table[piece, square_from] ⊕ Table[piece, square_to]
          </div>
        </Card>

        {/* Section 9: Code Implementation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            TypeScript implementation: Alpha-Beta with Quiescence
          </h2>
          <div className="p-4 bg-[#110f0e] rounded border border-[#292524] overflow-x-auto text-xs font-mono text-stone-300 leading-relaxed">
            <pre>{`// Alpha-Beta Search with Quiescence Search integration
function alphaBeta(
  state: ChessPosition,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    // Drop into quiescence search rather than static eval
    return quiescenceSearch(state, alpha, beta, isMaximizing);
  }

  const moves = generateLegalMoves(state);
  if (moves.length === 0) {
    return state.inCheck ? (isMaximizing ? -20000 : 20000) : 0; // Checkmate vs Stalemate
  }

  // Order moves: Captures first (MVV-LVA) to maximize Alpha-Beta cutoffs
  orderMoves(moves);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextState = applyMove(state, move);
      const score = alphaBeta(nextState, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Beta cutoff: Prune branch
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nextState = applyMove(state, move);
      const score = alphaBeta(nextState, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha cutoff: Prune branch
    }
    return minEval;
  }
}`}</pre>
          </div>
        </Card>

        {/* Section 10: Common Misconceptions */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Common misconceptions dispelled
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 1: "Chess engines calculate every variation all the way to checkmate."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: Shannon's number (10¹²⁰) proves this is mathematically impossible.
                Engines search only 10 to 40 plies deep and evaluate the resulting position with
                heuristic or neural evaluation functions.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 2: "Alpha-Beta pruning can accidentally discard a brilliant sacrifice
                or checkmate."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: Alpha-Beta pruning is mathematically guaranteed to return the exact same
                score as exhaustive Minimax search. It only prunes branches that the opposing player
                would never permit.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 3: "Deep Blue defeated Garry Kasparov using modern deep learning."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: Deep Blue (1997) used zero machine learning. It was a handcrafted,
                brute-force Alpha-Beta search system running on specialized VLSI hardware chips
                capable of evaluating 200 million positions per second.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 11: Academic Viva & Exam Questions */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Academic Viva & Exam Preparation
          </h2>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q1: What is the Shannon Number, and what does it imply about the completeness of
                game tree search in chess?
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> The Shannon Number is 10¹²⁰, representing the
                estimated number of unique possible games in chess based on an average branching
                factor of b ≈ 35 and 80 plies. It implies that exhaustive game-tree search is
                physically impossible, necessitating depth truncation, heuristic evaluation, and
                aggressive pruning algorithms like Alpha-Beta.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q2: Explain the Horizon Effect with a concrete chess scenario. How is it solved?
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> The Horizon Effect occurs when a search algorithm
                truncates at fixed depth d, causing it to misjudge an impending tactical disaster
                that occurs at ply d+1. For example, capturing a protected pawn at depth 1 looks
                like a +1 gain, while the queen recapture at depth 2 is invisible. It is resolved
                using Quiescence Search, which extends search along non-quiet capture sequences
                until a tactically quiet position is reached.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 12: Micro-Quiz */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Concept Check: Test Your Understanding
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Answer the questions below to test your mastery of game-playing engines, alpha-beta
              pruning, and the horizon effect.
            </p>
          </div>
          <Quiz conceptId="u2-case-chess" items={quizItems} />
        </section>

        {/* Section 13: Summary & Next Steps */}
        <Card className="p-6 bg-[#171412] border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base">
              Ready for the next search frontier?
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Continue to Self-Study: Genetic Algorithms (GA) or explore Game Theory and Nash
              Equilibrium.
            </p>
          </div>
          <Link to="/learn/unit-2/genetic-algorithms">
            <Button variant="primary" size="sm" className="text-xs whitespace-nowrap">
              Proceed to Genetic Algorithms →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
