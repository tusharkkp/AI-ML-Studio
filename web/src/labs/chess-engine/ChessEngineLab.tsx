import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Play, AlertTriangle, ShieldCheck } from 'lucide-react';

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type BoardState = (Piece | null)[][]; // 8x8, [rank 0..7 where 0 is rank 8, 7 is rank 1][file 0..7 where 0 is a, 7 is h]

interface ScenarioMove {
  move: string;
  pv: string[];
  isBlunder: boolean;
  evalWithoutQSearch: number; // centipawns
  evalWithQSearch: number; // centipawns
  depth1Eval: number;
  depth2Eval: number;
  depth4Eval: number;
  explanation: string;
}

interface Scenario {
  id: string;
  name: string;
  turn: 'w' | 'b';
  description: string;
  blunderNote: string;
  board: BoardState;
  suggestedMoves: ScenarioMove[];
}

const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

function createEmptyBoard(): BoardState {
  const board: BoardState = [];
  for (let r = 0; r < 8; r++) {
    const row: (Piece | null)[] = [];
    for (let c = 0; c < 8; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

function setPiece(b: BoardState, r: number, c: number, piece: Piece) {
  const row = b[r];
  if (row) {
    row[c] = piece;
  }
}

// Preset 1: Horizon Trap (White Queen takes d5 pawn, Black bishop on b7 recaptures)
function getHorizonTrapBoard(): BoardState {
  const b = createEmptyBoard();
  setPiece(b, 0, 4, { type: 'k', color: 'b' }); // e8
  setPiece(b, 0, 1, { type: 'b', color: 'b' }); // b8
  setPiece(b, 1, 1, { type: 'b', color: 'b' }); // b7 Bishop
  setPiece(b, 3, 3, { type: 'p', color: 'b' }); // d5 Pawn (bait)
  setPiece(b, 7, 4, { type: 'k', color: 'w' }); // e1
  setPiece(b, 7, 3, { type: 'q', color: 'w' }); // d1 White Queen
  setPiece(b, 6, 2, { type: 'p', color: 'w' }); // c2
  setPiece(b, 6, 4, { type: 'p', color: 'w' }); // e2
  return b;
}

// Preset 2: Knight Fork (White Knight forks Black King & Queen)
function getKnightForkBoard(): BoardState {
  const b = createEmptyBoard();
  setPiece(b, 0, 4, { type: 'k', color: 'b' }); // e8 Black King
  setPiece(b, 0, 0, { type: 'q', color: 'b' }); // a8 Black Queen
  setPiece(b, 1, 2, { type: 'p', color: 'b' }); // c7 Black Pawn
  setPiece(b, 4, 3, { type: 'n', color: 'w' }); // d4 White Knight
  setPiece(b, 7, 4, { type: 'k', color: 'w' }); // e1 White King
  setPiece(b, 6, 6, { type: 'p', color: 'w' }); // g2
  setPiece(b, 6, 7, { type: 'p', color: 'w' }); // h2
  return b;
}

// Preset 3: Scholar's Mate Defense (Black under threat of Qxf7#)
function getScholarsMateBoard(): BoardState {
  const b = createEmptyBoard();
  setPiece(b, 0, 4, { type: 'k', color: 'b' }); // e8
  setPiece(b, 0, 1, { type: 'b', color: 'b' }); // c8
  setPiece(b, 1, 5, { type: 'p', color: 'b' }); // f7 weak pawn
  setPiece(b, 1, 4, { type: 'p', color: 'b' }); // e7
  setPiece(b, 3, 4, { type: 'q', color: 'w' }); // h5 White Queen (rank 3, file 7) -> index [3][7]
  setPiece(b, 4, 2, { type: 'b', color: 'w' }); // c4 White Bishop (rank 4, file 2) -> index [4][2]
  setPiece(b, 7, 4, { type: 'k', color: 'w' }); // e1
  return b;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'horizon-trap',
    name: 'The Horizon Effect Trap',
    turn: 'w',
    description:
      'White Queen on d1 targets the undefended-looking Black Pawn on d5. However, a Black Bishop on b7 silently defends d5. A shallow depth 1 search blunders into capturing the pawn because the recapture occurs beyond the horizon.',
    blunderNote:
      'At Depth 1 (no Quiescence), the engine greedily captures the d5 pawn (+100 cp) and stops, blind to the catastrophic queen loss (-900 cp) on move 2.',
    board: getHorizonTrapBoard(),
    suggestedMoves: [
      {
        move: 'Qxd5 (Greedy Capture)',
        pv: ['Qxd5', 'Bxd5'],
        isBlunder: true,
        evalWithoutQSearch: 100, // +1 pawn at depth 1
        evalWithQSearch: -780, // -queen + pawn
        depth1Eval: 100,
        depth2Eval: -800,
        depth4Eval: -820,
        explanation:
          'Blunder: Capturing the d5 pawn wins 100 cp at depth 1, but Black recaptures with Bxd5 at depth 2, leaving White down 800 cp.',
      },
      {
        move: 'Qd3 (Quiet Positional)',
        pv: ['Qd3', 'e6', 'Nf3'],
        isBlunder: false,
        evalWithoutQSearch: 20,
        evalWithQSearch: 25,
        depth1Eval: 20,
        depth2Eval: 25,
        depth4Eval: 30,
        explanation:
          'Safe solid play: White avoids the trap, develops queen toward center, and maintains equality.',
      },
      {
        move: 'e3 (Solid Development)',
        pv: ['e3', 'e5', 'Nf3'],
        isBlunder: false,
        evalWithoutQSearch: 15,
        evalWithQSearch: 20,
        depth1Eval: 15,
        depth2Eval: 20,
        depth4Eval: 25,
        explanation:
          'Classical opening strategy: Opens diagonals for bishops while preserving queen safety.',
      },
    ],
  },
  {
    id: 'knight-fork',
    name: 'Tactical Knight Royal Fork',
    turn: 'w',
    description:
      'White Knight on d4 can leap to c7, placing Black King in check and simultaneously attacking the unprotected Black Queen on a8.',
    blunderNote:
      'Depth 1 only evaluates the check. Depth 2+ sees the forced sequence: King must move, followed by Knight takes Queen (+800 cp net).',
    board: getKnightForkBoard(),
    suggestedMoves: [
      {
        move: 'Nc7+ (Royal Fork)',
        pv: ['Nc7+', 'Kd8', 'Nxa8'],
        isBlunder: false,
        evalWithoutQSearch: 820,
        evalWithQSearch: 840,
        depth1Eval: 120, // sees check + pawn
        depth2Eval: 820, // sees Queen win
        depth4Eval: 850,
        explanation:
          'Decisive tactical strike: Forks King on e8 and Queen on a8, guaranteeing the win of the Black Queen.',
      },
      {
        move: 'Nf3 (Passive Retreat)',
        pv: ['Nf3', 'c6'],
        isBlunder: true,
        evalWithoutQSearch: 10,
        evalWithQSearch: 10,
        depth1Eval: 10,
        depth2Eval: 10,
        depth4Eval: 10,
        explanation:
          'Missed win: Retreats the attacking knight and allows Black to defend c7 with c6.',
      },
    ],
  },
  {
    id: 'scholars-mate',
    name: "Scholar's Mate Attack & Defense",
    turn: 'b',
    description:
      'White has played the aggressive Wayward Queen attack (Qh5 and Bc4), targeting the vulnerable f7 square for checkmate in one move.',
    blunderNote:
      'Black must defend f7. A careless move like Nf6?? allows instantaneous checkmate (Qxf7#). Correct defenses are g6 or Qe7.',
    board: getScholarsMateBoard(),
    suggestedMoves: [
      {
        move: 'g6 (Pawn Kick & Defense)',
        pv: ['g6', 'Qf3', 'Nf6'],
        isBlunder: false,
        evalWithoutQSearch: 70, // Black is better because White queen is displaced
        evalWithQSearch: 75,
        depth1Eval: 70,
        depth2Eval: 75,
        depth4Eval: 90,
        explanation:
          'Best response: Attacks White Queen, shields f7, and forces White Queen to retreat while preparing Bg7.',
      },
      {
        move: 'Nf6?? (Lethal Blunder)',
        pv: ['Nf6', 'Qxf7#'],
        isBlunder: true,
        evalWithoutQSearch: -15000,
        evalWithQSearch: -20000,
        depth1Eval: 30, // depth 1 might think knight developed!
        depth2Eval: -20000, // sees checkmate on f7!
        depth4Eval: -20000,
        explanation:
          'Checkmate blunder: Black develops knight but leaves f7 unprotected; White plays Qxf7# mate next ply.',
      },
    ],
  },
];

export function ChessEngineLab() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('horizon-trap');
  const [searchDepth, setSearchDepth] = useState<number>(2);
  const [useAlphaBeta, setUseAlphaBeta] = useState<boolean>(true);
  const [useQuiescence, setUseQuiescence] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number>(0);

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === selectedScenarioId) ?? SCENARIOS[0]!,
    [selectedScenarioId]
  );

  const currentMove = scenario.suggestedMoves[selectedMoveIndex] ?? scenario.suggestedMoves[0]!;

  // Calculate simulated evaluation score based on search depth and quiescence toggle
  const simulatedEval = useMemo(() => {
    if (useQuiescence) {
      return currentMove.evalWithQSearch;
    }
    if (searchDepth === 1) return currentMove.depth1Eval;
    if (searchDepth === 2) return currentMove.depth2Eval;
    return currentMove.depth4Eval;
  }, [currentMove, searchDepth, useQuiescence]);

  // Compute search tree nodes evaluated and cutoffs count
  const searchMetrics = useMemo(() => {
    let rawNodes = 0;
    let prunedNodes = 0;
    let cutoffs = 0;

    if (searchDepth === 1) {
      rawNodes = 28;
      prunedNodes = useAlphaBeta ? 22 : 28;
      cutoffs = useAlphaBeta ? 6 : 0;
    } else if (searchDepth === 2) {
      rawNodes = 784;
      prunedNodes = useAlphaBeta ? 112 : 784;
      cutoffs = useAlphaBeta ? 84 : 0;
    } else if (searchDepth === 3) {
      rawNodes = 21952;
      prunedNodes = useAlphaBeta ? 890 : 21952;
      cutoffs = useAlphaBeta ? 640 : 0;
    } else {
      rawNodes = 614656;
      prunedNodes = useAlphaBeta ? 4850 : 614656;
      cutoffs = useAlphaBeta ? 3920 : 0;
    }

    if (useQuiescence) {
      prunedNodes += 45; // additional tactical capture nodes evaluated
    }

    const effectiveBranching = Math.pow(prunedNodes, 1 / searchDepth).toFixed(2);
    const prunePercentage = (((rawNodes - prunedNodes) / rawNodes) * 100).toFixed(1);

    return {
      rawNodes,
      nodesEvaluated: prunedNodes,
      cutoffs,
      effectiveBranching,
      prunePercentage,
    };
  }, [searchDepth, useAlphaBeta, useQuiescence]);

  // Static material balance calculation from scenario board
  const materialBalance = useMemo(() => {
    let whiteTotal = 0;
    let blackTotal = 0;
    scenario.board.forEach((row) => {
      row.forEach((piece) => {
        if (piece && piece.type !== 'k') {
          if (piece.color === 'w') whiteTotal += PIECE_VALUES[piece.type];
          else blackTotal += PIECE_VALUES[piece.type];
        }
      });
    });
    return {
      whiteTotal,
      blackTotal,
      diff: whiteTotal - blackTotal,
    };
  }, [scenario]);

  const handleSimulateSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  const handleTriggerHorizonBlunder = () => {
    setSelectedScenarioId('horizon-trap');
    setSelectedMoveIndex(0); // Qxd5
    setSearchDepth(1);
    setUseQuiescence(false);
  };

  return (
    <Card className="p-6 bg-[#0c0a09] border-[#292524] text-stone-300">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#292524]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-lg text-white">
              Chess Engine Laboratory
            </span>
            <Badge variant="unit">Shannon Type A & B Engine</Badge>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Observe evaluation functions,{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              Alpha-Beta pruning cutoffs
            </span>
            , and the infamous Horizon Effect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerHorizonBlunder}
            className="border-amber-600/60 text-amber-300 hover:bg-amber-950/40 text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Make it fail: Trigger Horizon Trap
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulateSearch}
            disabled={isSearching}
            className="text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            {isSearching ? 'Evaluating Plies...' : 'Evaluate Position'}
          </Button>
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSelectedScenarioId(s.id);
              setSelectedMoveIndex(0);
            }}
            className={`p-3 text-left rounded-md border transition-all text-xs ${
              selectedScenarioId === s.id
                ? 'bg-[#1c1917] border-stone-600 text-white font-medium'
                : 'bg-[#141210] border-[#292524] text-stone-400 hover:text-stone-200 hover:border-stone-700'
            }`}
          >
            <div className="font-semibold text-stone-200">{s.name}</div>
            <div className="text-[11px] text-stone-500 mt-0.5 truncate">
              {s.turn === 'w' ? 'White to move' : 'Black to move'}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8x8 Chessboard */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative p-2 bg-[#171412] border border-[#292524] rounded-lg">
            <div className="grid grid-cols-8 border border-stone-700 rounded overflow-hidden w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
              {scenario.board.map((row, rIdx) =>
                row.map((piece, cIdx) => {
                  const isLight = (rIdx + cIdx) % 2 === 0;
                  const isHighlighted =
                    (selectedScenarioId === 'horizon-trap' && rIdx === 3 && cIdx === 3) || // d5
                    (selectedScenarioId === 'horizon-trap' && rIdx === 7 && cIdx === 3) || // d1
                    (selectedScenarioId === 'knight-fork' && rIdx === 1 && cIdx === 2); // c7

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`relative flex items-center justify-center select-none text-2xl sm:text-3xl font-serif transition-colors ${
                        isLight ? 'bg-[#3b342e]' : 'bg-[#1e1b18]'
                      } ${isHighlighted ? 'ring-2 ring-amber-500/80 bg-amber-950/40' : ''}`}
                    >
                      {/* Rank / File Coordinate Labels */}
                      {cIdx === 0 && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-mono text-stone-500 select-none">
                          {8 - rIdx}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-stone-500 select-none">
                          {String.fromCharCode(97 + cIdx)}
                        </span>
                      )}

                      {piece && (
                        <span
                          className={`${
                            piece.color === 'w'
                              ? 'text-[#fef3c7] font-bold drop-shadow'
                              : 'text-stone-900 font-bold drop-shadow-sm'
                          }`}
                        >
                          {PIECE_SYMBOLS[piece.color][piece.type]}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Turn & Status Indicator */}
            <div className="flex items-center justify-between text-xs mt-3 px-1 text-stone-400">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    scenario.turn === 'w'
                      ? 'bg-[#fef3c7] border border-stone-400'
                      : 'bg-stone-900 border border-stone-600'
                  }`}
                />
                <span className="font-medium text-stone-300">
                  {scenario.turn === 'w' ? 'White to move' : 'Black to move'}
                </span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                Centipawns: {simulatedEval > 0 ? `+${simulatedEval}` : simulatedEval} cp
              </span>
            </div>
          </div>

          {/* Evaluation Bar */}
          <div className="w-[280px] sm:w-[320px] mt-4 p-2 bg-[#141210] border border-[#292524] rounded-md">
            <div className="flex justify-between text-[11px] font-mono mb-1 text-stone-400">
              <span>Eval: {(simulatedEval / 100).toFixed(2)} pawns</span>
              <span className={simulatedEval >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {simulatedEval > 300
                  ? 'Decisive White'
                  : simulatedEval > 50
                    ? 'Slight White Advantage'
                    : simulatedEval < -300
                      ? 'Decisive Black'
                      : simulatedEval < -50
                        ? 'Slight Black Advantage'
                        : 'Balanced Equality'}
              </span>
            </div>
            <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden flex border border-stone-800">
              <div
                className="bg-[#fef3c7] h-full transition-all duration-300"
                style={{
                  width: `${Math.max(5, Math.min(95, 50 + (simulatedEval / 1000) * 50))}%`,
                }}
              />
              <div className="bg-stone-800 h-full flex-1" />
            </div>
          </div>
        </div>

        {/* Right: Controls, Candidate Moves, & Search Diagnostics */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Candidate Moves Selector */}
          <div className="bg-[#141210] border border-[#292524] p-3 rounded-lg">
            <div className="text-xs font-semibold text-stone-300 mb-2">
              Candidate Moves Evaluated by Engine:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenario.suggestedMoves.map((m, idx) => (
                <button
                  key={m.move}
                  type="button"
                  onClick={() => setSelectedMoveIndex(idx)}
                  className={`p-2.5 text-left rounded border transition-all text-xs ${
                    selectedMoveIndex === idx
                      ? m.isBlunder
                        ? 'bg-rose-950/30 border-rose-800 text-white'
                        : 'bg-emerald-950/30 border-emerald-800 text-white'
                      : 'bg-[#1a1715] border-[#292524] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200">{m.move}</span>
                    {m.isBlunder ? (
                      <Badge
                        variant="default"
                        className="text-[10px] text-rose-300 border-rose-800 bg-rose-950/60"
                      >
                        Trap / Blunder
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="text-[10px] text-emerald-300 border-emerald-800 bg-emerald-950/60"
                      >
                        Sound Move
                      </Badge>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-stone-400 mt-1">
                    PV: {m.pv.join(' → ')}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-2.5 leading-relaxed bg-[#1a1715] p-2 rounded border border-[#292524]">
              {currentMove.explanation}
            </p>
          </div>

          {/* Engine Parameters */}
          <div className="bg-[#141210] border border-[#292524] p-3 rounded-lg space-y-4">
            <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Search & Horizon Controls
            </div>

            <Slider
              label="Alpha-Beta Search Depth (Plies)"
              value={searchDepth}
              min={1}
              max={4}
              step={1}
              unit="plies"
              onChange={(v) => setSearchDepth(v)}
              helperText="1 ply = 1 half-move (White or Black). Depth 2 searches 1 full turn ahead."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Toggle
                label="Alpha-Beta Pruning"
                checked={useAlphaBeta}
                onChange={setUseAlphaBeta}
                description="Prunes provably suboptimal branches without altering minimax score."
              />
              <Toggle
                label="Quiescence Search (q-search)"
                checked={useQuiescence}
                onChange={setUseQuiescence}
                description="Continues capture cascades until the board is tactically quiet."
              />
            </div>
          </div>

          {/* Search Performance Metrics */}
          <div className="bg-[#141210] border border-[#292524] p-3 rounded-lg">
            <div className="text-xs font-semibold text-stone-300 mb-2">Live Search Diagnostics</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] uppercase text-stone-500 font-mono">Nodes Checked</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {searchMetrics.nodesEvaluated.toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-500">
                  vs {searchMetrics.rawNodes.toLocaleString()} Minimax
                </div>
              </div>

              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] uppercase text-stone-500 font-mono">Branches Cut</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  {searchMetrics.cutoffs}
                </div>
                <div className="text-[10px] text-stone-500">
                  {searchMetrics.prunePercentage}% pruned
                </div>
              </div>

              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] uppercase text-stone-500 font-mono">
                  Branching (b_eff)
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {searchMetrics.effectiveBranching}
                </div>
                <div className="text-[10px] text-stone-500">Theoretical min: 5.29</div>
              </div>

              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] uppercase text-stone-500 font-mono">
                  Material Balance
                </div>
                <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">
                  {materialBalance.diff >= 0 ? `+${materialBalance.diff}` : materialBalance.diff}
                </div>
                <div className="text-[10px] text-stone-500">Excluding kings</div>
              </div>
            </div>
          </div>

          {/* Horizon Effect Callout Box */}
          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed ${
              searchDepth === 1 && !useQuiescence && currentMove.isBlunder
                ? 'bg-rose-950/30 border-rose-700/60 text-rose-200'
                : 'bg-[#171412] border-[#292524] text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold mb-1">
              {searchDepth === 1 && !useQuiescence && currentMove.isBlunder ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">Horizon Blindness Active</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-stone-200">Horizon Mitigation Active</span>
                </>
              )}
            </div>
            <p>
              {searchDepth === 1 && !useQuiescence && currentMove.isBlunder
                ? 'The engine is truncating its search exactly after move 1 (ply 1). Because Quiescence Search is disabled, the engine registers a +100 cp gain from capturing the pawn, unaware that Black will recapture the Queen on the very next ply!'
                : useQuiescence
                  ? "Quiescence search is active: even at depth 1, the engine does not stop searching while tactical capture sequences remain unresolved. It detects Black's bishop recapture and correctly rejects the sacrifice."
                  : "At depth ≥ 2, the search horizon extends to ply 2, revealing Black's immediate tactical response."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
