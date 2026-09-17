import {
  CategoricalSample,
  ContinuousSample,
  CategoricalNaiveBayesModel,
  GaussianNaiveBayesModel,
  GaussianFeatureParam,
  NaiveBayesPrediction,
  BayesPosteriorResult,
} from './types';

/**
 * Train a Categorical Naive Bayes model with optional Additive (Laplace) Smoothing.
 */
export function trainCategoricalNaiveBayes(
  data: CategoricalSample[],
  featureNames: string[],
  targetName: string,
  alpha = 1.0
): CategoricalNaiveBayesModel {
  if (data.length === 0) {
    throw new Error('Cannot train Naive Bayes on empty dataset');
  }

  const totalSamples = data.length;
  const classCounts: Record<string, number> = {};
  const featureVocabularies: Record<string, Set<string>> = {};

  featureNames.forEach((f) => {
    featureVocabularies[f] = new Set<string>();
  });

  // Count classes and build vocabularies
  data.forEach((sample) => {
    const c = sample[targetName];
    if (!c) return;
    classCounts[c] = (classCounts[c] ?? 0) + 1;

    featureNames.forEach((f) => {
      const val = sample[f];
      if (val !== undefined) {
        featureVocabularies[f]?.add(val);
      }
    });
  });

  const classes = Object.keys(classCounts).sort();
  const classPriors: Record<string, number> = {};
  const logClassPriors: Record<string, number> = {};

  classes.forEach((c) => {
    const count = classCounts[c] ?? 0;
    const prior = totalSamples > 0 ? count / totalSamples : 0;
    classPriors[c] = prior;
    logClassPriors[c] = prior > 0 ? Math.log(prior) : -1e9;
  });

  // Count joint occurrences: class -> feature -> value -> count
  const jointCounts: Record<string, Record<string, Record<string, number>>> = {};
  classes.forEach((c) => {
    const classObj: Record<string, Record<string, number>> = {};
    featureNames.forEach((f) => {
      const featureObj: Record<string, number> = {};
      const vocab = featureVocabularies[f];
      if (vocab) {
        vocab.forEach((val) => {
          featureObj[val] = 0;
        });
      }
      classObj[f] = featureObj;
    });
    jointCounts[c] = classObj;
  });

  data.forEach((sample) => {
    const c = sample[targetName];
    if (!c) return;
    featureNames.forEach((f) => {
      const val = sample[f];
      const targetClassObj = jointCounts[c];
      if (
        val !== undefined &&
        targetClassObj &&
        targetClassObj[f] &&
        targetClassObj[f][val] !== undefined
      ) {
        targetClassObj[f][val] += 1;
      }
    });
  });

  // Calculate likelihoods with Laplace smoothing: P(x|c) = (count + alpha) / (total_c + alpha * |V|)
  const featureLikelihoods: Record<string, Record<string, Record<string, number>>> = {};
  const logFeatureLikelihoods: Record<string, Record<string, Record<string, number>>> = {};

  classes.forEach((c) => {
    const cLikelihoods: Record<string, Record<string, number>> = {};
    const cLogLikelihoods: Record<string, Record<string, number>> = {};

    featureNames.forEach((f) => {
      const fLikelihoods: Record<string, number> = {};
      const fLogLikelihoods: Record<string, number> = {};
      const vocab = featureVocabularies[f];
      const vocabSize = vocab ? vocab.size : 1;
      const countInClass = classCounts[c] ?? 0;

      if (vocab) {
        vocab.forEach((val) => {
          const count = jointCounts[c]?.[f]?.[val] ?? 0;
          let prob = 0;
          if (alpha === 0 && countInClass === 0) {
            prob = 0;
          } else if (alpha === 0) {
            prob = count / countInClass;
          } else {
            prob = (count + alpha) / (countInClass + alpha * vocabSize);
          }

          fLikelihoods[val] = prob;
          fLogLikelihoods[val] = prob > 0 ? Math.log(prob) : -1e9;
        });
      }

      cLikelihoods[f] = fLikelihoods;
      cLogLikelihoods[f] = fLogLikelihoods;
    });

    featureLikelihoods[c] = cLikelihoods;
    logFeatureLikelihoods[c] = cLogLikelihoods;
  });

  const vocabArrayRecord: Record<string, string[]> = {};
  featureNames.forEach((f) => {
    const set = featureVocabularies[f];
    vocabArrayRecord[f] = set ? Array.from(set).sort() : [];
  });

  return {
    classes,
    classCounts,
    totalSamples,
    classPriors,
    logClassPriors,
    featureVocabularies: vocabArrayRecord,
    featureLikelihoods,
    logFeatureLikelihoods,
    alpha,
  };
}

