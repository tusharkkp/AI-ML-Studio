import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle2, Scale } from 'lucide-react';

interface GameConfig {
  id: string;
  name: string;
  type: 'dilemma' | 'coordination' | 'zero-sum' | 'trust';
  description: string;
  rowPlayerName: string;
  colPlayerName: string;
  rowActions: [string, string];
  colActions: [string, string];
  matrix: [
    [[number, number], [number, number]], // Row 0: [Col 0, Col 1]
    [[number, number], [number, number]], // Row 1: [Col 0, Col 1]
  ];
  equilibriumExplanation: string;
}

const CANONICAL_GAMES: GameConfig[] = [
  {
    id: 'prisoners-dilemma',
    name: "Prisoner's Dilemma",
    type: 'dilemma',
    description:
      'Two suspects are interrogated separately. Self-interest compels both to Defect, resulting in (-2, -2), even though Mutual Cooperation yields (0, 0).',
    rowPlayerName: 'Suspect A',
    colPlayerName: 'Suspect B',
    rowActions: ['Cooperate', 'Defect'],
    colActions: ['Cooperate', 'Defect'],
    matrix: [
      [
        [0, 0],
        [-3, 1],
      ], // Cooperate vs [Cooperate, Defect]
      [
        [1, -3],
        [-2, -2],
      ], // Defect vs [Cooperate, Defect]
    ],
    equilibriumExplanation:
      'Defect strictly dominates Cooperate for both players. (Defect, Defect) is the unique Nash Equilibrium with payoffs (-2, -2), demonstrating how individual rationality leads to Pareto-suboptimal outcomes.',
  },
  {
    id: 'battle-of-sexes',
    name: 'Battle of the Sexes',
    type: 'coordination',
    description:
      'A couple wants to meet for an evening out but prefers different events (Opera vs Football). Both prefer being together over attending alone.',
    rowPlayerName: 'Partner 1',
    colPlayerName: 'Partner 2',
    rowActions: ['Opera', 'Football'],
    colActions: ['Opera', 'Football'],
    matrix: [
      [
        [3, 2],
        [0, 0],
      ],
      [
        [0, 0],
        [2, 3],
      ],
    ],
    equilibriumExplanation:
      'There are two Pure Nash Equilibria: (Opera, Opera) with payoffs (3, 2) and (Football, Football) with payoffs (2, 3). Neither player has an incentive to unilaterally switch.',
  },
  {
    id: 'matching-pennies',
    name: 'Matching Pennies (Zero-Sum)',
    type: 'zero-sum',
    description:
      'Two players reveal a penny simultaneously. Player 1 wins if pennies match (Heads-Heads or Tails-Tails); Player 2 wins if they differ.',
    rowPlayerName: 'Matcher (P1)',
    colPlayerName: 'Mismatcher (P2)',
    rowActions: ['Heads', 'Tails'],
    colActions: ['Heads', 'Tails'],
    matrix: [
      [
        [1, -1],
        [-1, 1],
      ],
      [
        [-1, 1],
        [1, -1],
      ],
    ],
    equilibriumExplanation:
      'No Pure Strategy Nash Equilibrium exists! The unique equilibrium is Mixed Strategy: each player randomizes with equal 50% probability (p = 0.5, q = 0.5), yielding an expected payoff of 0.',
  },
  {
    id: 'stag-hunt',
    name: 'Stag Hunt (Payoff vs Risk)',
    type: 'trust',
    description:
      'Two hunters can coordinate to hunt a valuable Stag (requires both) or independently catch a safe Hare.',
    rowPlayerName: 'Hunter 1',
    colPlayerName: 'Hunter 2',
    rowActions: ['Hunt Stag', 'Hunt Hare'],
    colActions: ['Hunt Stag', 'Hunt Hare'],
    matrix: [
      [
        [5, 5],
        [0, 3],
      ],
      [
        [3, 0],
        [2, 2],
      ],
    ],
    equilibriumExplanation:
      'Two Pure Nash Equilibria: (Stag, Stag) is Payoff-Dominant (payoffs 5, 5), while (Hare, Hare) is Risk-Dominant (safe payoff 2 without relying on trust).',
  },
];

function getPayoff(
  matrix: [[[number, number], [number, number]], [[number, number], [number, number]]],
  r: number,
  c: number
): [number, number] {
  const row = matrix[r as 0 | 1];
  if (row) {
    const cell = row[c as 0 | 1];
    if (cell) return cell;
  }
  return [0, 0];
}

