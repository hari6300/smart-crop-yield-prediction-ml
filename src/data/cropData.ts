import { CropInfo, ModelMetric, PredictionFormData, PredictionResult, StateData } from '../types';

export const STATES_AND_DISTRICTS: StateData[] = [
  {
    name: 'Punjab',
    districts: ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar', 'Firozpur', 'Hoshiarpur', 'Sangrur']
  },
  {
    name: 'Haryana',
    districts: ['Karnal', 'Hisar', 'Ambala', 'Sirsa', 'Rohtak', 'Kurukshetra', 'Sonipat', 'Fatehabad']
  },
  {
    name: 'Uttar Pradesh',
    districts: ['Meerut', 'Varanasi', 'Lucknow', 'Agra', 'Bareilly', 'Gorakhpur', 'Aligarh', 'Moradabad', 'Prayagraj']
  },
  {
    name: 'Maharashtra',
    districts: ['Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Jalgaon', 'Ahmednagar']
  },
  {
    name: 'Madhya Pradesh',
    districts: ['Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Gwalior', 'Sagar', 'Dewas', 'Hoshangabad']
  },
  {
    name: 'Gujarat',
    districts: ['Rajkot', 'Surat', 'Ahmedabad', 'Vadodara', 'Junagadh', 'Bhavnagar', 'Mehsana', 'Anand']
  },
  {
    name: 'Tamil Nadu',
    districts: ['Thanjavur', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode', 'Tirunelveli', 'Cuddalore']
  },
  {
    name: 'Andhra Pradesh',
    districts: ['Guntur', 'Krishna', 'West Godavari', 'East Godavari', 'Kurnool', 'Anantapur', 'Chittoor']
  },
  {
    name: 'Telangana',
    districts: ['Warangal', 'Karimnagar', 'Nalgonda', 'Khammam', 'Nizamabad', 'Mahbubnagar', 'Medak']
  },
  {
    name: 'Karnataka',
    districts: ['Belagavi', 'Mysuru', 'Dharwad', 'Ballari', 'Mandya', 'Shivamogga', 'Vijayapura', 'Tumakuru']
  },
  {
    name: 'Rajasthan',
    districts: ['Ganganagar', 'Jaipur', 'Kota', 'Alwar', 'Bikaner', 'Barmer', 'Hanumangarh', 'Jodhpur']
  },
  {
    name: 'Bihar',
    districts: ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Rohtas', 'Samastipur']
  },
  {
    name: 'West Bengal',
    districts: ['Burdwan', 'Hooghly', 'Nadia', 'Murshidabad', 'Birbhum', 'Malda', 'Midnapore']
  }
];

export const SOIL_TYPES = [
  'Alluvial Soil',
  'Black (Regur) Soil',
  'Red & Yellow Soil',
  'Laterite Soil',
  'Sandy Loam Soil',
  'Clayey Loam Soil'
];

export const IRRIGATION_TYPES = [
  'Drip Irrigation',
  'Sprinkler Irrigation',
  'Canal Irrigation',
  'Borewell / Tube-well',
  'Rainfed (Monsoon)'
];

export const SEASONS = [
  'Kharif (Monsoon)',
  'Rabi (Winter)',
  'Zaid (Summer)',
  'Whole Year'
];

export const CROPS_DATA: Record<string, CropInfo> = {
  'Wheat': {
    name: 'Wheat',
    icon: '🌾',
    category: 'Cereal',
    baselineYield: 4.6, // t/ha
    tempRange: [12, 26],
    rainfallRange: [400, 850],
    suitableSoils: ['Alluvial Soil', 'Clayey Loam Soil', 'Black (Regur) Soil'],
    primaryStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    mspPerQuintal: 2275 // INR (~22,750 per ton)
  },
  'Rice (Paddy)': {
    name: 'Rice (Paddy)',
    icon: '🍚',
    category: 'Cereal',
    baselineYield: 3.9,
    tempRange: [22, 36],
    rainfallRange: [1000, 2400],
    suitableSoils: ['Alluvial Soil', 'Clayey Loam Soil'],
    primaryStates: ['West Bengal', 'Punjab', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu'],
    mspPerQuintal: 2300
  },
  'Maize': {
    name: 'Maize',
    icon: '🌽',
    category: 'Cereal',
    baselineYield: 4.2,
    tempRange: [18, 30],
    rainfallRange: [500, 950],
    suitableSoils: ['Alluvial Soil', 'Red & Yellow Soil', 'Sandy Loam Soil'],
    primaryStates: ['Karnataka', 'Madhya Pradesh', 'Bihar', 'Telangana'],
    mspPerQuintal: 2090
  },
  'Cotton': {
    name: 'Cotton',
    icon: '☁️',
    category: 'Cash Crop',
    baselineYield: 2.2,
    tempRange: [21, 35],
    rainfallRange: [550, 1100],
    suitableSoils: ['Black (Regur) Soil', 'Alluvial Soil'],
    primaryStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Punjab'],
    mspPerQuintal: 7121
  },
  'Sugarcane': {
    name: 'Sugarcane',
    icon: '🎋',
    category: 'Cash Crop',
    baselineYield: 78.5,
    tempRange: [20, 38],
    rainfallRange: [1200, 2200],
    suitableSoils: ['Alluvial Soil', 'Black (Regur) Soil', 'Clayey Loam Soil'],
    primaryStates: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    mspPerQuintal: 340 // High yield crop
  },
  'Soybean': {
    name: 'Soybean',
    icon: '🌱',
    category: 'Oilseed',
    baselineYield: 1.95,
    tempRange: [20, 32],
    rainfallRange: [600, 1050],
    suitableSoils: ['Black (Regur) Soil', 'Alluvial Soil'],
    primaryStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
    mspPerQuintal: 4892
  },
  'Groundnut': {
    name: 'Groundnut',
    icon: '🥜',
    category: 'Oilseed',
    baselineYield: 2.4,
    tempRange: [22, 34],
    rainfallRange: [500, 900],
    suitableSoils: ['Sandy Loam Soil', 'Red & Yellow Soil'],
    primaryStates: ['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh'],
    mspPerQuintal: 6783
  },
  'Mustard': {
    name: 'Mustard',
    icon: '🌼',
    category: 'Oilseed',
    baselineYield: 1.7,
    tempRange: [14, 25],
    rainfallRange: [350, 650],
    suitableSoils: ['Alluvial Soil', 'Sandy Loam Soil'],
    primaryStates: ['Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh'],
    mspPerQuintal: 5650
  },
  'Chickpea (Gram)': {
    name: 'Chickpea (Gram)',
    icon: '🧆',
    category: 'Pulse',
    baselineYield: 1.55,
    tempRange: [15, 28],
    rainfallRange: [350, 700],
    suitableSoils: ['Black (Regur) Soil', 'Alluvial Soil', 'Sandy Loam Soil'],
    primaryStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
    mspPerQuintal: 5440
  },
  'Potato': {
    name: 'Potato',
    icon: '🥔',
    category: 'Vegetable',
    baselineYield: 24.5,
    tempRange: [15, 24],
    rainfallRange: [450, 800],
    suitableSoils: ['Sandy Loam Soil', 'Alluvial Soil'],
    primaryStates: ['Uttar Pradesh', 'West Bengal', 'Bihar', 'Gujarat'],
    mspPerQuintal: 1450
  }
};

export const SAMPLE_PRESETS: { title: string; subtitle: string; data: PredictionFormData }[] = [
  {
    title: 'Punjab High-Yield Wheat',
    subtitle: 'Rabi season in alluvial soil with canal irrigation (12 Acres)',
    data: {
      crop: 'Wheat',
      state: 'Punjab',
      district: 'Ludhiana',
      area: 12.0,
      rainfall: 580,
      temperature: 18.5,
      fertilizer: 140,
      irrigation: 'Canal Irrigation',
      season: 'Rabi (Winter)',
      soilType: 'Alluvial Soil'
    }
  },
  {
    title: 'Maharashtra Cotton Belt',
    subtitle: 'Kharif season black soil with drip irrigation (8 Acres)',
    data: {
      crop: 'Cotton',
      state: 'Maharashtra',
      district: 'Nashik',
      area: 8.0,
      rainfall: 820,
      temperature: 28.0,
      fertilizer: 110,
      irrigation: 'Drip Irrigation',
      season: 'Kharif (Monsoon)',
      soilType: 'Black (Regur) Soil'
    }
  },
  {
    title: 'Tamil Nadu Delta Rice',
    subtitle: 'Kharif paddy with canal irrigation in fertile delta (10 Acres)',
    data: {
      crop: 'Rice (Paddy)',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      area: 10.0,
      rainfall: 1350,
      temperature: 29.5,
      fertilizer: 130,
      irrigation: 'Canal Irrigation',
      season: 'Kharif (Monsoon)',
      soilType: 'Clayey Loam Soil'
    }
  },
  {
    title: 'UP Sugarcane Plantation',
    subtitle: 'Annual cash crop with tube-well irrigation (15 Acres)',
    data: {
      crop: 'Sugarcane',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      area: 15.0,
      rainfall: 1100,
      temperature: 26.5,
      fertilizer: 220,
      irrigation: 'Borewell / Tube-well',
      season: 'Whole Year',
      soilType: 'Alluvial Soil'
    }
  }
];

export const INITIAL_HISTORY: PredictionResult[] = [
  {
    id: 'pred-101',
    timestamp: '2026-09-20T10:15:00Z',
    input: {
      crop: 'Wheat',
      state: 'Punjab',
      district: 'Ludhiana',
      area: 10.0,
      rainfall: 560,
      temperature: 19.2,
      fertilizer: 145,
      irrigation: 'Canal Irrigation',
      season: 'Rabi (Winter)',
      soilType: 'Alluvial Soil'
    },
    predictedYield: 4.88,
    yieldPerAcre: 1.98,
    areaHectares: 4.05,
    totalProduction: 19.75,
    confidenceScore: 95.4,
    confidenceInterval: { min: 4.62, max: 5.14 },
    yieldCategory: 'Optimal',
    featureImpacts: [
      { name: 'Rainfall', score: 18, status: 'positive', description: 'Rainfall is in the prime agronomic zone for winter wheat' },
      { name: 'Temperature', score: 14, status: 'positive', description: 'Cool 19.2°C temperature maximizes grain filling duration' },
      { name: 'Fertilizer', score: 12, status: 'positive', description: 'Balanced NPK dosage (145 kg/ha) matches nutritional demand' },
      { name: 'Irrigation', score: 15, status: 'positive', description: 'Canal irrigation provides steady moisture without waterlogging' }
    ],
    recommendations: [
      'Top-dress 25 kg/ha Urea at first irrigation (CRI stage) for optimal tillering.',
      'Monitor for yellow rust disease during humid cool nights.',
      'Maintain surface drainage to prevent water stagnation in alluvial loam.'
    ],
    estimatedRevenue: {
      pricePerTon: 22750,
      totalValue: 449313,
      currency: '₹'
    }
  },
  {
    id: 'pred-102',
    timestamp: '2026-09-18T14:40:00Z',
    input: {
      crop: 'Rice (Paddy)',
      state: 'West Bengal',
      district: 'Burdwan',
      area: 8.0,
      rainfall: 1450,
      temperature: 28.5,
      fertilizer: 120,
      irrigation: 'Canal Irrigation',
      season: 'Kharif (Monsoon)',
      soilType: 'Clayey Loam Soil'
    },
    predictedYield: 4.15,
    yieldPerAcre: 1.68,
    areaHectares: 3.24,
    totalProduction: 13.43,
    confidenceScore: 94.1,
    confidenceInterval: { min: 3.92, max: 4.38 },
    yieldCategory: 'Good',
    featureImpacts: [
      { name: 'Rainfall', score: 22, status: 'positive', description: 'Excellent precipitation for puddling and vegetative growth' },
      { name: 'Soil Type', score: 16, status: 'positive', description: 'Clayey loam retains standing water effectively' },
      { name: 'Temperature', score: 8, status: 'neutral', description: 'Consistent temperature within normal range' },
      { name: 'Fertilizer', score: -4, status: 'negative', description: 'Slight phosphorus deficit detected for clay soil' }
    ],
    recommendations: [
      'Incorporate DAP or SSP before transplanting to strengthen root system.',
      'Adopt Alternate Wetting and Drying (AWD) to cut water use by 20% without yield loss.',
      'Scout for brown planthopper at heading stage.'
    ],
    estimatedRevenue: {
      pricePerTon: 23000,
      totalValue: 308890,
      currency: '₹'
    }
  },
  {
    id: 'pred-103',
    timestamp: '2026-09-15T09:20:00Z',
    input: {
      crop: 'Cotton',
      state: 'Gujarat',
      district: 'Rajkot',
      area: 10.0,
      rainfall: 650,
      temperature: 30.2,
      fertilizer: 95,
      irrigation: 'Drip Irrigation',
      season: 'Kharif (Monsoon)',
      soilType: 'Black (Regur) Soil'
    },
    predictedYield: 2.38,
    yieldPerAcre: 0.96,
    areaHectares: 4.05,
    totalProduction: 9.63,
    confidenceScore: 93.8,
    confidenceInterval: { min: 2.21, max: 2.55 },
    yieldCategory: 'Good',
    featureImpacts: [
      { name: 'Irrigation', score: 25, status: 'positive', description: 'Drip irrigation ensures uniform moisture in black soil' },
      { name: 'Soil Type', score: 19, status: 'positive', description: 'High moisture retention capacity of Regur soil' },
      { name: 'Rainfall', score: 5, status: 'neutral', description: 'Low rainfall mitigated by efficient drip' },
      { name: 'Temperature', score: 11, status: 'positive', description: 'Warm temperatures promote boll opening' }
    ],
    recommendations: [
      'Maintain fertigation schedule with potassium sulphate at flowering stage.',
      'Install pheromone traps for pink bollworm monitoring.',
      'Mulch inter-rows to suppress weed growth and retain soil moisture.'
    ],
    estimatedRevenue: {
      pricePerTon: 71210,
      totalValue: 685752,
      currency: '₹'
    }
  },
  {
    id: 'pred-104',
    timestamp: '2026-09-12T16:05:00Z',
    input: {
      crop: 'Sugarcane',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      area: 6.0,
      rainfall: 1050,
      temperature: 27.0,
      fertilizer: 210,
      irrigation: 'Borewell / Tube-well',
      season: 'Whole Year',
      soilType: 'Alluvial Soil'
    },
    predictedYield: 82.4,
    yieldPerAcre: 33.35,
    areaHectares: 2.43,
    totalProduction: 200.08,
    confidenceScore: 96.2,
    confidenceInterval: { min: 78.8, max: 86.0 },
    yieldCategory: 'Exceptional',
    featureImpacts: [
      { name: 'Fertilizer', score: 24, status: 'positive', description: 'Adequate heavy nitrogen-potassium regime for cane stalks' },
      { name: 'Soil Type', score: 21, status: 'positive', description: 'Deep fertile alluvial soil supports extensive root systems' },
      { name: 'Irrigation', score: 18, status: 'positive', description: 'Regular tube-well supply during dry spell intervals' },
      { name: 'Season', score: 12, status: 'positive', description: 'Full 12-month development cycle allows maximum sucrose content' }
    ],
    recommendations: [
      'Carry out earthing-up operations to prevent lodging during late monsoons.',
      'Trash mulching after 90 days to conserve soil moisture and suppress weeds.',
      'Stop nitrogen application 90 days prior to harvest to enhance sugar recovery.'
    ],
    estimatedRevenue: {
      pricePerTon: 3400,
      totalValue: 680272,
      currency: '₹'
    }
  },
  {
    id: 'pred-105',
    timestamp: '2026-09-08T11:50:00Z',
    input: {
      crop: 'Soybean',
      state: 'Madhya Pradesh',
      district: 'Indore',
      area: 8.0,
      rainfall: 780,
      temperature: 26.0,
      fertilizer: 75,
      irrigation: 'Rainfed (Monsoon)',
      season: 'Kharif (Monsoon)',
      soilType: 'Black (Regur) Soil'
    },
    predictedYield: 2.05,
    yieldPerAcre: 0.83,
    areaHectares: 3.24,
    totalProduction: 6.64,
    confidenceScore: 92.7,
    confidenceInterval: { min: 1.88, max: 2.22 },
    yieldCategory: 'Optimal',
    featureImpacts: [
      { name: 'Soil Type', score: 22, status: 'positive', description: 'Excellent nodulation and nutrient exchange in deep black soil' },
      { name: 'Rainfall', score: 12, status: 'positive', description: 'Monsoon showers well synchronized with flowering' },
      { name: 'Fertilizer', score: 7, status: 'neutral', description: 'Moderate dose; rhizobium inoculation can further boost yield' },
      { name: 'Irrigation', score: -3, status: 'negative', description: 'Rainfed vulnerability during terminal dry spells' }
    ],
    recommendations: [
      'Inoculate seeds with Bradyrhizobium japonicum prior to sowing.',
      'Prepare broad-bed and furrow (BBF) to prevent monsoon waterlogging.',
      'Apply protective spray of sulphur to boost oil and protein synthesis.'
    ],
    estimatedRevenue: {
      pricePerTon: 48920,
      totalValue: 324829,
      currency: '₹'
    }
  }
];

export const MODEL_METRICS: ModelMetric[] = [
  {
    name: 'Random Forest Regressor (Ensemble)',
    type: 'Non-linear Bagging Trees (n_estimators=150)',
    r2Score: 0.948,
    rmse: 0.38,
    mae: 0.27,
    accuracy: '94.8%',
    trainingTime: '4.2s'
  },
  {
    name: 'XGBoost Regressor (Gradient Boosting)',
    type: 'Gradient Boosted Decision Trees (lr=0.08)',
    r2Score: 0.939,
    rmse: 0.42,
    mae: 0.31,
    accuracy: '93.9%',
    trainingTime: '6.8s'
  },
  {
    name: 'Support Vector Regressor (SVR-RBF)',
    type: 'Radial Basis Function Kernel',
    r2Score: 0.871,
    rmse: 0.64,
    mae: 0.49,
    accuracy: '87.1%',
    trainingTime: '12.4s'
  },
  {
    name: 'Multi-Layer Perceptron (MLP-ANN)',
    type: '3 Dense Layers [128, 64, 32] with ReLU',
    r2Score: 0.912,
    rmse: 0.51,
    mae: 0.38,
    accuracy: '91.2%',
    trainingTime: '18.1s'
  },
  {
    name: 'Multiple Linear Regression (Baseline)',
    type: 'Ordinary Least Squares (OLS)',
    r2Score: 0.724,
    rmse: 1.05,
    mae: 0.82,
    accuracy: '72.4%',
    trainingTime: '0.3s'
  }
];

export const FEATURE_IMPORTANCE_DATA = [
  { feature: 'Rainfall (mm)', importance: 28.4, fill: '#10b981' },
  { feature: 'Fertilizer (kg/ha)', importance: 22.1, fill: '#059669' },
  { feature: 'Temperature (°C)', importance: 17.8, fill: '#34d399' },
  { feature: 'Soil Type', importance: 13.9, fill: '#6ee7b7' },
  { feature: 'Irrigation Method', importance: 10.6, fill: '#a7f3d0' },
  { feature: 'Cultivated Area', importance: 7.2, fill: '#d1fae5' }
];

export const CROP_YIELD_BENCHMARKS = [
  { crop: 'Wheat', nationalAvg: 3.5, mlPredictedAvg: 4.4, highPotential: 5.2 },
  { crop: 'Rice (Paddy)', nationalAvg: 2.8, mlPredictedAvg: 3.9, highPotential: 4.8 },
  { crop: 'Maize', nationalAvg: 3.1, mlPredictedAvg: 4.2, highPotential: 5.0 },
  { crop: 'Cotton', nationalAvg: 1.6, mlPredictedAvg: 2.2, highPotential: 2.8 },
  { crop: 'Soybean', nationalAvg: 1.3, mlPredictedAvg: 1.9, highPotential: 2.4 },
  { crop: 'Groundnut', nationalAvg: 1.7, mlPredictedAvg: 2.4, highPotential: 3.0 },
  { crop: 'Mustard', nationalAvg: 1.4, mlPredictedAvg: 1.7, highPotential: 2.2 }
];

export const RAINFALL_RESPONSE_CURVE = [
  { rainfall: 200, wheat: 1.8, rice: 0.8, cotton: 1.0, maize: 1.6 },
  { rainfall: 400, wheat: 3.4, rice: 1.5, cotton: 1.7, maize: 2.8 },
  { rainfall: 600, wheat: 4.8, rice: 2.6, cotton: 2.3, maize: 4.1 },
  { rainfall: 800, wheat: 4.5, rice: 3.4, cotton: 2.2, maize: 4.3 },
  { rainfall: 1000, wheat: 3.6, rice: 4.1, cotton: 1.9, maize: 3.9 },
  { rainfall: 1400, wheat: 2.4, rice: 4.5, cotton: 1.4, maize: 3.2 },
  { rainfall: 1800, wheat: 1.5, rice: 4.3, cotton: 1.0, maize: 2.4 }
];

export const FERTILIZER_EFFICIENCY_DATA = [
  { fertilizer: 20, actualYield: 1.8, optimalYield: 2.2, efficiency: 'Under-fertilized' },
  { fertilizer: 60, actualYield: 3.1, optimalYield: 3.4, efficiency: 'Moderate' },
  { fertilizer: 100, actualYield: 4.1, optimalYield: 4.3, efficiency: 'Good' },
  { fertilizer: 140, actualYield: 4.8, optimalYield: 4.8, efficiency: 'Peak Efficiency' },
  { fertilizer: 180, actualYield: 4.9, optimalYield: 4.9, efficiency: 'Diminishing Returns' },
  { fertilizer: 220, actualYield: 4.7, optimalYield: 4.9, efficiency: 'Over-saturation' },
  { fertilizer: 260, actualYield: 4.4, optimalYield: 4.9, efficiency: 'Toxicity Risk' }
];

export const STATE_PRODUCTIVITY_DATA = [
  { state: 'Punjab', index: 94, wheatYield: 5.1, riceYield: 4.3 },
  { state: 'Haryana', index: 89, wheatYield: 4.8, riceYield: 4.0 },
  { state: 'Uttar Pradesh', index: 84, wheatYield: 4.1, riceYield: 3.6 },
  { state: 'Tamil Nadu', index: 82, wheatYield: 2.8, riceYield: 4.2 },
  { state: 'Andhra Pradesh', index: 81, wheatYield: 2.9, riceYield: 4.1 },
  { state: 'Madhya Pradesh', index: 78, wheatYield: 3.8, riceYield: 3.2 },
  { state: 'Maharashtra', index: 76, wheatYield: 3.2, riceYield: 3.4 },
  { state: 'West Bengal', index: 83, wheatYield: 3.1, riceYield: 4.2 }
];