/**
 * Predict class for a single query using Categorical Naive Bayes.
 */
export function predictCategoricalNaiveBayes(
  model: CategoricalNaiveBayesModel,
  features: Record<string, string>
): NaiveBayesPrediction {
  const logPosteriors: Record<string, number> = {};
  const stepLog: NaiveBayesPrediction['stepLog'] = [];
  const classBreakdown: Record<
    string,
    { prior: number; likelihoodTerms: number[]; unnormalizedScore: number }
  > = {};

  model.classes.forEach((c) => {
    let logSum = model.logClassPriors[c] ?? 0;
    const likelihoodTerms: number[] = [];

    Object.entries(features).forEach(([featureName, featureValue]) => {
      const vocab = model.featureVocabularies[featureName];
      const vocabSize = vocab ? vocab.length : 1;
      let logProb = -1e9;

      const classLikelihoods = model.logFeatureLikelihoods[c];
      const featureLikelihoods = classLikelihoods ? classLikelihoods[featureName] : undefined;
      if (featureLikelihoods && featureLikelihoods[featureValue] !== undefined) {
        logProb = featureLikelihoods[featureValue] ?? -1e9;
      } else {
        // Unseen feature value during training
        if (model.alpha > 0) {
          const countInClass = model.classCounts[c] ?? 0;
          const smoothedProb = model.alpha / (countInClass + model.alpha * (vocabSize + 1));
          logProb = Math.log(smoothedProb);
        } else {
          logProb = -1e9;
        }
      }

      likelihoodTerms.push(Math.exp(logProb));
      logSum += logProb;
    });

    logPosteriors[c] = logSum;
    classBreakdown[c] = {
      prior: model.classPriors[c] ?? 0,
      likelihoodTerms,
      unnormalizedScore: logSum,
    };
  });

  // Log-sum-exp normalization for probabilities
  const maxLog = Math.max(...Object.values(logPosteriors));
  let sumExp = 0;
  const expScores: Record<string, number> = {};

  model.classes.forEach((c) => {
    const cScore = logPosteriors[c] ?? 0;
    const val = Math.exp(cScore - maxLog);
    expScores[c] = val;
    sumExp += val;
  });

  const classProbabilities: Record<string, number> = {};
  let maxProb = -1;
  let predictedClass = model.classes[0] ?? '';

  model.classes.forEach((c) => {
    const eVal = expScores[c] ?? 0;
    const prob = sumExp > 0 ? eVal / sumExp : 1 / model.classes.length;
    classProbabilities[c] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      predictedClass = c;
    }
  });

  stepLog.push({
    step: 'Log-Posterior Calculation',
    details: 'Applied Bayes Rule in log-domain: log P(C|X) = log P(C) + Σ log P(X_i|C)',
    classBreakdown,
  });

  return {
    predictedClass,
    classProbabilities,
    logPosteriors,
    stepLog,
  };
}

/**
 * Train a Gaussian Naive Bayes model for continuous features.
 */
export function trainGaussianNaiveBayes(
  data: ContinuousSample[],
  featureNames: string[],
  targetName: string
): GaussianNaiveBayesModel {
  if (data.length === 0) {
    throw new Error('Cannot train Gaussian Naive Bayes on empty dataset');
  }

  const totalSamples = data.length;
  const classSamples: Record<string, ContinuousSample[]> = {};

  data.forEach((sample) => {
    const c = String(sample[targetName]);
    if (!classSamples[c]) {
      classSamples[c] = [];
    }
    classSamples[c]?.push(sample);
  });

  const classes = Object.keys(classSamples).sort();
  const classCounts: Record<string, number> = {};
  const classPriors: Record<string, number> = {};
  const logClassPriors: Record<string, number> = {};
  const featureParams: Record<string, Record<string, GaussianFeatureParam>> = {};

  classes.forEach((c) => {
    const samples = classSamples[c] ?? [];
    const n = samples.length;
    classCounts[c] = n;
    const prior = totalSamples > 0 ? n / totalSamples : 0;
    classPriors[c] = prior;
    logClassPriors[c] = prior > 0 ? Math.log(prior) : -1e9;
    const fParams: Record<string, GaussianFeatureParam> = {};

    featureNames.forEach((f) => {
      const values = samples.map((s) => Number(s[f])).filter((v) => !Number.isNaN(v));
      const mean = values.length > 0 ? values.reduce((acc, v) => acc + v, 0) / values.length : 0;
      const variance =
        (values.length > 0
          ? values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
          : 1) + 1e-9; // epsilon smoothing

      fParams[f] = { mean, variance };
    });
    featureParams[c] = fParams;
  });

  return {
    classes,
    classCounts,
    totalSamples,
    classPriors,
    logClassPriors,
    featureParams,
  };
}

