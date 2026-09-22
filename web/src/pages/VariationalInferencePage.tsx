import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { VariationalInferenceLab } from '@/labs/variational-inference/VariationalInferenceLab';

export const VariationalInferencePage: React.FC = () => {
  const quizItems = [
    {
      id: 'vi-q1',
      question:
        'Why does exact Bayesian inference become intractable for complex probabilistic models with continuous latent variables?',
      options: [
        {
          id: 'A',
          text: 'The marginal likelihood evidence in the denominator, p(x) = ∫ p(x, z) dz, requires integrating the joint distribution over a high-dimensional continuous latent space z, for which no closed-form analytical solution exists.',
          isCorrect: true,
          explanation:
            'While computing the joint probability p(x, z) is straightforward, marginalizing out latent variables z requires computing an intractable integral across all possible latent configurations.',
        },
        {
          id: 'B',
          text: 'Because Bayes theorem is only mathematically valid for discrete binary variables.',
          isCorrect: false,
          explanation:
            'Bayes theorem applies identically to discrete and continuous random variables; the barrier is integration complexity in continuous high dimensions.',
        },
        {
          id: 'C',
          text: 'Because gradient descent cannot be computed on floating point numbers.',
          isCorrect: false,
          explanation: 'Gradient descent operates on continuous floating point numbers natively.',
        },
      ],
    },
    {
      id: 'vi-q2',
      question:
        'In the core identity ln p(x) = ELBO(φ) + KL(q_φ(z) ∥ p(z|x)), why does maximizing the Evidence Lower Bound (ELBO) directly minimize the divergence between our approximation q and the true posterior p?',
      options: [
        {
          id: 'A',
          text: 'The true marginal evidence ln p(x) is a fixed constant with respect to the variational parameters φ; because KL divergence is strictly non-negative, maximizing ELBO forces KL(q ∥ p) toward its minimum possible value.',
          isCorrect: true,
          explanation:
            'Since ln p(x) = ELBO(φ) + KL(q ∥ p) is fixed for a given observed dataset x, any increase in ELBO must be accompanied by an equal decrease in KL divergence. When ELBO equals ln p(x), the approximation is exact (KL = 0).',
        },
        {
          id: 'B',
          text: 'Because the ELBO can grow infinitely larger than the evidence ln p(x).',
          isCorrect: false,
          explanation:
            'By definition, the Evidence Lower Bound is a lower bound on ln p(x); it can never exceed the true evidence because KL(q ∥ p) >= 0.',
        },
        {
          id: 'C',
          text: 'Because KL divergence can become negative when the learning rate is large.',
          isCorrect: false,
          explanation:
            'Gibbs inequality proves that Kullback-Leibler divergence is strictly non-negative (KL >= 0) for any two probability distributions.',
        },
      ],
    },
    {
      id: 'vi-q3',
      question:
        'What is the fundamental reason Variational Inference exhibits "mode-seeking" behavior (variance underestimation) on multimodal true posteriors?',
      options: [
        {
          id: 'A',
          text: 'VI minimizes the reverse KL divergence KL(q ∥ p) = E_q[ln(q / p)]. If q(z) > 0 in a region where the true posterior p(z|x) ≈ 0, the ratio q/p approaches infinity, incurring a catastrophic penalty. Thus, q(z) is forced to 0 wherever p is small, collapsing onto a single mode.',
          isCorrect: true,
          explanation:
            'This is known as the "zero-forcing" property of reverse KL divergence. To avoid severe penalties, q(z) stays within the support of one mode and completely ignores other distant modes.',
        },
        {
          id: 'B',
          text: 'Because Gaussian distributions can only be evaluated at positive values of z.',
          isCorrect: false,
          explanation:
            'Gaussian distributions are defined across the entire real number line (-infinity to +infinity).',
        },
        {
          id: 'C',
          text: 'Because the learning rate causes the optimizer to bounce between modes indefinitely.',
          isCorrect: false,
          explanation:
            'Mode-seeking is a fundamental mathematical property of the reverse KL objective function, independent of the numerical optimization algorithm.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/learn/unit-4" className="hover:text-foreground transition-colors">
          Unit 4
        </Link>
        <span>/</span>
        <span className="text-foreground">Variational inference</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Further Reading</Badge>
          <Badge variant="outline">0.3 Hours</Badge>
          <Badge variant="outline">CO2, CO4</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Variational inference (VI)
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          Turning integration into optimization.{' '}
          <span className="text-cream font-medium">
            When calculating the exact Bayesian posterior is mathematically impossible,
          </span>{' '}
          we posit a tractable family of distributions and climb the Evidence Lower Bound (ELBO).
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          In Bayesian machine learning, the posterior distribution p(z | x) tells us what we should
          believe about latent hidden causes z after observing evidence x. According to Bayes rule,
          p(z | x) = p(x, z) / p(x). The numerator p(x, z) is easily computed from our generative
          story. The denominator p(x) = ∫ p(x, z) dz is the marginal likelihood (the evidence).
        </p>
        <p className="body-text mt-3">
          For almost any interesting model (such as Bayesian neural networks or latent Dirichlet
          allocation), this integral has no closed-form formula. Classical methods resort to Markov
          Chain Monte Carlo (MCMC), simulating millions of random walks. But MCMC is notoriously
          slow on large datasets.{' '}
          <span className="text-cream font-medium">Variational inference</span> replaces random
          sampling with deterministic numerical optimization: we propose a simple, friendly family
          of shapes q_φ(z) (like a Gaussian) and adjust its knobs (μ, σ) until it matches the true
          posterior as closely as possible.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          The slate dashed curve represents an intractable bimodal posterior p(z|x). Drag the mean
          (μ) and standard deviation (σ) sliders to adjust the creamy variational Gaussian q_φ(z).
          Watch how the live ELBO score climbs as KL divergence drops toward zero, or click
          "Coordinate ascent" to let the optimizer automatically lock onto the optimal mode.
        </p>
        <VariationalInferenceLab />
      </section>

      {/* 3. Step by step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="space-y-3 rounded-xl border border-warm-border bg-surface p-5">
          {[
            [
              'Define the latent model',
              'Specify prior p(z) and likelihood p(x | z), yielding the joint distribution p(x, z) = p(z) · p(x | z).',
            ],
            [
              'Acknowledge intractability',
              'The evidence integral p(x) = ∫ p(x, z) dz cannot be evaluated analytically.',
            ],
            [
              'Choose a variational family',
              'Select a tractable density family q_φ(z) parameterized by φ (e.g. Mean-Field Gaussian with mean μ and variance σ²).',
            ],
            [
              'Derive the ELBO',
              'Apply Jensen inequality to write ln p(x) >= E_q[ln p(x, z)] - E_q[ln q(z)] = ELBO(φ).',
            ],
            [
              'Connect ELBO to KL divergence',
              'Establish the identity: ln p(x) = ELBO(φ) + KL(q_φ(z) ∥ p(z|x)). Since ln p(x) is constant, maximizing ELBO minimizes KL divergence.',
            ],
            [
              'Optimize parameters',
              'Execute Coordinate Ascent Variational Inference (CAVI) or stochastic gradient ascent to update φ until convergence.',
            ],
          ].map(([step, desc], i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-foreground">{step}: </span>
                <span className="text-neutral-400 text-sm">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Formal math */}
      <section className="mb-10">
        <h2 className="section-heading">4. Formal mathematical foundations</h2>
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="rounded-lg border border-warm-border bg-surface p-4 font-mono text-xs leading-loose">
            <div className="text-neutral-500 mb-2">// Derivation via Jensen Inequality</div>
            <div>ln p(x) = ln ∫ p(x, z) dz = ln ∫ q(z) · ( p(x, z) / q(z) ) dz</div>
            <div> = ln E_q[ p(x, z) / q(z) ]</div>
            <div>
              {' '}
              &gt;= E_q[ ln ( p(x, z) / q(z) ) ] (by Jensen inequality, since ln is concave)
            </div>
            <div> = E_q[ ln p(x, z) ] - E_q[ ln q(z) ] = ELBO(φ)</div>
            <div className="mt-2 text-neutral-500">
              // Relationship with Kullback-Leibler (KL) Divergence
            </div>
            <div>KL(q_φ(z) ∥ p(z|x)) = ∫ q_φ(z) · ln( q_φ(z) / p(z|x) ) dz &gt;= 0</div>
            <div>ln p(x) = ELBO(φ) + KL(q_φ(z) ∥ p(z|x))</div>
            <div className="mt-2 text-neutral-500">// ELBO Equivalent Formulation</div>
            <div>ELBO(φ) = E_q[ ln p(x | z) ] - KL(q_φ(z) ∥ p(z))</div>
            <div> = Reconstruction Likelihood - Complexity Penalty</div>
          </div>
          <p>
            The second formulation is the bedrock of modern{' '}
            <span className="text-cream font-medium">Variational Autoencoders (VAEs)</span>: the
            first term measures how well latent variable z reconstructs the observed input x, while
            the second term penalizes deviation from the prior distribution p(z).
          </p>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function CoordinateAscentVariationalInference(p(x, z), q_family):
    Initialize variational parameters φ = (μ_1..d, σ_1..d)
    
    repeat:
        for each latent factor j in 1 .. d:
            // Update parameter φ_j while holding other factors fixed
            q*_j(z_j) ∝ exp( E_{i ≠ j}[ ln p(x, z) ] )
            update φ_j to match q*_j
            
        // Calculate current Evidence Lower Bound
        current_elbo ← ComputeELBO(p, q_φ)
        
    until (current_elbo - previous_elbo) < tolerance

    return q_φ  // Optimal analytical approximation to true posterior`}
        </pre>
      </section>

      {/* 6. Code in Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`import numpy as np

def true_log_joint(z):
    # Log joint of bimodal Gaussian: 0.4*N(-2, 0.7^2) + 0.6*N(2, 0.9^2)
    p1 = 0.4 * np.exp(-0.5 * ((z + 2.0) / 0.7)**2) / (0.7 * np.sqrt(2 * np.pi))
    p2 = 0.6 * np.exp(-0.5 * ((z - 2.0) / 0.9)**2) / (0.9 * np.sqrt(2 * np.pi))
    return np.log(np.maximum(p1 + p2, 1e-15))

def compute_elbo(mu, sigma, num_samples=10000):
    # Reparameterization trick: z = mu + sigma * epsilon
    eps = np.random.randn(num_samples)
    z = mu + sigma * eps
    
    # E_q[ln p(x, z)]
    log_joint_vals = true_log_joint(z)
    
    # E_q[ln q(z)] = -0.5 * ln(2*pi*e*sigma^2) (Gaussian differential entropy)
    entropy_q = 0.5 * np.log(2 * np.pi * np.e * (sigma ** 2))
    
    elbo = np.mean(log_joint_vals) + entropy_q
    return elbo

# Simple coordinate grid search optimizer
best_mu, best_sigma, max_elbo = 0.0, 1.0, -float('inf')
for mu in np.linspace(-3.0, 3.0, 61):
    for sigma in np.linspace(0.4, 2.0, 33):
        score = compute_elbo(mu, sigma)
        if score > max_elbo:
            max_elbo, best_mu, best_sigma = score, mu, sigma

print(f"Optimal Variational Mean (mu): {best_mu:.2f}")
print(f"Optimal Variational Std (sigma): {best_sigma:.2f}")
print(f"Maximized ELBO: {max_elbo:.3f}")`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">
              Mode collapse and variance underestimation:
            </span>{' '}
            In the lab, click the "Middle Averaging Trap" preset. A human might intuitively try to
            place a broad Gaussian at the center (μ=0, σ=2.2) to "cover" both modes. But because VI
            minimizes reverse KL(q ∥ p), any probability mass placed in the valley between the two
            peaks (where p(z) is low) incurs a massive numerical penalty. The optimizer firmly
            rejects this compromise and collapses onto a single peak.
          </p>
          <p>
            <span className="font-semibold text-red-400">Mean-field independence violation:</span>{' '}
            The popular Mean-Field approximation assumes all latent variables are mutually
            independent: q(z) = ∏ q_i(z_i). If true latent variables exhibit heavy correlations,
            Mean-Field VI severely underestimates posterior covariance, producing unrealistically
            narrow confidence bounds.
          </p>
        </div>
      </section>

      {/* 8. Strengths & Limitations */}
      <section className="mb-10">
        <h2 className="section-heading">8. Strengths, limitations, and when not to use it</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-green-700/40 bg-green-900/20 p-4">
            <p className="mb-2 font-semibold text-green-300">Strengths</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Orders of magnitude faster than MCMC sampling</li>
              <li>
                Scales cleanly to millions of samples via Stochastic Variational Inference (SVI)
              </li>
              <li>Deterministic convergence criteria (monitor ELBO improvement)</li>
              <li>Underpins modern deep generative models like VAEs and diffusion priors</li>
              <li>Provides an explicit analytical functional form for the posterior</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-4">
            <p className="mb-2 font-semibold text-red-300">Limitations and when not to use</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>
                Asymptotically biased: bounded by the expressive capacity of the chosen q family
              </li>
              <li>Underestimates posterior variance and uncertainty</li>
              <li>Cannot capture multiple separated modes with a unimodal q distribution</li>
              <li>
                Deriving coordinate updates for non-conjugate models requires complex score-function
                estimators
              </li>
              <li>
                If exact asymptotic fidelity is mandatory, use MCMC (Hamiltonian Monte Carlo / NUTS)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Common Misconceptions */}
      <section className="mb-10">
        <h2 className="section-heading">9. Common misconceptions</h2>
        <div className="space-y-4">
          {[
            {
              myth: 'Variational inference computes the exact posterior distribution',
              truth:
                'VI computes the best analytical approximation within an assumed family. If the true posterior is multimodal and your family is Gaussian, the approximation will never match reality perfectly.',
            },
            {
              myth: 'ELBO can exceed the true evidence ln p(x)',
              truth:
                'Because KL divergence is mathematically non-negative (KL >= 0), ELBO is strictly bounded from above by ln p(x). If an ELBO calculation produces a value higher than ln p(x), there is an integration or reparameterization bug.',
            },
            {
              myth: 'KL divergence is symmetric',
              truth:
                'KL(q ∥ p) ≠ KL(p ∥ q). Reverse KL (used in VI) is mode-seeking and zero-forcing. Forward KL (used in expectation propagation) is zero-avoiding and mode-covering.',
            },
          ].map(({ myth, truth }) => (
            <div key={myth} className="rounded-lg border border-warm-border bg-surface p-4">
              <p className="font-semibold text-orange-300 text-sm">Myth: {myth}</p>
              <p className="mt-1 text-sm text-neutral-400">{truth}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Quiz */}
      <section className="mb-10">
        <h2 className="section-heading">10. Check yourself</h2>
        <Quiz conceptId="u4-further-variational-inference" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'Derive the identity ln p(x) = ELBO + KL(q ∥ p).',
              'Start with KL(q ∥ p) = ∫ q(z) ln[ q(z) / p(z|x) ] dz. Substitute Bayes rule p(z|x) = p(x,z)/p(x): KL = ∫ q(z) [ ln q(z) - ln p(x,z) + ln p(x) ] dz. Since ∫ q(z) ln p(x) dz = ln p(x) ∫ q(z) dz = ln p(x), we have KL = -ELBO + ln p(x), which rearranges directly to ln p(x) = ELBO + KL.',
            ],
            [
              'What is the Mean-Field assumption in Variational Inference?',
              'The Mean-Field variational family assumes the latent variables partition into mutually independent factors: q(z) = ∏_{i=1}^M q_i(z_i). This factorization enables Coordinate Ascent updates because optimizing factor j requires computing expectations only over the remaining factors.',
            ],
            [
              'Contrast MCMC with Variational Inference in terms of scalability and bias.',
              'MCMC is non-parametric, asymptotically unbiased, but computationally expensive and difficult to scale to massive datasets. Variational Inference is parametric, asymptotically biased, but transforms inference into optimization, enabling stochastic mini-batch training on web-scale datasets.',
            ],
          ].map(([q, a]) => (
            <details key={q as string} className="rounded-lg border border-warm-border bg-surface">
              <summary className="cursor-pointer p-4 text-sm font-medium text-foreground">
                {q}
              </summary>
              <div className="border-t border-warm-border px-4 pb-4 pt-3 text-sm text-neutral-400">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 12. Summary */}
      <section className="mb-10">
        <h2 className="section-heading">12. Summary and key takeaways</h2>
        <ul className="space-y-2 text-sm text-neutral-400 list-disc list-inside">
          <li>
            Exact Bayesian posterior inference is intractable because the marginal evidence integral
            p(x) = ∫ p(x,z) dz has no closed form.
          </li>
          <li>
            Variational inference frames Bayesian reasoning as optimization over a parameterized
            family q_φ(z).
          </li>
          <li>
            Maximizing the Evidence Lower Bound (ELBO) directly minimizes the Kullback-Leibler
            divergence KL(q ∥ p).
          </li>
          <li>
            Reverse KL causes mode-seeking behavior and underestimates posterior uncertainty on
            multimodal targets.
          </li>
          <li>
            Forms the foundation of modern deep generative models, including Variational
            Autoencoders (VAEs).
          </li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/learn/unit-4',
              label: 'Unit 4 overview',
              desc: 'Review all concepts, labs, and case studies across Unit 4.',
            },
            {
              to: '/learn/unit-5',
              label: 'Unit 5: Linear & decision models',
              desc: 'Advance to decision trees, information gain, support vector machines, and ensemble methods.',
            },
          ].map(({ to, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-warm-border bg-surface p-4 transition-colors hover:border-brand/50"
            >
              <div className="font-semibold text-foreground group-hover:text-brand transition-colors">
                {label}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
