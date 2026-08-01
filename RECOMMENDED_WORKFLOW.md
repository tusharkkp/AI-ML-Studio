# Recommended Workflow — Building AIML Studio with Antigravity

This is **your** playbook (the human owner). It tells you what to do, in what order, and what to paste.

## Part A — One-time setup (≈ 20 min)

1. **Workspace root** should contain: the syllabus PDF, the extracted `ML/` folder (unzip `ML.zip` once so Antigravity can read files individually; keep the zip too).
2. **Copy these 6 files into the root:**
   `AGENT.md` · `01_MASTER_PROMPT.md` · `LOOP_ENGINEERING.md` · `Automated Verification Loops.md` · `skills.md` · `RECOMMENDED_WORKFLOW.md`
3. `git init` (if not already) and make a first commit **before** Antigravity touches anything. Add a root `.gitignore`:
   ```
   node_modules/
   web/dist/
   .venv/
   tools/ingest/out/
   ML/**/Artificial Intelligence_*.pdf
   ```
   (Decide separately whether `ML/` should be in your repo at all; the textbooks should not be pushed publicly.)
4. Install: **Node 20+**, **Git**, **Python 3.11+** (only for golden-fixture scripts), and a browser Antigravity's browser agent can drive.
5. In Antigravity settings: keep **Planning mode** on for phase work; set terminal command policy to **ask before running** at first (relax to auto for safe commands like tests/lint once you trust the flow); keep destructive commands on "always ask".

## Part B — The loop you will repeat for every phase

```
PROMPT → PLAN ARTIFACT → YOU REVIEW → BUILD → AGENT VERIFIES → YOU REVIEW DEMO → SIGN-OFF → NEXT PHASE
```

| Step | You do | Antigravity does |
|---|---|---|
| 1. Kick off | Paste the phase kickoff prompt (Part C) in **Planning mode** | Reads AGENT.md + PROGRESS.md, writes the implementation-plan artifact |
| 2. Review plan | Read it (10 min). Comment inline on the artifact; fix scope, order, risks. Reply **"Approved, proceed"** | Waits |
| 3. Build | Mostly watch; answer questions | Task loop: build → verify:fast → commit, updating PROGRESS.md |
| 4. Mid-phase check | After the **vertical slice** is built, open the dev server yourself (phone + laptop) | Shows slice + evidence |
| 5. Gate | Ask: "Run the phase gate" | `verify:phase`, browser walkthrough, evidence folder, demo artifact |
| 6. Review demo | Use the platform like a student for 20–30 min; read the confusion log; test on your phone | Fixes issues you list |
| 7. Sign-off | Reply **"Phase N signed off. Proceed to Phase N+1 planning."** | Records sign-off, starts next plan |

**Your review checklist per phase (10 questions):**
1. Could a classmate use this without me explaining anything?
2. Did I *predict* something and get surprised at least once? (If not, the lab is too passive.)
3. Do the numbers in the text match what the lab shows?
4. Is every syllabus bullet of this unit present? (open `docs/COVERAGE.md`)
5. Is there a "make it fail" moment for each algorithm?
6. Does it feel fast on my phone?
7. Can I use it with keyboard only?
8. Is any wording copied-feeling from the slides? (spot-check 3 paragraphs)
9. Are the quiz explanations helpful?
10. What's the one thing I'd be embarrassed to show my teacher?

## Part C — Prompts to paste

### C1. Project start (once)
> Read `AGENT.md`, `01_MASTER_PROMPT.md`, `LOOP_ENGINEERING.md`, `Automated Verification Loops.md` and `skills.md` in the workspace root. You are in Planning mode. Execute **Phase 0 only** exactly as specified in Master Prompt §14. Do not write application code. Produce the artifacts and stop for my approval.

