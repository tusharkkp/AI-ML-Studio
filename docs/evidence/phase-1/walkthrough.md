# Student Walkthrough & Self-Critique Report — Phase 1 (BFS Slice)

## 1. Student Journey Simulation

- **Step 1 (Arrival):** Student opens `http://localhost:3000/`. The page displays the "AIML Studio" heading, syllabus alignment (MIT AOE · 2304322T), course outcomes CO1–CO4, and the 6 unit cards.
- **Step 2 (Navigation):** Student clicks the primary CTA: *"Explore Demo Vertical Slice (BFS)"*. Navigates seamlessly to `/learn/unit-2/bfs`.
- **Step 3 (The Hook):** Reads the 75-word real-world story about Pune warehouse robot routing and why detour elimination is critical.
- **Step 4 (Intuition & Jargon):** Reads the pebble-in-pond ripple analogy. Hovers over *"FIFO Queue"* to view the glossary definition and why queue order enforces level-by-level exploration.
- **Step 5 (Predict-Then-Reveal):** The student encounters the prediction card. Chooses *"The path with the fewest steps (optimal)"*. The card validates their hypothesis and reveals why concentric ripples guarantee this property.
- **Step 6 (Interactive Lab Play):**
  - Clicks **Play** on the Warehouse Grid.
  - The blue wavefront spreads outward. Frontier size and nodes expanded update in the metrics strip.
  - The narration bar announces: *"Popped (1, 1)... Goal reached at (5, 7)! Reconstructed optimal path with cost 10."*
  - The optimal path illuminates in yellow.
  - Student clicks **Step Back** to inspect how the path was traced backwards from docking bay to robot.
- **Step 7 (Make It Fail):** Student clicks *"Make It Fail"*. The grid loads the trapped robot preset. The student hits Play and watches the frontier exhaustively search every reachable cell before announcing: *"Frontier is empty. No path exists to the goal."* The student reads the failure analysis explaining memory explosion $O(b^d)$.
- **Step 8 (Knowledge Check):** Student takes the 4-question quiz covering all 3 core misconceptions. Selects answers, clicks *"Check Answers"*, reads explanations for distractors, scores 100%, and receives celebratory confetti.
- **Step 9 (Persistence):** Reloads browser. LocalStorage confirms concept marked as read, lab completed, and quiz passed (100%).

---

## 2. Review Loop Self-Critique (LOOP_ENGINEERING.md §9)

1. **What would a confused first-year hit first?**  
   *Answer:* Confusing BFS step-count optimality with real-world road navigation with traffic/speed limits. Resolved by prominently featuring Misconception 1 and Quiz Item 3 contrasting BFS with Dijkstra / Uniform-Cost Search.
2. **Which claim here am I least sure is correct, and how did I verify it?**  
   *Answer:* That early goal testing (checking upon generation) does not violate optimality on unweighted grids. Verified via mathematical invariant analysis: since all edge costs are identical, any newly generated child at depth $d$ has minimal path length, so delaying the check until pop only wastes expanding depth $d$ siblings.
3. **Which test would catch me if I'm wrong?**  
   *Answer:* `web/src/engines/search/bfs/engine.test.ts` line 92 (fast-check property test running 200 random grids asserting that the reconstructed path length is strictly contiguous and minimal).
4. **What did I skip or defer?**  
   *Answer:* Multi-algorithm side-by-side race view (BFS vs DFS vs A* on the same grid) is reserved for Phase 3 (Unit 2 flagship module).
5. **What is the single biggest risk left?**  
   *Answer:* Maintaining this high pedagogical quality, zero-warning verification, and deep interactive lab standard consistently across all 73 remaining syllabus topics. The phase-by-phase gate structure prevents quality degradation.

