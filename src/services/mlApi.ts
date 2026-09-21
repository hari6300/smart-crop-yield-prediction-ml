import { PredictionFormData, PredictionResult } from '../types';
import { CROPS_DATA } from '../data/cropData';

const API_BASE_URL =
  import.meta.env.VITE_ML_API_URL || 'http://localhost:5001';

interface ApiResponse {
  id: string;
  timestamp: string;
  predictedYield: number;
  yieldPerAcre: number;
  areaHectares: number;
  totalProduction: number;

  // Test-set R² from the trained Random Forest model
  modelR2: number;

  // Random Forest tree-to-tree prediction spread
  predictionSpread: {
    min: number;
    max: number;
  };

  yieldCategory: PredictionResult['yieldCategory'];

  featureImpacts: PredictionResult['featureImpacts'];

  recommendations: string[];

  model: string;

  input: Record<string, unknown>;
}

function normalizeCrop(crop: string): string {
  return crop.replace(/\s*\([^)]*\)/g, '').trim();
}

function normalizeSeason(season: string): string {
  if (season.startsWith('Kharif')) return 'Kharif';
  if (season.startsWith('Rabi')) return 'Rabi';
  if (season.startsWith('Zaid')) return 'Summer';
  if (season.startsWith('Whole Year')) return 'Whole Year';
  if (season.startsWith('Autumn')) return 'Autumn';
  if (season.startsWith('Winter')) return 'Winter';

  return season;
}

export async function predictCropYield(
  input: PredictionFormData
): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      crop: normalizeCrop(input.crop),
      state: input.state,
      district: input.district,

      // Area entered by the user in acres
      area: input.area,

      rainfall: input.rainfall,

      // Kept in the request for compatibility with the frontend.
      // The current Random Forest model does not use temperature
      // as one of its trained features.
      temperature: input.temperature,

      fertilizer: input.fertilizer,

      irrigation: input.irrigation,

      season: normalizeSeason(input.season),

      soilType: input.soilType,

      // Current prediction year
      year: new Date().getFullYear(),

      // Current backend accepts pesticide as an optional input.
      // Default value is used because it is not collected separately
      // in the current prediction form.
      pesticide: 2
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.error || `ML server returned ${response.status}`
    );
  }

  const data: ApiResponse = await response.json();

  const cropInfo = CROPS_DATA[input.crop];

  const pricePerTon =
    (cropInfo?.mspPerQuintal || 2200) * 10;

  return {
    id: data.id,

    timestamp: data.timestamp,

    input,

    predictedYield: data.predictedYield,

    yieldPerAcre: data.yieldPerAcre,

    areaHectares: data.areaHectares,

    totalProduction: data.totalProduction,

    // Test-set R², not confidence
    modelR2: data.modelR2,

    // Random Forest tree prediction spread
    predictionSpread: data.predictionSpread,

    yieldCategory: data.yieldCategory,

    featureImpacts: data.featureImpacts,

    recommendations: data.recommendations,

    estimatedRevenue: {
      pricePerTon,

      totalValue: Math.round(
        data.totalProduction * pricePerTon
      ),

      currency: '₹'
    }
  };
}