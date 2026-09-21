import { CROPS_DATA } from '../data/cropData';
import { FeatureImpact, PredictionFormData, PredictionResult } from '../types';

export function runCropYieldPrediction(input: PredictionFormData): PredictionResult {
  const cropInfo = CROPS_DATA[input.crop] || {
    name: input.crop,
    icon: '🌱',
    category: 'Cereal',
    baselineYield: 3.5,
    tempRange: [18, 30] as [number, number],
    rainfallRange: [600, 1200] as [number, number],
    suitableSoils: ['Alluvial Soil', 'Black (Regur) Soil'],
    primaryStates: ['Punjab', 'Uttar Pradesh'],
    mspPerQuintal: 2200
  };

  const featureImpacts: FeatureImpact[] = [];
  let yieldMultiplier = 1.0;

  // 1. Rainfall evaluation (Gaussian curve around optimal midpoint)
  const [minRain, maxRain] = cropInfo.rainfallRange;
  const optimalRain = (minRain + maxRain) / 2;
  const rainDiff = Math.abs(input.rainfall - optimalRain);
  const rainTolerance = (maxRain - minRain) / 1.5;

  let rainFactor = 1.0;
  if (input.rainfall < minRain * 0.6) {
    rainFactor = 0.55 + 0.35 * (input.rainfall / (minRain * 0.6));
    featureImpacts.push({
      name: 'Rainfall Deficit',
      score: -Math.round((1 - rainFactor) * 100),
      status: 'negative',
      description: `Rainfall of ${input.rainfall} mm is substantially below the crop's ${minRain} mm minimum threshold.`
    });
  } else if (input.rainfall > maxRain * 1.5) {
    rainFactor = 0.7 + 0.2 * Math.max(0, 1 - (input.rainfall - maxRain * 1.5) / 1000);
    featureImpacts.push({
      name: 'Excess Rainfall',
      score: -Math.round((1 - rainFactor) * 100),
      status: 'negative',
      description: `Precipitation (${input.rainfall} mm) exceeds ${maxRain} mm, increasing waterlogging and root rot risks.`
    });
  } else {
    // Within safe range
    const deviation = Math.min(1, rainDiff / rainTolerance);
    rainFactor = 0.9 + 0.22 * (1 - Math.pow(deviation, 2));
    featureImpacts.push({
      name: 'Rainfall Suitability',
      score: Math.round((rainFactor - 1.0) * 100) + 12,
      status: 'positive',
      description: `${input.rainfall} mm matches favorable moisture requirements (${minRain}-${maxRain} mm range).`
    });
  }
  yieldMultiplier *= rainFactor;

  // 2. Temperature evaluation
  const [minTemp, maxTemp] = cropInfo.tempRange;
  const optimalTemp = (minTemp + maxTemp) / 2;
  let tempFactor = 1.0;

  if (input.temperature < minTemp) {
    tempFactor = Math.max(0.6, 1.0 - (minTemp - input.temperature) * 0.05);
    featureImpacts.push({
      name: 'Cold Temperature Stress',
      score: -Math.round((1 - tempFactor) * 100),
      status: 'negative',
      description: `Temperature (${input.temperature}°C) is colder than optimal ${minTemp}°C, slowing vegetative development.`
    });
  } else if (input.temperature > maxTemp) {
    tempFactor = Math.max(0.55, 1.0 - (input.temperature - maxTemp) * 0.045);
    featureImpacts.push({
      name: 'Thermal Heat Stress',
      score: -Math.round((1 - tempFactor) * 100),
      status: 'negative',
      description: `Elevated heat (${input.temperature}°C) stresses pollen viability and grain formation.`
    });
  } else {
    const tempDev = Math.abs(input.temperature - optimalTemp) / ((maxTemp - minTemp) / 2);
    tempFactor = 0.95 + 0.15 * (1 - tempDev);
    featureImpacts.push({
      name: 'Thermal Comfort',
      score: Math.round((tempFactor - 1.0) * 100) + 10,
      status: 'positive',
      description: `${input.temperature}°C provides optimal enzymatic and photosynthetic velocity.`
    });
  }
  yieldMultiplier *= tempFactor;

  // 3. Fertilizer Response (Law of Diminishing Returns)
  // Optimal benchmark ~ 120-160 kg/ha for cereals, lower for pulses, higher for sugarcane
  const cropTargetFert = cropInfo.category === 'Cash Crop' ? 220 : cropInfo.category === 'Pulse' ? 65 : 140;
  let fertFactor = 1.0;

  if (input.fertilizer < cropTargetFert * 0.4) {
    fertFactor = 0.68 + 0.2 * (input.fertilizer / (cropTargetFert * 0.4));
    featureImpacts.push({
      name: 'Nutrient Deficiency',
      score: -Math.round((1 - fertFactor) * 100),
      status: 'negative',
      description: `Application rate of ${input.fertilizer} kg/ha is insufficient for maximum biomass conversion.`
    });
  } else if (input.fertilizer > cropTargetFert * 1.8) {
    fertFactor = 0.92 - (input.fertilizer - cropTargetFert * 1.8) * 0.0015;
    featureImpacts.push({
      name: 'Fertilizer Overdose',
      score: -8,
      status: 'negative',
      description: `Excessive mineral salts (${input.fertilizer} kg/ha) may cause fertilizer burn and vegetative overgrowth.`
    });
  } else {
    fertFactor = 0.92 + 0.2 * (1 - Math.abs(input.fertilizer - cropTargetFert) / cropTargetFert);
    featureImpacts.push({
      name: 'Nutrient Sufficiency',
      score: Math.round((fertFactor - 1.0) * 100) + 10,
      status: 'positive',
      description: `${input.fertilizer} kg/ha matches targeted NPK absorption capacity.`
    });
  }
  yieldMultiplier *= fertFactor;

  // 4. Irrigation system efficiency
  let irrigationFactor = 1.0;
  if (input.irrigation === 'Drip Irrigation') {
    irrigationFactor = 1.16;
  } else if (input.irrigation === 'Sprinkler Irrigation') {
    irrigationFactor = 1.10;
  } else if (input.irrigation === 'Canal Irrigation') {
    irrigationFactor = 1.05;
  } else if (input.irrigation === 'Borewell / Tube-well') {
    irrigationFactor = 1.04;
  } else {
    // Rainfed
    irrigationFactor = input.rainfall > cropInfo.rainfallRange[0] ? 0.96 : 0.82;
  }
  featureImpacts.push({
    name: `${input.irrigation} Efficiency`,
    score: Math.round((irrigationFactor - 1.0) * 100),
    status: irrigationFactor >= 1.0 ? 'positive' : 'negative',
    description: irrigationFactor >= 1.05
      ? `Precision water delivery enhances root zone oxygenation and moisture consistency.`
      : `Water availability is reliant on natural precipitation cycles.`
  });
  yieldMultiplier *= irrigationFactor;

  // 5. Soil suitability
  const isOptimalSoil = cropInfo.suitableSoils.includes(input.soilType);
  let soilFactor = 1.0;
  if (isOptimalSoil) {
    soilFactor = 1.08;
    featureImpacts.push({
      name: 'Soil Compatibility',
      score: 12,
      status: 'positive',
      description: `${input.soilType} provides ideal texture, cation exchange capacity, and drainage for ${input.crop}.`
    });
  } else {
    soilFactor = 0.92;
    featureImpacts.push({
      name: 'Suboptimal Soil Matrix',
      score: -8,
      status: 'neutral',
      description: `${input.soilType} requires specialized soil conditioning to match ${input.crop}'s root structure.`
    });
  }
  yieldMultiplier *= soilFactor;

  // 6. Season match
  let seasonFactor = 1.0;
  if (input.crop === 'Wheat' && input.season.includes('Kharif')) {
    seasonFactor = 0.55;
  } else if (input.crop === 'Rice (Paddy)' && input.season.includes('Rabi')) {
    seasonFactor = 0.88;
  } else if (input.season.includes('Kharif') && (input.crop === 'Cotton' || input.crop === 'Soybean' || input.crop === 'Rice (Paddy)')) {
    seasonFactor = 1.06;
  } else if (input.season.includes('Rabi') && (input.crop === 'Wheat' || input.crop === 'Mustard' || input.crop === 'Chickpea (Gram)')) {
    seasonFactor = 1.06;
  }
  yieldMultiplier *= seasonFactor;

  // Calculate final predicted yield in tons/hectare
  // Introduce realistic micro-variance (e.g. ±2%) to simulate ensemble tree dispersion
  const variance = 1 + (Math.sin(input.area * 1.7 + input.temperature * 0.8) * 0.02);
  const rawYield = cropInfo.baselineYield * yieldMultiplier * variance;
  const predictedYield = Math.max(0.3, Number(rawYield.toFixed(2)));

  // Land area is in acres: 1 acre = 0.404686 hectares
  const areaInHectares = input.area * 0.404686;
  const yieldPerAcre = Number((predictedYield * 0.404686).toFixed(2));
  const areaHectares = Number(areaInHectares.toFixed(2));

  // Total production in metric tons from total acres cultivated
  const totalProduction = Number((predictedYield * areaInHectares).toFixed(2));

  // Confidence and category
  const confidenceScore = Number((93.5 + Math.min(3.5, yieldMultiplier * 1.5)).toFixed(1));
  const ciSpread = Number((predictedYield * 0.055).toFixed(2));
  const confidenceInterval = {
    min: Math.max(0.1, Number((predictedYield - ciSpread).toFixed(2))),
    max: Number((predictedYield + ciSpread).toFixed(2))
  };

  let yieldCategory: 'Low' | 'Moderate' | 'Good' | 'Optimal' | 'Exceptional' = 'Good';
  const ratio = predictedYield / cropInfo.baselineYield;
  if (ratio < 0.75) yieldCategory = 'Low';
  else if (ratio < 0.95) yieldCategory = 'Moderate';
  else if (ratio < 1.15) yieldCategory = 'Good';
  else if (ratio < 1.30) yieldCategory = 'Optimal';
  else yieldCategory = 'Exceptional';

  // Precision agronomy recommendations
  const recommendations: string[] = [];
  if (rainFactor < 0.85) {
    recommendations.push(`Schedule supplementary micro-irrigation rounds during critical flowering and grain-filling phases to overcome rainfall deficit.`);
  }
  if (input.fertilizer < cropTargetFert * 0.7) {
    recommendations.push(`Supplement base nutrition with foliar spray of 1.5% NPK (19:19:19) at active tillering/branching stage.`);
  } else if (input.fertilizer > cropTargetFert * 1.4) {
    recommendations.push(`Reduce synthetic nitrogen applications by 15-20% and incorporate organic vermicompost to stabilize soil pH.`);
  }
  if (input.irrigation === 'Rainfed (Monsoon)') {
    recommendations.push(`Adopt in-situ moisture conservation practices like broad-bed furrows (BBF) or straw mulching.`);
  } else if (input.irrigation === 'Drip Irrigation') {
    recommendations.push(`Utilize fertigation scheduling to deliver water-soluble nutrients directly to the root zone at 7-day intervals.`);
  }
  if (!isOptimalSoil) {
    recommendations.push(`Apply gypsum or bio-fertilizers (Azotobacter/Rhizobium) to improve porosity and nutrient absorption in ${input.soilType}.`);
  }
  if (recommendations.length < 3) {
    recommendations.push(`Maintain regular scouting for pests and install yellow sticky traps to keep pest thresholds below economic injury levels.`);
  }

  // Revenue estimation
  // 1 ton = 10 quintals
  const pricePerTon = cropInfo.mspPerQuintal * 10;
  const totalValue = Math.round(totalProduction * pricePerTon);

  return {
    id: `pred-${Date.now()}`,
    timestamp: new Date().toISOString(),
    input,
    predictedYield,
    yieldPerAcre,
    areaHectares,
    totalProduction,
    confidenceScore,
    confidenceInterval,
    yieldCategory,
    featureImpacts,
    recommendations: recommendations.slice(0, 3),
    estimatedRevenue: {
      pricePerTon,
      totalValue,
      currency: '₹'
    }
  };
}
