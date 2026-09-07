export interface SimulationParameters {
  numSimulations: number;
  delayThreshold: number;
  confidenceLevel: number;
}

export interface SimulationBin {
  binStart: number;
  binEnd: number;
  count: number;
  percentage: number;
  isExceedingThreshold: boolean;
}

export interface SimulationResult {
  expectedDelay: number;
  medianDelay: number;
  p90Delay: number;
  p95Delay: number;
  minDelay: number;
  maxDelay: number;
  probabilityExceedsThreshold: number;
  bins: SimulationBin[];
  numSimulations: number;
  delayThreshold: number;
}

export const validateSimulationParams = (
  params: SimulationParameters
): { isValid: boolean; error?: string } => {
  if (
    isNaN(params.numSimulations) ||
    params.numSimulations < 100 ||
    params.numSimulations > 100000
  ) {
    return {
      isValid: false,
      error: 'Simulation trial count must be an integer between 100 and 100,000 iterations.',
    };
  }

  if (isNaN(params.delayThreshold) || params.delayThreshold <= 0 || params.delayThreshold > 365) {
    return {
      isValid: false,
      error: 'Delay threshold must be a positive number of days between 1 and 365 days.',
    };
  }

  if (
    isNaN(params.confidenceLevel) ||
    params.confidenceLevel < 0.5 ||
    params.confidenceLevel >= 1.0
  ) {
    return {
      isValid: false,
      error: 'Confidence level must be a value between 0.50 (50%) and 0.99 (99%).',
    };
  }

  return { isValid: true };
};

/**
 * Generate synthetic Monte Carlo distribution using parametric Box-Muller sampling
 * skewed around project baseline expected delay.
 */
export const runMonteCarloSimulation = (
  baseExpectedDelay: number,
  params: SimulationParameters
): SimulationResult => {
  const { numSimulations, delayThreshold, confidenceLevel } = params;

  // Derive distribution parameters
  const mu = Math.log(Math.max(baseExpectedDelay, 1));
  const sigma = 0.38 + (baseExpectedDelay > 50 ? 0.08 : 0);

  const samples: number[] = [];
  let countExceeding = 0;

  for (let i = 0; i < numSimulations; i++) {
    // Standard normal via Box-Muller
    const u1 = Math.max(Math.random(), 1e-7);
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Log-normal sample
    const sample = Math.round(Math.exp(mu + sigma * z));
    const finalVal = Math.max(sample, 1);

    samples.push(finalVal);
    if (finalVal > delayThreshold) {
      countExceeding++;
    }
  }

  samples.sort((a, b) => a - b);

  const minDelay = samples[0];
  const maxDelay = samples[samples.length - 1];
  const sum = samples.reduce((acc, v) => acc + v, 0);
  const expectedDelay = Math.round(sum / numSimulations);
  const medianDelay = samples[Math.floor(numSimulations * 0.5)];
  const p90Delay = samples[Math.floor(numSimulations * 0.9)];
  const p95Delay = samples[Math.floor(numSimulations * confidenceLevel)];
  const probabilityExceedsThreshold = countExceeding / numSimulations;

  // Construct 12 histogram bins
  const binCount = 12;
  const binWidth = Math.max(Math.ceil((maxDelay - minDelay) / binCount), 1);
  const bins: SimulationBin[] = [];

  for (let b = 0; b < binCount; b++) {
    const bStart = minDelay + b * binWidth;
    const bEnd = b === binCount - 1 ? maxDelay : bStart + binWidth;
    const inBinCount = samples.filter((s) => s >= bStart && (b === binCount - 1 ? s <= bEnd : s < bEnd)).length;
    const pct = inBinCount / numSimulations;

    bins.push({
      binStart: bStart,
      binEnd: bEnd,
      count: inBinCount,
      percentage: pct,
      isExceedingThreshold: bEnd > delayThreshold,
    });
  }

  return {
    expectedDelay,
    medianDelay,
    p90Delay,
    p95Delay,
    minDelay,
    maxDelay,
    probabilityExceedsThreshold,
    bins,
    numSimulations,
    delayThreshold,
  };
};
