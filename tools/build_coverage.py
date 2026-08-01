import json
import os

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")

with open(os.path.join(DOCS_DIR, "syllabus.json"), "r", encoding="utf-8") as f:
    syllabus = json.load(f)

lines = [
    "# COVERAGE — AIML Studio Syllabus Coverage Matrix",
    "",
    "> Auto-verifiable matrix mapping every syllabus bullet (2304322T) to its concept page, interactive laboratory, engine trace, and assessment bank.",
    "",
    "## 1. Global Coverage Summary",
    f"- **Total Course Units:** {len(syllabus['units'])}",
    f"- **Total Syllabus Topics & Modules:** {sum(len(u['topics']) for u in syllabus['units'])}",
    "- **Target Concept Pages:** 74",
    "- **Target Interactive Labs:** 48+",
    "- **Target Algorithm Engines:** 32+",
    "- **Target Quiz Items:** ≥ 300+ items (≥ 4 per concept, ≥ 20 per unit test, plus viva banks)",
    "",
    "## 2. Unit-by-Unit Coverage Matrix Skeleton",
    "",
    "| Unit | Topic ID | Syllabus Topic Name | Target Concept Route | Interactive Lab ID | Engine ID | Min Quizzes | Status |",
    "|---|---|---|---|---|---|---|---|"
]

for u in syllabus["units"]:
    for t in u["topics"]:
        tid = t["id"]
        unit_num = u["unit"]
        route = f"/learn/unit-{unit_num}/{tid}"
        lab_id = f"lab-{tid}"
        engine_id = f"engine/{tid.replace('-', '/')}"
        min_quiz = 4 if t["kind"] == "core" else (4 if t["kind"] in ["case-study", "self-study"] else 2)
        status = "Pending Phase " + str(unit_num + 1)
        lines.append(f"| {unit_num} | `{tid}` | {t['name']} | `{route}` | `{lab_id}` | `{engine_id}` | {min_quiz} | {status} |")

with open(os.path.join(DOCS_DIR, "COVERAGE.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Generated docs/COVERAGE.md successfully.")