export function GameTheoryLab() {
  const [selectedGameId, setSelectedGameId] = useState<string>('prisoners-dilemma');
  const [selectedRowAction, setSelectedRowAction] = useState<number>(0);
  const [selectedColAction, setSelectedColAction] = useState<number>(0);
  const [showBestResponses, setShowBestResponses] = useState<boolean>(true);

  const game = useMemo(
    () => CANONICAL_GAMES.find((g) => g.id === selectedGameId) ?? CANONICAL_GAMES[0]!,
    [selectedGameId]
  );

  // Compute best responses and pure Nash equilibria
  const analysis = useMemo(() => {
    const matrix = game.matrix;

    // For Row Player: given Col c, which row r gives higher payoff?
    const rowBestResponses: boolean[][] = [
      [false, false],
      [false, false],
    ];
    for (let c = 0; c < 2; c++) {
      const pRow0 = getPayoff(matrix, 0, c)[0];
      const pRow1 = getPayoff(matrix, 1, c)[0];
      if (pRow0 >= pRow1) {
        rowBestResponses[0]![c] = true;
      }
      if (pRow1 >= pRow0) {
        rowBestResponses[1]![c] = true;
      }
    }

    // For Col Player: given Row r, which col c gives higher payoff?
    const colBestResponses: boolean[][] = [
      [false, false],
      [false, false],
    ];
    for (let r = 0; r < 2; r++) {
      const pCol0 = getPayoff(matrix, r, 0)[1];
      const pCol1 = getPayoff(matrix, r, 1)[1];
      if (pCol0 >= pCol1) {
        colBestResponses[r]![0] = true;
      }
      if (pCol1 >= pCol0) {
        colBestResponses[r]![1] = true;
      }
    }

    // A cell (r, c) is a Nash Equilibrium if both row and col are best responses
    const nashEquilibria: [number, number][] = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        if (rowBestResponses[r]![c] && colBestResponses[r]![c]) {
          nashEquilibria.push([r, c]);
        }
      }
    }

    return {
      rowBestResponses,
      colBestResponses,
      nashEquilibria,
    };
  }, [game]);

  const currentPayoff = getPayoff(game.matrix, selectedRowAction, selectedColAction);
  const isCurrentNash = analysis.nashEquilibria.some(
    ([r, c]) => r === selectedRowAction && c === selectedColAction
  );

  const handleSelectDilemmaTrap = () => {
    setSelectedGameId('prisoners-dilemma');
    setSelectedRowAction(1); // Defect
    setSelectedColAction(1); // Defect
  };

  return (
    <Card className="p-6 bg-[#0c0a09] border-[#292524] text-stone-300">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#292524]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-lg text-white">
              Strategic Normal-Form Matrix Laboratory
            </span>
            <Badge variant="unit">Nash Equilibrium Solver</Badge>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Analyze strategic game matrices, compute{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">mutual best responses</span>
            , and discover pure and mixed equilibria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectDilemmaTrap}
            className="border-amber-600/60 text-amber-300 hover:bg-amber-950/40 text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Make it fail: The Defection Trap
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBestResponses((v) => !v)}
            className="text-xs"
          >
            <Scale className="w-3.5 h-3.5 mr-1" />
            {showBestResponses ? 'Hide Best Responses' : 'Highlight Best Responses'}
          </Button>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {CANONICAL_GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setSelectedGameId(g.id);
              setSelectedRowAction(0);
              setSelectedColAction(0);
            }}
            className={`p-3 text-left rounded-md border transition-all text-xs ${
              selectedGameId === g.id
                ? 'bg-[#1c1917] border-stone-600 text-white font-medium'
                : 'bg-[#141210] border-[#292524] text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="font-semibold text-stone-200">{g.name}</div>
            <div className="text-[11px] text-stone-500 mt-0.5 capitalize">{g.type}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Payoff Matrix */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-md bg-[#141210] border border-[#292524] p-4 rounded-lg">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Column Player: {game.colPlayerName} (Blue)
              </span>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {/* Top-Left Empty Header */}
              <div className="flex items-center justify-center p-2 text-amber-400 font-semibold text-[11px]">
                {game.rowPlayerName} ↓
              </div>
              {/* Column 0 Header */}
              <div className="p-2 bg-[#1b1816] rounded border border-[#292524] font-semibold text-sky-300">
                {game.colActions[0]}
              </div>
              {/* Column 1 Header */}
              <div className="p-2 bg-[#1b1816] rounded border border-[#292524] font-semibold text-sky-300">
                {game.colActions[1]}
              </div>

              {/* Row 0 */}
              <div className="p-2 bg-[#1b1816] rounded border border-[#292524] font-semibold text-amber-300 flex items-center justify-center">
                {game.rowActions[0]}
              </div>
              {/* Cell (0, 0) */}
              {(() => {
                const isSelected = selectedRowAction === 0 && selectedColAction === 0;
                const isNash = analysis.nashEquilibria.some(([r, c]) => r === 0 && c === 0);
                const isRowBest = analysis.rowBestResponses[0]?.[0];
                const isColBest = analysis.colBestResponses[0]?.[0];
                const p = getPayoff(game.matrix, 0, 0);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowAction(0);
                      setSelectedColAction(0);
                    }}
                    className={`p-3 rounded border transition-all relative ${
                      isSelected ? 'ring-2 ring-stone-400' : ''
                    } ${
                      isNash
                        ? 'bg-emerald-950/40 border-emerald-700/80'
                        : 'bg-[#181513] border-[#292524] hover:border-stone-700'
                    }`}
                  >
                    {isNash && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] bg-emerald-900 text-emerald-300 rounded font-mono">
                        NASH
                      </span>
                    )}
                    <div className="text-base font-bold font-mono">
                      <span
                        className={
                          showBestResponses && isRowBest
                            ? 'text-amber-400 underline decoration-amber-400 font-extrabold'
                            : 'text-amber-300'
                        }
                      >
                        {p[0]}
                      </span>
                      <span className="text-stone-500 mx-1">,</span>
                      <span
                        className={
                          showBestResponses && isColBest
                            ? 'text-sky-400 underline decoration-sky-400 font-extrabold'
                            : 'text-sky-300'
                        }
                      >
                        {p[1]}
                      </span>
                    </div>
                  </button>
                );
              })()}
              {/* Cell (0, 1) */}
              {(() => {
                const isSelected = selectedRowAction === 0 && selectedColAction === 1;
                const isNash = analysis.nashEquilibria.some(([r, c]) => r === 0 && c === 1);
                const isRowBest = analysis.rowBestResponses[0]?.[1];
                const isColBest = analysis.colBestResponses[0]?.[1];
                const p = getPayoff(game.matrix, 0, 1);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowAction(0);
                      setSelectedColAction(1);
                    }}
                    className={`p-3 rounded border transition-all relative ${
                      isSelected ? 'ring-2 ring-stone-400' : ''
                    } ${
                      isNash
                        ? 'bg-emerald-950/40 border-emerald-700/80'
                        : 'bg-[#181513] border-[#292524] hover:border-stone-700'
                    }`}
                  >
                    {isNash && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] bg-emerald-900 text-emerald-300 rounded font-mono">
                        NASH
                      </span>
                    )}
                    <div className="text-base font-bold font-mono">
                      <span
                        className={
                          showBestResponses && isRowBest
                            ? 'text-amber-400 underline decoration-amber-400 font-extrabold'
                            : 'text-amber-300'
                        }
                      >
                        {p[0]}
                      </span>
                      <span className="text-stone-500 mx-1">,</span>
                      <span
                        className={
                          showBestResponses && isColBest
                            ? 'text-sky-400 underline decoration-sky-400 font-extrabold'
                            : 'text-sky-300'
                        }
                      >
                        {p[1]}
                      </span>
                    </div>
                  </button>
                );
              })()}

              {/* Row 1 */}
              <div className="p-2 bg-[#1b1816] rounded border border-[#292524] font-semibold text-amber-300 flex items-center justify-center">
                {game.rowActions[1]}
              </div>
              {/* Cell (1, 0) */}
              {(() => {
                const isSelected = selectedRowAction === 1 && selectedColAction === 0;
                const isNash = analysis.nashEquilibria.some(([r, c]) => r === 1 && c === 0);
                const isRowBest = analysis.rowBestResponses[1]?.[0];
                const isColBest = analysis.colBestResponses[1]?.[0];
                const p = getPayoff(game.matrix, 1, 0);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowAction(1);
                      setSelectedColAction(0);
                    }}
                    className={`p-3 rounded border transition-all relative ${
                      isSelected ? 'ring-2 ring-stone-400' : ''
                    } ${
                      isNash
                        ? 'bg-emerald-950/40 border-emerald-700/80'
                        : 'bg-[#181513] border-[#292524] hover:border-stone-700'
                    }`}
                  >
                    {isNash && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] bg-emerald-900 text-emerald-300 rounded font-mono">
                        NASH
                      </span>
                    )}
                    <div className="text-base font-bold font-mono">
                      <span
                        className={
                          showBestResponses && isRowBest
                            ? 'text-amber-400 underline decoration-amber-400 font-extrabold'
                            : 'text-amber-300'
                        }
                      >
                        {p[0]}
                      </span>
                      <span className="text-stone-500 mx-1">,</span>
                      <span
                        className={
                          showBestResponses && isColBest
                            ? 'text-sky-400 underline decoration-sky-400 font-extrabold'
                            : 'text-sky-300'
                        }
                      >
                        {p[1]}
                      </span>
                    </div>
                  </button>
                );
              })()}
              {/* Cell (1, 1) */}
              {(() => {
                const isSelected = selectedRowAction === 1 && selectedColAction === 1;
                const isNash = analysis.nashEquilibria.some(([r, c]) => r === 1 && c === 1);
                const isRowBest = analysis.rowBestResponses[1]?.[1];
                const isColBest = analysis.colBestResponses[1]?.[1];
                const p = getPayoff(game.matrix, 1, 1);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRowAction(1);
                      setSelectedColAction(1);
                    }}
                    className={`p-3 rounded border transition-all relative ${
                      isSelected ? 'ring-2 ring-stone-400' : ''
                    } ${
                      isNash
                        ? 'bg-emerald-950/40 border-emerald-700/80'
                        : 'bg-[#181513] border-[#292524] hover:border-stone-700'
                    }`}
                  >
                    {isNash && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] bg-emerald-900 text-emerald-300 rounded font-mono">
                        NASH
                      </span>
                    )}
                    <div className="text-base font-bold font-mono">
                      <span
                        className={
                          showBestResponses && isRowBest
                            ? 'text-amber-400 underline decoration-amber-400 font-extrabold'
                            : 'text-amber-300'
                        }
                      >
                        {p[0]}
                      </span>
                      <span className="text-stone-500 mx-1">,</span>
                      <span
                        className={
                          showBestResponses && isColBest
                            ? 'text-sky-400 underline decoration-sky-400 font-extrabold'
                            : 'text-sky-300'
                        }
                      >
                        {p[1]}
                      </span>
                    </div>
                  </button>
                );
              })()}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-3 px-1">
              <span>Payoffs: (Row Player, Column Player)</span>
              {showBestResponses && (
                <span className="text-amber-400/90">Underlines indicate best responses</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Analysis & Equilibrium Diagnostics */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Strategy Profile Box */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg">
            <div className="text-xs font-semibold text-stone-200 mb-2">
              Selected Strategy Profile: ({game.rowActions[selectedRowAction]},{' '}
              {game.colActions[selectedColAction]})
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] text-amber-400 uppercase font-mono">
                  {game.rowPlayerName} Payoff
                </div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {currentPayoff[0]}
                </div>
              </div>
              <div className="p-2 bg-[#1a1715] rounded border border-[#292524]">
                <div className="text-[10px] text-sky-400 uppercase font-mono">
                  {game.colPlayerName} Payoff
                </div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {currentPayoff[1]}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {isCurrentNash ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  This is a Pure Nash Equilibrium! Neither player can improve by deviating.
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Unstable state: at least one player has an incentive to unilaterally deviate.
                </div>
              )}
            </div>
          </div>

          {/* Equilibrium Report */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg text-xs leading-relaxed">
            <div className="font-semibold text-stone-200 mb-2 flex items-center justify-between">
              <span>Equilibrium Analysis</span>
              <Badge variant="unit">
                {analysis.nashEquilibria.length === 0
                  ? 'Mixed Strategy Only'
                  : `${analysis.nashEquilibria.length} Pure Nash`}
              </Badge>
            </div>
            <p className="text-stone-300 mb-3">{game.equilibriumExplanation}</p>
            <div className="p-2.5 rounded bg-[#181513] border border-[#292524] space-y-1 text-stone-400 text-[11px]">
              <div>
                <strong className="text-stone-300">Definition:</strong> A state (a₁*, a₂*) where
                u₁(a₁*, a₂*) ≥ u₁(a₁, a₂*) and u₂(a₁*, a₂*) ≥ u₂(a₁*, a₂).
              </div>
              <div>
                <strong className="text-stone-300">Minimax connection:</strong> In zero-sum games,
                Nash Equilibrium matches the minimax value (von Neumann Minimax Theorem).
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
