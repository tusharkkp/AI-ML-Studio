export interface CategoricalSample {
  [key: string]: string;
}

export interface ContinuousSample {
  [key: string]: number | string;
}

export interface CategoricalNaiveBayesModel {
  classes: string[];
  classCounts: Record<string, number>;
  totalSamples: number;
  classPriors: Record<string, number>;
  logClassPriors: Record<string, number>;
  featureVocabularies: Record<string, string[]>;
  featureLikelihoods: Record<string, Record<string, Record<string, number>>>; // [class][feature][value] -> P(x|c)
  logFeatureLikelihoods: Record<string, Record<string, Record<string, number>>>;
  alpha: number;
}

export interface GaussianFeatureParam {
  mean: number;
  variance: number;
}

export interface GaussianNaiveBayesModel {
  classes: string[];
  classCounts: Record<string, number>;
  totalSamples: number;
  classPriors: Record<string, number>;
  logClassPriors: Record<string, number>;
  featureParams: Record<string, Record<string, GaussianFeatureParam>>; // [class][feature] -> { mean, variance }
}

export interface NaiveBayesPrediction {
  predictedClass: string;
  classProbabilities: Record<string, number>;
  logPosteriors: Record<string, number>;
  stepLog: Array<{
    step: string;
    details: string;
    classBreakdown?: Record<
      string,
      { prior: number; likelihoodTerms: number[]; unnormalizedScore: number }
    >;
  }>;
}

export interface BayesPosteriorResult {
  prior: number; // P(Disease)
  complementPrior: number; // P(Healthy)
  sensitivity: number; // P(Positive | Disease) - True Positive Rate
  specificity: number; // P(Negative | Healthy) - True Negative Rate
  falsePositiveRate: number; // P(Positive | Healthy) = 1 - specificity
  evidencePositive: number; // P(Positive) = sensitivity * prior + falsePositiveRate * complementPrior
  posteriorPositive: number; // P(Disease | Positive) = (sensitivity * prior) / evidencePositive
  naturalFrequencies: {
    totalCohort: number;
    withCondition: number;
    withoutCondition: number;
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
}
