import type { QuizItem } from './Quiz';

export const UNIT2_QUESTION_BANK: (QuizItem & { outcome: 'CO1' | 'CO4'; topic: string })[] = [
  // 1. Problem Formulation
  {
    id: 'u2-bank-01',
    topic: 'State-Space Formulation',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      'In formal artificial intelligence problem formulation, which 5-tuple completely defines a state-space search problem?',
    options: [
      {
        id: 'a',
        text: 'Initial State, Actions, Transition Model, Goal Test, Path Cost Function',
        isCorrect: true,
        explanation:
          "A search problem is formally formulated by {s₀, Actions(s), Result(s, a), GoalTest(s), c(s, a, s')}.",
      },
      {
        id: 'b',
        text: 'Heuristic Function, Frontier Queue, Explored Set, Alpha Cutoff, Beta Cutoff',
        isCorrect: false,
        explanation:
          'These are implementation data structures of search algorithms, not problem formulation components.',
      },
      {
        id: 'c',
        text: 'Variables, Domains, Constraints, Arc Consistency, Backtracking',
        isCorrect: false,
        explanation: 'This 3-tuple {X, D, C} defines a Constraint Satisfaction Problem (CSP).',
      },
      {
        id: 'd',
        text: 'Chromosome, Fitness Function, Crossover Rate, Mutation Rate, Elitism',
        isCorrect: false,
        explanation: 'These are hyperparameters of Genetic Algorithms.',
      },
    ],
  },

  // 2. BFS vs DFS Space Complexity
  {
    id: 'u2-bank-02',
    topic: 'Uninformed Search',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'Why is Breadth-First Search (BFS) rarely practical for problems with high branching factor b and deep goal depth d, despite guaranteeing shortest-path optimality for unit step costs?',
    options: [
      {
        id: 'a',
        text: 'Memory exhaustion: BFS retains the entire frontier in RAM, consuming O(bᵈ) exponential space.',
        isCorrect: true,
        explanation:
          'BFS space complexity is O(bᵈ). For b=10 and d=10, storing 10¹⁰ nodes requires over 1 Terabyte of memory, exhausting RAM long before CPU time expires.',
      },
      {
        id: 'b',
        text: 'BFS is incomplete in finite state spaces.',
        isCorrect: false,
        explanation: 'BFS is strictly complete whenever the branching factor b is finite.',
      },
      {
        id: 'c',
        text: 'BFS cannot handle graphs with directed edges.',
        isCorrect: false,
        explanation: 'BFS functions perfectly on both directed and undirected graphs.',
      },
      {
        id: 'd',
        text: 'BFS has exponential time complexity while DFS has linear time complexity.',
        isCorrect: false,
        explanation: 'Both BFS and DFS have exponential time complexity in the worst case.',
      },
    ],
  },

  // 3. IDDFS Optimality & Overhead
  {
    id: 'u2-bank-03',
    topic: 'Uninformed Search',
    outcome: 'CO1',
    bloomLevel: 'apply',
    question:
      'Iterative Deepening Depth-First Search (IDDFS) repeatedly regenerates nodes at shallow depths. What is the asymptotic time complexity of IDDFS with branching factor b and goal depth d?',
    options: [
      {
        id: 'a',
        text: 'O(bᵈ), because the exponential growth of tree levels ensures nodes at depth d dominate the total count.',
        isCorrect: true,
        explanation:
          'In a geometric series with b ≥ 2, the bottom level bᵈ contains more nodes than all previous levels combined. The re-generation overhead is at most a constant factor b / (b - 1), preserving O(bᵈ) time with linear O(bd) space.',
      },
      {
        id: 'b',
        text: 'O(d · bᵈ), adding an extra multiplicative factor of d to every operation.',
        isCorrect: false,
        explanation: 'Summing (d - k + 1)bᵏ yields O(bᵈ) when b > 1, not O(d · bᵈ).',
      },
      {
        id: 'c',
        text: 'O(b!), factorial time growth.',
        isCorrect: false,
        explanation: 'IDDFS is exponential in depth, not factorial.',
      },
      {
        id: 'd',
        text: 'O(d²), quadratic polynomial time.',
        isCorrect: false,
        explanation: 'Search spaces grow exponentially with depth, not polynomially.',
      },
    ],
  },

  // 4. Bidirectional Search
  {
    id: 'u2-bank-04',
    topic: 'Uninformed Search',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'How does Bidirectional Search achieve a reduction in time complexity compared to unidirectional BFS?',
    options: [
      {
        id: 'a',
        text: 'It explores from both start and goal simultaneously, reducing complexity from O(bᵈ) to O(2 · b^(d/2)).',
        isCorrect: true,
        explanation:
          'Two search fringes meeting at the midpoint depth d/2 require expanding 2 · b^(d/2) nodes instead of bᵈ. For b=10, d=10: 2 · 10⁵ = 200,000 nodes versus 10,000,000,000 nodes.',
      },
      {
        id: 'b',
        text: 'It completely eliminates the need to store an explored set in memory.',
        isCorrect: false,
        explanation:
          'At least one frontier must be kept in memory to detect when the two frontiers collide.',
      },
      {
        id: 'c',
        text: 'It uses genetic crossover to jump between search trees.',
        isCorrect: false,
        explanation:
          'Bidirectional search is a systematic graph traversal algorithm, not an evolutionary algorithm.',
      },
      {
        id: 'd',
        text: 'It requires zero knowledge of the goal state representation.',
        isCorrect: false,
        explanation:
          'Bidirectional search requires explicit ability to generate predecessor states backward from the goal.',
      },
    ],
  },

  // 5. A* Heuristic Formula
  {
    id: 'u2-bank-05',
    topic: 'Informed Search',
    outcome: 'CO1',
    bloomLevel: 'remember',
    question: 'In A* search, what is the exact definition of the node evaluation function f(n)?',
    options: [
      {
        id: 'a',
        text: 'f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is the estimated cost from n to goal.',
        isCorrect: true,
        explanation:
          'A* combines Dijkstra cost g(n) with heuristic guidance h(n) to estimate total path cost through node n.',
      },
      {
        id: 'b',
        text: 'f(n) = g(n) - h(n), subtracting heuristic error from accumulated path cost.',
        isCorrect: false,
        explanation:
          'Subtracting heuristic cost would prioritize paths with large distances to the goal.',
      },
      {
        id: 'c',
        text: 'f(n) = h(n), considering only distance to the goal.',
        isCorrect: false,
        explanation:
          'f(n) = h(n) defines Greedy Best-First Search, which is incomplete and not optimal.',
      },
      {
        id: 'd',
        text: 'f(n) = g(n) / h(n), taking the ratio of cost to remaining distance.',
        isCorrect: false,
        explanation: 'Evaluation functions are linear sums of path cost and heuristic estimate.',
      },
    ],
  },

  // 6. Admissibility Definition
  {
    id: 'u2-bank-06',
    topic: 'Informed Search',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      'What mathematical condition defines an admissible heuristic h(n) for goal state g and true optimal remaining cost h*(n)?',
    options: [
      {
        id: 'a',
        text: '0 ≤ h(n) ≤ h*(n) for all nodes n, and h(goal) = 0 (it never overestimates the true cost to reach the goal).',
        isCorrect: true,
        explanation:
          'Admissibility requires the heuristic to be an optimistic lower bound: h(n) ≤ h*(n). This guarantees A* Tree Search will never return a suboptimal path.',
      },
      {
        id: 'b',
        text: 'h(n) ≥ h*(n) for all nodes n (it always overestimates the cost).',
        isCorrect: false,
        explanation:
          'Overestimating heuristics destroy optimality guarantees by making optimal paths look artificially expensive.',
      },
      {
        id: 'c',
        text: 'h(n) = g(n) for all nodes n.',
        isCorrect: false,
        explanation: 'g(n) is cost from start, not remaining cost to goal.',
      },
      {
        id: 'd',
        text: 'h(n) must be strictly negative for all non-goal states.',
        isCorrect: false,
        explanation: 'Heuristic costs must be non-negative (h(n) ≥ 0).',
      },
    ],
  },

  // 7. Consistency (Monotonicity)
  {
    id: 'u2-bank-07',
    topic: 'Informed Search',
    outcome: 'CO1',
    bloomLevel: 'apply',
    question:
      "A heuristic h(n) is consistent (monotone) if for every node n and successor n' generated by action a, it satisfies the triangle inequality:",
    options: [
      {
        id: 'a',
        text: "h(n) ≤ c(n, a, n') + h(n')",
        isCorrect: true,
        explanation:
          "Consistency states that the estimated cost of reaching the goal from n cannot be greater than the step cost to n' plus the estimated cost from n'. Every consistent heuristic is admissible.",
      },
      {
        id: 'b',
        text: "h(n) ≥ c(n, a, n') + h(n')",
        isCorrect: false,
        explanation: 'This inverts the triangle inequality.',
      },
      {
        id: 'c',
        text: "h(n) = c(n, a, n') · h(n')",
        isCorrect: false,
        explanation:
          'Consistency is an additive triangle inequality condition, not multiplicative.',
      },
      {
        id: 'd',
        text: 'h(n) + g(n) = constant',
        isCorrect: false,
        explanation: 'Total cost varies across nodes and is not constant.',
      },
    ],
  },

  // 8. Consistency Graph Search Benefit
  {
    id: 'u2-bank-08',
    topic: 'Informed Search',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'What crucial algorithmic guarantee does consistency provide to A* Graph Search that admissibility alone does NOT guarantee?',
    options: [
      {
        id: 'a',
        text: 'When any node n is selected for expansion from the priority queue, the path found to n is guaranteed to be optimal; nodes never need to be reopened.',
        isCorrect: true,
        explanation:
          'Under consistency, f-values along any path are monotonically non-decreasing. When a node is expanded, its g(n) is provably minimal, preventing the need to re-expand previously closed states.',
      },
      {
        id: 'b',
        text: 'It reduces the worst-case space complexity from exponential to O(1).',
        isCorrect: false,
        explanation:
          'A* must still store all open and closed nodes in memory, remaining exponential in the worst case.',
      },
      {
        id: 'c',
        text: 'It allows A* to run without computing edge step costs.',
        isCorrect: false,
        explanation: "Step costs c(n, a, n') are essential for calculating g(n).",
      },
      {
        id: 'd',
        text: 'It converts A* into an uninformed search algorithm.',
        isCorrect: false,
        explanation:
          'Consistent heuristics enhance informed search; they do not remove heuristic guidance.',
      },
    ],
  },

  // 9. Local Search Traps
  {
    id: 'u2-bank-09',
    topic: 'Local Search',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      'In basic steepest-ascent hill climbing, what is a "ridge" and why is it particularly challenging for the algorithm?',
    options: [
      {
        id: 'a',
        text: 'A sequence of local maxima where the slope gently rises toward a peak, but navigating along grid-aligned axes causes steepest ascent to oscillate and terminate prematurely.',
        isCorrect: true,
        explanation:
          'A ridge is sloped, but because moves are restricted to orthogonal axes, every single one-step orthogonal move leads downward, causing steepest-ascent to falsely declare a local maximum.',
      },
      {
        id: 'b',
        text: 'A flat plateau where all neighbors have exactly equal objective function values.',
        isCorrect: false,
        explanation: 'Equal objective neighbors define a plateau or shoulder, not a ridge.',
      },
      {
        id: 'c',
        text: 'A global minimum in a maximization problem.',
        isCorrect: false,
        explanation: 'That is the bottom of a valley, not a ridge.',
      },
      {
        id: 'd',
        text: 'A memory leak caused by expanding too many frontier nodes.',
        isCorrect: false,
        explanation: 'Hill climbing uses O(1) memory and maintains no frontier.',
      },
    ],
  },

  // 10. Simulated Annealing Metropolis Acceptance
  {
    id: 'u2-bank-10',
    topic: 'Local Search',
    outcome: 'CO1',
    bloomLevel: 'apply',
    question:
      'In Simulated Annealing for a maximization problem, if a newly generated neighbor state produces a negative change in objective value (ΔE = f(n) - f(current) < 0), what probability formula determines whether the downward move is accepted?',
    options: [
      {
        id: 'a',
        text: 'P = e^(ΔE / T), where T is the current temperature parameter.',
        isCorrect: true,
        explanation:
          'The Metropolis criterion accepts worsening moves with probability P = e^(ΔE / T). When T is high, P approaches 1 (frequent escapes); as T cools toward 0, P approaches 0 (pure hill climbing).',
      },
      {
        id: 'b',
        text: 'P = 1 - (ΔE / T)',
        isCorrect: false,
        explanation:
          'Linear formulas can yield probabilities < 0 or > 1, violating probability axioms.',
      },
      {
        id: 'c',
        text: 'P = 0, worsening moves are never accepted in simulated annealing.',
        isCorrect: false,
        explanation:
          'Rejecting all worsening moves reduces simulated annealing to standard hill climbing.',
      },
      {
        id: 'd',
        text: 'P = 1.0, all moves are unconditionally accepted.',
        isCorrect: false,
        explanation: 'Accepting all moves results in a pure undirected random walk.',
      },
    ],
  },

  // 11. CSP Components
  {
    id: 'u2-bank-11',
    topic: 'Constraint Satisfaction Problems',
    outcome: 'CO1',
    bloomLevel: 'remember',
    question:
      'A Constraint Satisfaction Problem (CSP) is formally defined by three components {X, D, C}. What do these symbols represent?',
    options: [
      {
        id: 'a',
        text: 'X is a set of variables, D is a set of domains for each variable, and C is a set of constraints specifying allowable value combinations.',
        isCorrect: true,
        explanation:
          'CSP formulation: X = {X₁, ..., X_n}, D = {D₁, ..., D_n}, and C = {C₁, ..., C_m} restricting valid variable assignments.',
      },
      {
        id: 'b',
        text: 'X is coordinates, D is distance matrix, and C is cost function.',
        isCorrect: false,
        explanation: 'This describes geometric route planning, not CSP.',
      },
      {
        id: 'c',
        text: 'X is crossover rate, D is DNA chromosome, and C is convergence threshold.',
        isCorrect: false,
        explanation: 'These are Genetic Algorithm terms.',
      },
      {
        id: 'd',
        text: 'X is explored set, D is depth limit, and C is cutoff condition.',
        isCorrect: false,
        explanation: 'These are uninformed search parameters.',
      },
    ],
  },

  // 12. AC-3 Time Complexity
  {
    id: 'u2-bank-12',
    topic: 'Constraint Satisfaction Problems',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'For a CSP with c binary constraints (giving 2c directed arcs) and maximum domain size d, what is the worst-case time complexity of the AC-3 arc-consistency algorithm?',
    options: [
      {
        id: 'a',
        text: 'O(c · d³)',
        isCorrect: true,
        explanation:
          'Each arc (X_i, X_j) can be inserted into the queue at most d times (since D(X_i) can shrink at most d times). Each revision checks d · d = d² value pairs. Total worst-case work: (2c · d) × d² = O(c · d³).',
      },
      {
        id: 'b',
        text: 'O(c · d)',
        isCorrect: false,
        explanation:
          'Pairwise consistency checks require O(d²) operations per arc revision, exceeding O(c · d).',
      },
      {
        id: 'c',
        text: 'O(d^c)',
        isCorrect: false,
        explanation:
          'AC-3 runs in polynomial time, unlike brute-force backtracking which is exponential.',
      },
      {
        id: 'd',
        text: 'O(1)',
        isCorrect: false,
        explanation: 'AC-3 iteratively processes a queue of constraint arcs.',
      },
    ],
  },

  // 13. MRV Heuristic
  {
    id: 'u2-bank-13',
    topic: 'Constraint Satisfaction Problems',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      'Why is the Minimum Remaining Values (MRV) heuristic for CSP variable ordering known as the "fail-first" heuristic?',
    options: [
      {
        id: 'a',
        text: 'By selecting the variable with the fewest remaining legal values, it detects unviable branches as early as possible, pruning doomed search subtrees close to the root.',
        isCorrect: true,
        explanation:
          'If a variable has only 1 or 2 valid values, assigning it first forces any inevitable failure to occur immediately, saving thousands of recursive calls lower in the tree.',
      },
      {
        id: 'b',
        text: 'It deliberately induces software crashes to test system error handlers.',
        isCorrect: false,
        explanation: 'Fail-first refers to pruning search branches, not system crashes.',
      },
      {
        id: 'c',
        text: 'It selects the variable that conflicts with the highest number of already assigned variables.',
        isCorrect: false,
        explanation: 'Variables selected must not conflict with already assigned variables.',
      },
      {
        id: 'd',
        text: 'It orders values rather than variables.',
        isCorrect: false,
        explanation: 'MRV is a variable selection heuristic; value ordering is handled by LCV.',
      },
    ],
  },

  // 14. Least Constraining Value (LCV)
  {
    id: 'u2-bank-14',
    topic: 'Constraint Satisfaction Problems',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'In contrast to MRV, why is the Least Constraining Value (LCV) heuristic described as "succeed-first"?',
    options: [
      {
        id: 'a',
        text: 'It selects the value that rules out the fewest choices for neighboring unassigned variables, leaving maximum flexibility to find a complete solution without backtracking.',
        isCorrect: true,
        explanation:
          'When we want to find any single valid solution, picking the least restrictive value maximizes the probability that downstream unassigned variables will still have legal assignments.',
      },
      {
        id: 'b',
        text: 'It assigns the value that wipes out all neighboring domains.',
        isCorrect: false,
        explanation: 'Wiping out neighboring domains causes immediate backtracking failure.',
      },
      {
        id: 'c',
        text: 'It forces the algorithm to explore all possible solutions rather than stopping at the first one.',
        isCorrect: false,
        explanation:
          'If finding all solutions, value ordering does not matter because every value must eventually be tested.',
      },
      {
        id: 'd',
        text: 'It applies only to genetic algorithms.',
        isCorrect: false,
        explanation: 'LCV is a CSP backtracking search heuristic.',
      },
    ],
  },

  // 15. Minimax Assumption
  {
    id: 'u2-bank-15',
    topic: 'Adversarial Search',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      'What fundamental behavioral assumption does the standard Minimax algorithm make regarding the opponent (MIN player)?',
    options: [
      {
        id: 'a',
        text: "MIN plays rationally and perfectly, always selecting the move that minimizes MAX's utility.",
        isCorrect: true,
        explanation:
          'Minimax assumes optimal adversarial play in a zero-sum game: MIN minimizes payoff while MAX maximizes payoff.',
      },
      {
        id: 'b',
        text: 'MIN picks moves randomly according to a uniform probability distribution.',
        isCorrect: false,
        explanation:
          'Random opponent behavior requires Expectiminimax with chance nodes, not standard Minimax.',
      },
      {
        id: 'c',
        text: 'MIN cooperates with MAX to achieve maximum joint utility.',
        isCorrect: false,
        explanation:
          'Minimax is designed for zero-sum adversarial games, not cooperative coordination.',
      },
      {
        id: 'd',
        text: 'MIN only searches to depth 1 regardless of available compute time.',
        isCorrect: false,
        explanation:
          'Minimax assumes both players evaluate the full game tree depth symmetrically.',
      },
    ],
  },

  // 16. Alpha-Beta Cutoff Condition
  {
    id: 'u2-bank-16',
    topic: 'Adversarial Search',
    outcome: 'CO1',
    bloomLevel: 'apply',
    question:
      'In Alpha-Beta pruning, what mathematical condition triggers a cutoff (pruning remaining children) during the recursive traversal?',
    options: [
      {
        id: 'a',
        text: 'Whenever alpha ≥ beta (at a MIN node, if the child score v ≤ alpha; at a MAX node, if child score v ≥ beta).',
        isCorrect: true,
        explanation:
          'Alpha is the best value MAX can guarantee; Beta is the best value MIN can guarantee. If alpha ≥ beta, the current branch is provably inferior to an already discovered alternative and is pruned.',
      },
      {
        id: 'b',
        text: 'Whenever alpha < beta.',
        isCorrect: false,
        explanation:
          'When alpha < beta, search must continue because a better mutually acceptable outcome might exist.',
      },
      {
        id: 'c',
        text: 'Whenever a leaf node has an odd numeric score.',
        isCorrect: false,
        explanation: 'Parity of leaf scores has no bearing on game tree pruning.',
      },
      {
        id: 'd',
        text: 'Whenever both players choose the same move.',
        isCorrect: false,
        explanation: 'Players move sequentially in turn-based game trees.',
      },
    ],
  },

  // 17. Alpha-Beta Optimal Complexity
  {
    id: 'u2-bank-17',
    topic: 'Adversarial Search',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'With perfect move ordering where the best moves are always explored first, what is the effective time complexity of Alpha-Beta search for branching factor b and depth d?',
    options: [
      {
        id: 'a',
        text: 'O(b^(d/2)), effectively halving the search exponent and doubling the achievable search depth in the same compute time.',
        isCorrect: true,
        explanation:
          'Under optimal move ordering, the effective branching factor drops from b to √b. A computer that could previously evaluate depth 6 can now evaluate depth 12 in the exact same time.',
      },
      {
        id: 'b',
        text: 'O(b · d), reducing the problem from exponential to linear complexity.',
        isCorrect: false,
        explanation: 'Game trees remain fundamentally exponential.',
      },
      {
        id: 'c',
        text: 'O(d²), quadratic polynomial complexity.',
        isCorrect: false,
        explanation: 'Game tree leaves grow exponentially with depth.',
      },
      {
        id: 'd',
        text: 'O(1), computing optimal moves via a hash table lookup.',
        isCorrect: false,
        explanation:
          'Transposition tables assist search, but total tree exploration remains O(b^(d/2)).',
      },
    ],
  },

  // 18. Chess Engine Horizon Effect & Quiescence
  {
    id: 'u2-bank-18',
    topic: 'Case Study: Chess Game Engine',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'In game-playing engines, how does Quiescence Search (q-search) successfully neutralize the Horizon Effect?',
    options: [
      {
        id: 'a',
        text: 'It continues searching along tactical capture cascades beyond the fixed depth limit until the board reaches a tactically quiet, non-volatile state before calling the static evaluation function.',
        isCorrect: true,
        explanation:
          'Evaluating a board in the middle of a queen-for-pawn trade produces deceptive evaluation scores. Quiescence search resolves all active captures first, ensuring static evaluations are truthful.',
      },
      {
        id: 'b',
        text: 'It substitutes the evaluation function with a random coin flip whenever a queen is under attack.',
        isCorrect: false,
        explanation: 'Quiescence search is deterministic and tactical.',
      },
      {
        id: 'c',
        text: 'It permanently doubles the total search depth across all quiet non-capture moves.',
        isCorrect: false,
        explanation:
          'Doubling depth across quiet moves would cause catastrophic combinatorial explosion.',
      },
      {
        id: 'd',
        text: 'It disables alpha-beta pruning.',
        isCorrect: false,
        explanation: 'Quiescence search uses alpha-beta pruning internally.',
      },
    ],
  },

  // 19. Genetic Algorithm Schema Theorem
  {
    id: 'u2-bank-19',
    topic: 'Self-Study: Genetic Algorithms',
    outcome: 'CO1',
    bloomLevel: 'understand',
    question:
      "According to Holland's Schema Theorem, which characteristics allow building blocks (schemas) to grow exponentially over successive generations in a Genetic Algorithm?",
    options: [
      {
        id: 'a',
        text: 'Short defining length δ(H), low order o(H), and above-average fitness f(H).',
        isCorrect: true,
        explanation:
          'Short defining length minimizes the probability of being cut apart by crossover, low order minimizes disruption by mutation, and above-average fitness ensures frequent selection.',
      },
      {
        id: 'b',
        text: 'Maximum defining length and below-average fitness.',
        isCorrect: false,
        explanation:
          'Long schemas are easily destroyed by crossover; low fitness schemas are weeded out by selection.',
      },
      {
        id: 'c',
        text: 'Zero mutation and zero crossover.',
        isCorrect: false,
        explanation:
          'Without crossover and mutation, the population cannot evolve novel candidate solutions.',
      },
      {
        id: 'd',
        text: 'Only schemas with wildcard count equal to zero.',
        isCorrect: false,
        explanation: 'Schemas with zero wildcards represent single fully specified individuals.',
      },
    ],
  },

  // 20. Game Theory Nash Equilibrium
  {
    id: 'u2-bank-20',
    topic: 'Further Reading: Game Theory',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'What distinguishes a Nash Equilibrium from a Pareto Optimal outcome in multi-agent game theory?',
    options: [
      {
        id: 'a',
        text: 'A Nash Equilibrium is stable under individual self-interest (no player can unilaterally improve), whereas Pareto Optimality is a collective property where no player can be made better off without making another worse off.',
        isCorrect: true,
        explanation:
          "In the Prisoner's Dilemma, (Defect, Defect) is the unique Nash Equilibrium (-2, -2) because neither player can unilaterally improve. However, (Cooperate, Cooperate) is Pareto Optimal (0, 0) because both players are strictly better off.",
      },
      {
        id: 'b',
        text: 'Nash Equilibrium applies only to single-player games, while Pareto Optimality applies to two-player games.',
        isCorrect: false,
        explanation: 'Both concepts apply to multi-player games.',
      },
      {
        id: 'c',
        text: 'Nash Equilibrium requires zero-sum payoffs, whereas Pareto Optimality requires negative payoffs.',
        isCorrect: false,
        explanation: 'Both concepts apply across general-sum games with arbitrary payoffs.',
      },
      {
        id: 'd',
        text: 'There is no difference; all Nash Equilibria are automatically Pareto Optimal.',
        isCorrect: false,
        explanation:
          "The Prisoner's Dilemma is the canonical counter-example proving Nash equilibria can be Pareto suboptimal.",
      },
    ],
  },
];