/**
 * Predict using Gaussian Naive Bayes.
 */
export function predictGaussianNaiveBayes(
  model: GaussianNaiveBayesModel,
  features: Record<string, number>
): NaiveBayesPrediction {
  const logPosteriors: Record<string, number> = {};
  const stepLog: NaiveBayesPrediction['stepLog'] = [];
  const classBreakdown: Record<
    string,
    { prior: number; likelihoodTerms: number[]; unnormalizedScore: number }
  > = {};

  model.classes.forEach((c) => {
    let logSum = model.logClassPriors[c] ?? 0;
    const likelihoodTerms: number[] = [];

    Object.entries(features).forEach(([featureName, featureValue]) => {
      const params = model.featureParams[c]?.[featureName];
      if (params) {
        const { mean, variance } = params;
        // log N(x; mu, sigma^2) = -0.5 * log(2*pi*var) - ((x - mean)^2) / (2*var)
        const logLikelihood =
          -0.5 * Math.log(2 * Math.PI * variance) -
          Math.pow(featureValue - mean, 2) / (2 * variance);
        likelihoodTerms.push(Math.exp(logLikelihood));
        logSum += logLikelihood;
      }
    });

    logPosteriors[c] = logSum;
    classBreakdown[c] = {
      prior: model.classPriors[c] ?? 0,
      likelihoodTerms,
      unnormalizedScore: logSum,
    };
  });

  const maxLog = Math.max(...Object.values(logPosteriors));
  let sumExp = 0;
  const expScores: Record<string, number> = {};

  model.classes.forEach((c) => {
    const cScore = logPosteriors[c] ?? 0;
    const val = Math.exp(cScore - maxLog);
    expScores[c] = val;
    sumExp += val;
  });

  const classProbabilities: Record<string, number> = {};
  let maxProb = -1;
  let predictedClass = model.classes[0] ?? '';

  model.classes.forEach((c) => {
    const eVal = expScores[c] ?? 0;
    const prob = sumExp > 0 ? eVal / sumExp : 1 / model.classes.length;
    classProbabilities[c] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      predictedClass = c;
    }
  });

  stepLog.push({
    step: 'Gaussian Log-Posterior Calculation',
    details: 'Evaluated Gaussian probability density function for each continuous feature.',
    classBreakdown,
  });

  return {
    predictedClass,
    classProbabilities,
    logPosteriors,
    stepLog,
  };
}

/**
 * Analytical Bayes' Theorem calculator for medical / base-rate fallacy paradoxes.
 */
export function calculateBayesPosterior(
  prior: number,
  sensitivity: number,
  specificity: number,
  totalCohort = 1000
): BayesPosteriorResult {
  const complementPrior = 1 - prior;
  const falsePositiveRate = 1 - specificity;

  // Law of Total Probability for Evidence P(Positive)
  const evidencePositive = sensitivity * prior + falsePositiveRate * complementPrior;

  // Bayes' Formula: P(Disease | Positive) = P(Positive | Disease) * P(Disease) / P(Positive)
  const posteriorPositive = evidencePositive > 0 ? (sensitivity * prior) / evidencePositive : 0;

  // Natural Frequency representations
  const withCondition = Math.round(totalCohort * prior);
  const withoutCondition = totalCohort - withCondition;

  const truePositives = Math.round(withCondition * sensitivity);
  const falseNegatives = withCondition - truePositives;

  const falsePositives = Math.round(withoutCondition * falsePositiveRate);
  const trueNegatives = withoutCondition - falsePositives;

  return {
    prior,
    complementPrior,
    sensitivity,
    specificity,
    falsePositiveRate,
    evidencePositive,
    posteriorPositive,
    naturalFrequencies: {
      totalCohort,
      withCondition,
      withoutCondition,
      truePositives,
      falsePositives,
      trueNegatives,
      falseNegatives,
    },
  };
}
