export type PageType =
  | 'dashboard'
  | 'prediction'
  | 'history'
  | 'analytics'
  | 'about'
  | 'bill-preview';

export interface PredictionFormData {
  crop: string;

  state: string;

  district: string;

  area: number; // in acres

  rainfall: number; // in mm

  temperature: number; // in °C

  fertilizer: number; // in kg/hectare

  irrigation: string;

  season: string;

  soilType: string;

  weatherSource?: string;

  isWeatherLive?: boolean;

  soilDetails?: {
    pH: number;

    organicCarbon: number;

    nitrogenStatus: string;

    phosphorusStatus: string;

    potassiumStatus: string;
  };

  fertilizerMode?: 'auto' | 'custom';
}

export interface FeatureImpact {
  name: string;

  score: number; // percentage or impact score -100 to +100

  status: 'positive' | 'neutral' | 'negative';

  description: string;
}

export interface PredictionResult {
  id: string;

  timestamp: string;

  input: PredictionFormData;

  predictedYield: number; // in tons/hectare

  yieldPerAcre?: number; // in tons/acre

  areaHectares?: number; // converted area in hectares

  totalProduction: number; // total harvest in metric tons

  /**
   * Test-set R² of the trained Random Forest model.
   * Current model R²: 91.81%
   *
   * Note:
   * R² is a model evaluation metric, not a confidence
   * probability for an individual prediction.
   */
  modelR2: number;

  /**
   * Prediction spread obtained from the Random Forest
   * tree predictions.
   *
   * This is a model prediction spread, not a statistical
   * confidence interval.
   */
  predictionSpread: {
    min: number;

    max: number;
  };

  yieldCategory:
    | 'Low'
    | 'Moderate'
    | 'Good'
    | 'Optimal'
    | 'Exceptional';

  featureImpacts: FeatureImpact[];

  recommendations: string[];

  estimatedRevenue: {
    pricePerTon: number;

    totalValue: number;

    currency: string;
  };
}

export interface CropInfo {
  name: string;

  icon: string;

  category:
    | 'Cereal'
    | 'Pulse'
    | 'Cash Crop'
    | 'Oilseed'
    | 'Vegetable';

  baselineYield: number; // avg t/ha in India

  tempRange: [number, number]; // [min, max]

  rainfallRange: [number, number]; // [min, max]

  suitableSoils: string[];

  primaryStates: string[];

  mspPerQuintal: number; // Minimum Support Price in INR
}

export interface StateData {
  name: string;

  districts: string[];
}

export interface ModelMetric {
  name: string;

  type: string;

  r2Score: number;

  rmse: number;

  mae: number;

  trainingTime: string;
}