### C2. Phase kickoff (Phases 1–9)
> We are starting **Phase N: <name>**. Read `docs/PROGRESS.md` and the Master Prompt sections for this phase. Produce the implementation-plan artifact: tasks (T#.##) with acceptance criteria, verification levels per task, order (vertical slice first), risks, and the exact commands for the phase gate. Do not build until I approve.

### C3. Approve and build
> Approved. Proceed with Phase N following LOOP_ENGINEERING. Start with the vertical slice, then stop and show me before continuing with the remaining tasks.

### C4. Run the gate
> Run the Phase N gate per `Automated Verification Loops.md` §4. Attach real command output, screenshots at 360/768/1280, the browser-agent student walkthrough with its confusion log, Lighthouse and bundle tables, regenerated COVERAGE.md, and the Review Loop answers. Don't claim anything you didn't run.

### C5. Resume a new session
> New session. Read `AGENT.md` and `docs/PROGRESS.md`. Run `git status` and `npm run verify:fast`. Summarise in ≤ 5 lines where we are, then continue with the current task per LOOP_ENGINEERING.

### C6. Bug / quality report
> Issue: <what you saw, page URL, device/viewport, steps>. Reproduce it first with a failing test or a screenshot, then fix via the RECOVERY LOOP, add a regression test, and update PROGRESS.md.

### C7. Content quality pass
> Take concept `<id>`. Run the Content Loop: machine checks, Pedagogy Checklist, then a browser-agent "new student" simulation. List the top 5 confusions and fix them. Show before/after.

### C8. Add something new (scope change)
> Proposal: <feature>. Do not build yet. Write a one-page proposal: learning value, effort, risks, impact on budgets/phases, and what you would drop or defer. Wait for my decision.

### C9. Stuck agent
> Stop. Write a Failure Report per LOOP_ENGINEERING §6 (symptom, hypotheses tested, evidence, root-cause theory, 2–3 options with a recommendation). Revert to the last green commit if the tree is messy.

## Part D — Suggested timeline (adapt to your calendar)

| Week | Focus | Notes |
|---|---|---|
| 1 | Phase 0 + Phase 1 | Don't rush Phase 1: the Player framework and template decide everything after. |
| 2 | Phase 2 (Unit 1) | Reasoning/logic is the hardest to make visual — keep scope tight. |
| 3–4 | Phase 3 (Unit 2) | Largest unit with most reusable engines; best showcase. |
| 5 | Phase 4 (Unit 3) | Regression + gradient descent labs; heavy math rendering. |
| 6 | Phases 5–6 (Units 4–5) | Strong reuse of earlier components. |
| 7 | Phase 7 (Unit 6) | No source folder: budget extra authoring + review time. |
| 8 | Phase 8–9 | Integration, hardening, deploy. |

Tip: **Phase 3 after Phase 1 is a good "first public beta"** — share it with 3–5 classmates and collect reactions before building the rest.

## Part E — Working with students as testers (highly recommended)

- After Phase 3, 5, and 7, sit with 2–3 classmates (don't coach them). Note where they hesitate; that's your backlog.
- Ask three questions: "What did you understand that you didn't before?" · "Where did you get stuck?" · "What would you not bother with?"
- Feed findings into the next phase plan as tasks.

## Part F — Sustainability

- Keep content in MDX + data files so teachers/juniors can contribute without touching engines (see the authoring guide produced in Phase 9).
- Tag a release per unit (`v0.2-unit1` …) so you can roll back.
- Revisit the syllabus mapping each academic year; `docs/syllabus.json` is the single place to update scope.

## Part G — Tips specific to Antigravity

- Use **Planning mode** for anything that creates or restructures many files; use faster modes only for tiny edits (typos, copy tweaks, single-component CSS).
- Ask it to **attach screenshots/recordings** from its browser agent to every UI task; skim those instead of reading code.
- Leave **comments on Artifacts** (plan, task list) to steer without writing new prompts.
- If it starts repeating itself or forgetting rules, end the session cleanly (it updates `PROGRESS.md`) and start a new one with prompt C5.
- Keep the six root files short enough to be read each session; if one grows beyond ~400 lines, split detail into `docs/` and keep a pointer.
