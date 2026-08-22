import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MedicalDiagnosisLab } from '@/labs/medical-diagnosis/MedicalDiagnosisLab';
import { Link } from 'react-router-dom';

export function MedicalDiagnosisCaseStudy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Case Study: Medical Diagnosis System
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Case Study 1
          </Badge>
          <Badge variant="default">Clinical Expert System &bull; 1.0 Hour</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Case Study: Clinical Diagnosis &amp; Blood Crossmatch Expert System
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          Experience how symbolic artificial intelligence diagnoses infectious hematological
          disorders, calculates Certainty Factors, and provides verifiable &ldquo;Why&rdquo; and
          &ldquo;How&rdquo; explanation facilities.
        </p>
      </header>

      {/* 1. Clinical Context & History */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Clinical Background &amp; Historical Context
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          In 1972 at Stanford University, Dr. Edward Shortliffe began development of{' '}
          <strong>MYCIN</strong>, an automated clinical consultation system for bacteremia and
          meningitis. At the time, microbiological blood cultures took 48 to 72 hours, but septic
          shock could kill a patient within 12 hours. Physicians were forced to prescribe
          broad-spectrum antibiotics empirically under high uncertainty.
        </p>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          MYCIN solved this by combining:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm mb-1">
              Production Rules
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              600 declarative Horn rules capturing expert infectious disease heuristics.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm mb-1">
              Certainty Factors
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Probabilistic belief metrics $CF \in [-1.0, +1.0]$ to manage clinical uncertainty.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 text-sm mb-1">
              Explanation Facility
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Transparent justification trees answering &ldquo;Why&rdquo; and &ldquo;How&rdquo;.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. Interactive Clinical Simulator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Clinical Consultation Lab
          </h2>
          <Badge variant="unit" unit={1}>
            Live Expert System
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Load patient clinical records, test interactive symptom Q&amp;A, inspect the active
          hypothesis via &ldquo;Why are you asking this?&rdquo;, and evaluate emergency blood
          transfusion crossmatches.
        </p>

        <MedicalDiagnosisLab />
      </section>

      {/* 3. The Two Explanation Pillars */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          The Two Pillars: &lsquo;Why&rsquo; vs &lsquo;How&rsquo;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Dynamic Inquiry Phase
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              The &lsquo;Why&rsquo; Facility
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed">
              When the computer asks a doctor:{' '}
              <em>&ldquo;Is the platelet count &lt; 100,000 / μL?&rdquo;</em>, the clinician can
              immediately ask: <strong>&ldquo;Why?&rdquo;</strong>
            </p>
            <p className="text-xs text-warm-600 dark:text-warm-400 leading-relaxed">
              The engine looks at its current goal stack and responds:{' '}
              <em>
                &ldquo;I am currently attempting to evaluate Rule R1_DHF for Dengue Hemorrhagic
                Fever. Knowing the platelet count is required to determine whether hemorrhagic
                leakage risk exists.&rdquo;
              </em>
            </p>
          </Card>

          <Card className="p-5 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Post-Diagnosis Audit Phase
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              The &lsquo;How&rsquo; Facility
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed">
              Once the system announces:{' '}
              <em>&ldquo;Diagnosis: Acute Bacterial Sepsis (Confidence 96%)&rdquo;</em>, the doctor
              asks: <strong>&ldquo;How?&rdquo;</strong>
            </p>
            <p className="text-xs text-warm-600 dark:text-warm-400 leading-relaxed">
              The engine displays the exact derivation tree:{' '}
              <em>
                &ldquo;Because high_fever was verified (39.8°C), high_wbc was verified (18,500/μL),
                and hypotension was verified (systolic 82 mmHg), satisfying all premises of Rule
                R2_SEPSIS.&rdquo;
              </em>
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Transfusion Crossmatch Safety */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Transfusion Crossmatch &amp; Immunohematology Rules
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Transfusion safety is governed by deterministic immunological rules. In our second lab
          tab, we implemented the logic directly reflecting the instructor&rsquo;s{' '}
          <code>trans.pl</code> Prolog code:
        </p>

        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`% From instructor material trans.pl
compatible(Donor, Recipient) :-
    donor_antigens(Donor, AgList),
    recipient_antibodies(Recipient, AbList),
    disjoint(AgList, AbList).

% O- carries NO antigens (A, B, or Rh), making it universally safe
donor_antigens('O-', []).
donor_antigens('A+', ['A', 'Rh']).
donor_antigens('AB+', ['A', 'B', 'Rh']).

% AB+ serum carries NO antibodies, making it the universal recipient
recipient_antibodies('AB+', []).
recipient_antibodies('O-', ['Anti-A', 'Anti-B', 'Anti-Rh']).`}</pre>
        </Card>
      </section>

      {/* 5. CO4 Critical Evaluation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Strengths &amp; Limitations Analysis (CO4)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2">
              Why Expert Systems Excel in Medicine
            </h4>
            <ul className="text-xs space-y-1.5 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                Deterministic auditability required by hospital ethics boards and malpractice law.
              </li>
              <li>
                Rare diseases where training data for deep learning is virtually nonexistent (sample
                size n &lt; 20 patients).
              </li>
              <li>Clear separation of medical guidelines from hospital IT infrastructure.</li>
            </ul>
          </Card>

          <Card className="p-4 border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2">
              Why They Were Not Adopted Nationwide in the 1980s
            </h4>
            <ul className="text-xs space-y-1.5 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                Required clinicians to manually type 40 symptoms into a slow green-screen terminal.
              </li>
              <li>
                Legal liability: if MYCIN gave bad advice, who is sued—Stanford, the programmer, or
                the doctor?
              </li>
              <li>Zero integration with early non-digital paper medical charts.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 6. Summary and Navigation */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">
              Next: Case Study 2
            </span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Case Study 2: Self-Driving Vehicle Simulation
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Analyze perception-action loops, multi-sensor fusion, and autonomous arbitration in
              urban traffic environments.
            </p>
          </div>
          <Link to="/case-studies/self-driving-vehicle">
            <Button variant="primary">Launch Self-Driving Case Study &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
