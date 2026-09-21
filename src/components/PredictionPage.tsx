import React, { useState, useEffect, useCallback } from 'react';
import { 
  CROPS_DATA, 
  STATES_AND_DISTRICTS, 
  SOIL_TYPES, 
  IRRIGATION_TYPES, 
  SEASONS, 
  SAMPLE_PRESETS 
} from '../data/cropData';
import { PredictionFormData, PredictionResult } from '../types';
import { predictCropYield } from '../services/mlApi';
import { 
  autoFetchWeatherData, 
  autoGetSoilInformation, 
  autoEstimateFertilizer, 
  DISTRICT_COORDINATES,
  AutoWeatherData,
  SoilInformation,
  FertilizerRecommendation
} from '../utils/agroTelemetry';
import { 
  Sprout, 
  CloudRain, 
  Thermometer, 
  FlaskConical, 
  Maximize2, 
  Layers, 
  Droplets, 
  Sun, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  ArrowRight,
  BookmarkPlus,
  Compass,
  X,
  Check,
  Zap,
  Activity,
  Sliders,
  Radio,
  Gauge,
  Info,
  Printer,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { downloadBillSlip } from '../utils/printBillSlip';
import { BillSlipModal } from './BillSlipModal';

interface PredictionPageProps {
  onSavePrediction: (result: PredictionResult) => void;
  latestPrediction: PredictionResult | null;
  onNavigateToBillPreview?: (result: PredictionResult) => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  onSavePrediction,
  latestPrediction: initialLatest,
  onNavigateToBillPreview
}) => {
  // 1. User Entered Inputs State (Area in Acres)
  const [formData, setFormData] = useState<PredictionFormData>({
    crop: 'Wheat',
    state: 'Punjab',
    district: 'Ludhiana',
    area: 10.0,
    rainfall: 580,
    temperature: 18.5,
    fertilizer: 140,
    irrigation: 'Canal Irrigation',
    season: 'Rabi (Winter)',
    soilType: 'Alluvial Soil'
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(initialLatest);
  const [hasSavedCurrent, setHasSavedCurrent] = useState<boolean>(false);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; crop: string; yieldVal: number; message?: string } | null>(null);
  const [billSlipPrediction, setBillSlipPrediction] = useState<PredictionResult | null>(null);

  // 2. System Auto-Retrieved Intelligence State
  const [weatherData, setWeatherData] = useState<AutoWeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [soilInfo, setSoilInfo] = useState<SoilInformation | null>(null);
  const [fertilizerRec, setFertilizerRec] = useState<FertilizerRecommendation | null>(null);
  
  

  // Update available districts when State changes
  useEffect(() => {
    const foundState = STATES_AND_DISTRICTS.find(s => s.name === formData.state);
    if (foundState) {
      setAvailableDistricts(foundState.districts);
      if (!foundState.districts.includes(formData.district)) {
        const firstDistrict = foundState.districts[0] || '';
        setFormData(prev => ({ 
          ...prev, 
          district: firstDistrict,
          // Auto suggest native soil for the new district
          soilType: DISTRICT_COORDINATES[firstDistrict]?.defaultSoil || prev.soilType
        }));
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.state]);

  // Handle District change: auto suggest native soil
  const handleDistrictChange = (newDistrict: string) => {
    const suggestedSoil = DISTRICT_COORDINATES[newDistrict]?.defaultSoil;
    setFormData(prev => ({
      ...prev,
      district: newDistrict,
      soilType: suggestedSoil || prev.soilType
    }));
  };

  // SYSTEM AUTO-FETCH 1: Rainfall & Temperature from Weather API / Agro-Climatic Dataset
  const fetchWeather = useCallback(async (district: string, state: string, season: string) => {
    setIsWeatherLoading(true);
    try {
      const data = await autoFetchWeatherData(district, state, season);
      setWeatherData(data);
      // Automatically update the form data with the fetched weather
      setFormData(prev => ({
        ...prev,
        rainfall: data.rainfall,
        temperature: data.temperature,
        weatherSource: data.source,
        isWeatherLive: data.isLive
      }));
    } catch (err) {
      console.error('Failed to auto-fetch weather:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Trigger weather fetch when District, State, or Season changes
  useEffect(() => {
    if (formData.district && formData.state && formData.season) {
      fetchWeather(formData.district, formData.state, formData.season);
    }
  }, [formData.district, formData.state, formData.season, fetchWeather]);

  // SYSTEM AUTO-FETCH 2: Soil Information from ICAR / Soil Health Card dataset
  useEffect(() => {
    if (formData.district && formData.soilType) {
      const info = autoGetSoilInformation(formData.district, formData.soilType);
      setSoilInfo(info);
      setFormData(prev => ({
        ...prev,
        soilDetails: {
          pH: info.pH,
          organicCarbon: info.organicCarbon,
          nitrogenStatus: info.nitrogenStatus,
          phosphorusStatus: info.phosphorusStatus,
          potassiumStatus: info.potassiumStatus
        }
      }));
    }
  }, [formData.district, formData.soilType]);

  // SYSTEM AUTO-FETCH 3: Fertilizer Estimation from Crop & Soil Conditions
  useEffect(() => {
    if (formData.crop && soilInfo) {
      const rec = autoEstimateFertilizer(formData.crop, soilInfo, formData.season);
      setFertilizerRec(rec);
      setFormData(prev => ({
        ...prev,
        fertilizer: rec.recommendedDoseKgHa,
        fertilizerMode: 'auto'
      }));
    }
  }, [formData.crop, soilInfo, formData.season]);

  const handleInputChange = (field: keyof PredictionFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setFormData(preset.data);
    setErrorMessage(null);
    setCurrentResult(null);
    setHasSavedCurrent(false);
  };

  const validateForm = (): boolean => {
    if (!formData.crop) {
      setErrorMessage('Please select a target crop.');
      return false;
    }
    if (!formData.state || !formData.district) {
      setErrorMessage('Please choose both a State and a District.');
      return false;
    }
    if (formData.area <= 0 || isNaN(formData.area)) {
      setErrorMessage('Cultivated land area must be greater than 0 acres.');
      return false;
    }
    if (isWeatherLoading || !weatherData) {
      setErrorMessage('Please wait for automatic weather data to load.');
      return false;
    }
    if (!soilInfo) {
      setErrorMessage('Please wait for automatic soil information to load.');
      return false;
    }
    if (!fertilizerRec) {
      setErrorMessage('Please wait for automatic fertilizer estimation to load.');
      return false;
    }
    if (formData.rainfall < 0 || isNaN(formData.rainfall) || formData.temperature < -10 || formData.temperature > 60 || isNaN(formData.temperature) || formData.fertilizer < 0 || isNaN(formData.fertilizer)) {
      setErrorMessage('Automatically retrieved agricultural values are invalid. Refresh the data and try again.');
      return false;
    }
    return true;
  };

  const handlePrintSlip = (resultToPrint?: PredictionResult | null) => {
    const target = resultToPrint || currentResult;
    if (!target) return;

    // Redirect to preview of bill
    if (onNavigateToBillPreview) {
      onNavigateToBillPreview(target);
    } else {
      setBillSlipPrediction(target);
    }
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setHasSavedCurrent(false);

    // Multi-step ML simulation animation for engaging user feedback
    setLoadingStep('Synchronizing auto-retrieved telemetry vectors...');
    
    setTimeout(() => {
setLoadingStep('Evaluating Random Forest regression trees...');    }, 400);

    setTimeout(() => {
      setLoadingStep('Reading the trained Random Forest model and prediction spread...');
    }, 800);

    try {
      const result = await new Promise<PredictionResult>((resolve, reject) => {
        setTimeout(async () => {
          try {
            resolve(await predictCropYield(formData));
          } catch (error) {
            reject(error);
          }
        }, 1200);
      });

      setCurrentResult(result);
      setIsLoading(false);
      setLoadingStep('');
      onSavePrediction(result);
      setHasSavedCurrent(true);

      setIsPulsing(true);
      setToast({ show: true, crop: result.input.crop, yieldVal: result.predictedYield });
      setTimeout(() => setIsPulsing(false), 2800);
      setTimeout(() => setToast((prev) => (prev ? { ...prev, show: false } : null)), 4500);
    } catch (error) {
      setIsLoading(false);
      setLoadingStep('');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to connect to the ML prediction server.');
    }
  };

  const handleManualSave = () => {
    if (currentResult && !hasSavedCurrent) {
      onSavePrediction(currentResult);
      setHasSavedCurrent(true);
    }
  };

  const handleReset = () => {
    setFormData({
      crop: 'Wheat',
      state: 'Punjab',
      district: 'Ludhiana',
      area: 10.0,
      rainfall: 580,
      temperature: 18.5,
      fertilizer: 140,
      irrigation: 'Canal Irrigation',
      season: 'Rabi (Winter)',
      soilType: 'Alluvial Soil'
    });
    setErrorMessage(null);
    setCurrentResult(null);
    setHasSavedCurrent(false);
  };

  const selectedCropInfo = CROPS_DATA[formData.crop];
  const predictionSpread = currentResult?.predictionSpread ?? {
  min: currentResult?.predictedYield ?? 0,
  max: currentResult?.predictedYield ?? 0,
};

const modelR2 = currentResult?.modelR2 ?? 91.81;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative">
      {/* Subtle Success Toast Notification */}
      {toast && toast.show && (
        <div 
          id="prediction-toast-notification"
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md border-2 border-emerald-400 rounded-2xl shadow-2xl shadow-emerald-900/15 p-4 flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
          role="status"
          aria-live="polite"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/30">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Prediction Ready!
              </span>
              <button 
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Predicted <strong className="text-slate-900 font-semibold">{toast.crop}</strong> yield:{' '}
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {toast.yieldVal} tons/ha
              </span>
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to Prediction History & Audit Log</span>
            </div>
          </div>
        </div>
      )}

      {/* Page Introduction Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Auto-Telemetry & Supervised ML Regression</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Crop Yield Inference Model
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Enter your core farm parameters. The system <strong className="text-emerald-800 font-semibold">automatically retrieves seasonal weather data</strong>, retrieves <strong className="text-emerald-800 font-semibold">soil health data</strong>, and calculates <strong className="text-emerald-800 font-semibold">optimal fertilizer dosages</strong> to estimate productivity in <strong className="text-slate-900">tons/hectare</strong>.
          </p>
        </div>

        {/* Quick Presets for Demo / Evaluation */}
        <div className="w-full md:w-auto flex-shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Quick 1-Click Field Presets:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs font-medium text-slate-700 hover:text-emerald-800 transition-colors shadow-2xs truncate"
                title={`${preset.title}: ${preset.subtitle}`}
              >
                🌾 {preset.title.split(' ')[0]} {preset.data.crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Form, Right is Prediction Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PREDICTION WORKSPACE (7 Cols on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Field & Environmental Parameters</h3>
                <p className="text-xs text-slate-500">Farm inputs + automatic environmental and agronomic information</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Incomplete / Invalid Data</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handlePredict(); }} className="space-y-6">
            
            {/* ======================================================== */}
            {/* SECTION 1: USER ENTERS (CROP, STATE, DISTRICT, AREA, ETC) */}
            {/* ======================================================== */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    User Entered Farm Specifications
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Core Inputs</span>
              </div>

              {/* 1. Crop Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    Target Crop
                  </span>
                  {selectedCropInfo && (
                    <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Category: {selectedCropInfo.category} (Avg: ~{selectedCropInfo.baselineYield} t/ha)
                    </span>
                  )}
                </label>
                <select
                  id="field-crop"
                  value={formData.crop}
                  onChange={(e) => handleInputChange('crop', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                >
                  {Object.keys(CROPS_DATA).map((cropName) => (
                    <option key={cropName} value={cropName}>
                      {CROPS_DATA[cropName].icon} {cropName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Land Area (acres) */}
              <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-emerald-600" />
                    Land Area (acres)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0.25"
                      max="2500"
                      step="0.5"
                      id="input-area"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2.5 py-1 text-right text-sm font-bold rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      acres
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="0.5"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>1 acre (Smallholder)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                    ≈ {(formData.area * 0.404686).toFixed(2)} hectares
                  </span>
                  <span>100+ acres (Commercial)</span>
                </div>
              </div>

              {/* 3. Geography: State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    State
                  </label>
                  <select
                    id="field-state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {STATES_AND_DISTRICTS.map((st) => (
                      <option key={st.name} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    District
                  </label>
                  <select
                    id="field-district"
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Season & Soil Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-emerald-600" />
                    Season
                  </label>
                  <select
                    id="field-season"
                    value={formData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {SEASONS.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      Soil Type
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      Auto-Suggested
                    </span>
                  </label>
                  <select
                    id="field-soil"
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {SOIL_TYPES.map((soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Irrigation Availability */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  Irrigation Availability & System
                </label>
                <select
                  id="field-irrigation"
                  value={formData.irrigation}
                  onChange={(e) => handleInputChange('irrigation', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {IRRIGATION_TYPES.map((irr) => (
                    <option key={irr} value={irr}>
                      {irr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 2: SYSTEM AUTOMATICALLY GETS (WEATHER, SOIL, NPK) */}
            {/* ======================================================== */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    System Automatically Retrieved Telemetry
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Auto Retrieved</span>
                </div>
              </div>

              {/* A. Weather API Telemetry Card (Rainfall & Temperature) */}
              <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-teal-50/50 rounded-2xl border border-blue-200/80 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2 border-b border-blue-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        Agro-Weather API Telemetry
                      </span>
                      {weatherData && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          weatherData.isLive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {weatherData.isLive ? 'API Connected + Seasonal Baseline' : 'Seasonal Baseline'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {weatherData?.stationName || `Locating weather observatory for ${formData.district}...`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchWeather(formData.district, formData.state, formData.season)}
                    disabled={isWeatherLoading}
                    className="p-2 rounded-xl bg-white hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors shadow-2xs flex items-center gap-1 text-xs font-semibold"
                    title="Refresh Weather Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>

                {/* Grid for Rainfall & Temperature Displays */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Rainfall Metric Box */}
                  <div className="bg-white p-3.5 rounded-xl border border-blue-200/70 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-blue-900 font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <CloudRain className="w-4 h-4 text-blue-600" />
                        🌧️ Rainfall (Seasonal)
                      </span>
                      <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                        Auto-Fetched
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">
                        {formData.rainfall}
                      </span>
                      <span className="text-xs font-bold text-slate-500">mm</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {weatherData?.weatherCondition || 'Normal seasonal precipitation pattern'}
                    </p>
                  </div>

                  {/* Temperature Metric Box */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-amber-600" />
                        🌡️ Temperature (Mean)
                      </span>
                      <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                        Auto-Fetched
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">
                        {formData.temperature}
                      </span>
                      <span className="text-xs font-bold text-slate-500">°C</span>
                      {weatherData?.currentTemp !== undefined && (
                        <span className="text-[10px] text-slate-400 ml-1">
                          (Ambient: {weatherData.currentTemp}°C)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      RH: {weatherData?.humidity || 65}% • Optimal thermal band for {formData.crop}
                    </p>
                  </div>
                </div>
              </div>

              {/* B. Soil Health Card Dataset (Soil Information) */}
              <div className="bg-gradient-to-br from-amber-50/60 via-slate-50 to-emerald-50/50 rounded-2xl border border-amber-200/80 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-700" />
                      🌱 Soil Health Card Intelligence (Dataset / API)
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      District Soil Profile
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {soilInfo?.soilType || formData.soilType}
                  </span>
                </div>

                {soilInfo ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium block">Soil pH Index</span>
                      <span className="text-base font-bold text-slate-900">{soilInfo.pH}</span>
                      <span className="text-[10px] text-slate-500 block">{soilInfo.pHCategory}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium block">Organic Carbon (OC)</span>
                      <span className="text-base font-bold text-slate-900">{soilInfo.organicCarbon}%</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">{soilInfo.ocCategory} Status</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium block">NPK Nutrients</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                        <span className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">N: {soilInfo.nitrogenStatus[0]}</span>
                        <span className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">P: {soilInfo.phosphorusStatus[0]}</span>
                        <span className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">K: {soilInfo.potassiumStatus[0]}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Available rating</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium block">Moisture Retention</span>
                      <span className="text-sm font-bold text-slate-900">{soilInfo.moistureRetention}</span>
                      <span className="text-[10px] text-slate-400 block">EC: {soilInfo.electricalConductivity} dS/m</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 p-2">Loading soil health dataset...</div>
                )}
                
                <p className="text-[11px] text-slate-500 italic">
                  *Source: {soilInfo?.source || 'Built-in district soil profile dataset'}
                </p>
              </div>

              {/* C. Fertilizer Dosage: Automatically Estimated */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/70 rounded-2xl border border-emerald-200/80 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                      🧪 Recommended Fertilizer
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Auto-Estimated
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-emerald-200/70">
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      Estimated application rate based on crop + soil conditions:
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-emerald-950">
                        {formData.fertilizer}
                      </span>
                      <span className="text-sm font-bold text-emerald-800">kg / hectare</span>
                      {fertilizerRec && (
                        <span className="text-xs text-slate-500 font-medium ml-2">
                          (N: {fertilizerRec.nRatio}, P: {fertilizerRec.pRatio}, K: {fertilizerRec.kRatio})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Agronomic Basis: {fertilizerRec?.basis || 'Balanced NPK dosage tailored to regional soil and target crop demand.'}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SUBMIT BUTTON: PREDICT YIELD */}
            {/* ======================================================== */}
            <div className="pt-4">
              <button
                type="submit"
                id="btn-predict-yield"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:shadow-emerald-600/40 active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Inference In Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                    <span>Predict Yield</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading Animation Box */}
          {isLoading && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-pulse">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-semibold text-sm mb-1">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Running Random Forest Regressor</span>
              </div>
              <p className="text-xs text-emerald-600">{loadingStep}</p>
            </div>
          )}
        </div>

        {/* PREDICTION RESULTS SECTION (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {currentResult ? (
            <div 
              id="prediction-result-card"
              className={`bg-white rounded-2xl border-2 transition-all duration-700 p-6 sm:p-7 space-y-6 ${
                isPulsing 
                  ? 'border-emerald-500 ring-4 ring-emerald-400/50 shadow-2xl shadow-emerald-500/20 scale-[1.01] animate-emerald-glow' 
                  : 'border-emerald-500/80 shadow-md'
              }`}
            >
              {/* Subtle Frame Pulse Banner when newly generated */}
              {isPulsing && (
                <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 shadow-2xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fresh Inference Computed & Verified!</span>
                </div>
              )}
              
              {/* Result Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inference Success</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {currentResult.input.crop} Prediction
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentResult.input.district}, {currentResult.input.state} • {currentResult.input.season}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Model R²
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                        {modelR2}%
                    </span>
                  </div>

                  <button
                    onClick={() => handlePrintSlip(currentResult)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Download Official Bill Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>

              {/* PRIMARY DISPLAY: Predicted Yield in tons/hectare */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-700/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider block mb-1">
                  Predicted Crop Yield
                </span>

                {/* THE REQUESTED PROMINENT RESULT: tons/hectare */}
                <div className="flex items-baseline justify-center gap-2 my-1">
                  <span id="predicted-yield-value" className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    {currentResult.predictedYield}
                  </span>
                  <span className="text-emerald-100 text-lg sm:text-xl font-semibold">
                    tons / hectare
                  </span>
                </div>

                {/* Yield per Acre conversion indicator */}
                <div className="text-xs text-emerald-100/95 font-medium mt-1">
                  Equivalent: <strong className="font-extrabold text-white">~{(currentResult.yieldPerAcre || (currentResult.predictedYield * 0.404686)).toFixed(2)} tons / acre</strong>
                </div>

                {/* Random Forest Prediction Spread */}
<div className="text-xs text-emerald-100/90 font-medium mt-2 bg-black/15 py-1 px-3 rounded-full inline-block">
  Model Prediction Spread: {predictionSpread.min} – {predictionSpread.max} t/ha
</div>

                {/* Category Pill */}
                <div className="mt-3 flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-extrabold tracking-wide uppercase shadow-2xs">
                    {currentResult.yieldCategory} Potential
                  </span>
                </div>
              </div>

              {/* Total Production & Farm Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total Expected Harvest
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">
                    {currentResult.totalProduction} <span className="text-xs text-slate-600 font-normal">metric tons</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Across {currentResult.input.area} acres (~{(currentResult.input.area * 0.404686).toFixed(2)} ha)
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Est. Market Value
                  </span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">
                    ₹{currentResult.estimatedRevenue.totalValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Based on MSP ₹{currentResult.estimatedRevenue.pricePerTon.toLocaleString('en-IN')}/ton
                  </span>
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Key Influencing Factors
                </h4>
                <div className="space-y-2">
                  {currentResult.featureImpacts.map((factor, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-800">{factor.name}</span>
                        <span
                          className={`font-bold ${
                            factor.status === 'positive'
                              ? 'text-emerald-600'
                              : factor.status === 'negative'
                              ? 'text-rose-600'
                              : 'text-slate-600'
                          }`}
                        >
                          {factor.score > 0 ? `+${factor.score}` : factor.score}% impact
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agronomic Recommendations */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  Actionable Agro-Recommendations
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {currentResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 border-t border-slate-100 text-xs gap-3">
                <span className="text-slate-400">
                  Audit ID: {currentResult.id.slice(0, 16)}...
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    id="btn-print-slip"
                    type="button"
                    onClick={() => handlePrintSlip(currentResult)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                    title="Preview official bill slip before saving or printing"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip (Preview Bill)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleManualSave}
                    disabled={hasSavedCurrent}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-semibold transition-colors ${
                      hasSavedCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer'
                    }`}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{hasSavedCurrent ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-bold text-slate-800 text-base">Awaiting Inference Run</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your farm details on the left. The system will automatically fetch weather, soil data, and optimal fertilizer before calculating your yield estimate in tons/hectare.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePredict}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Run Demo Prediction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Bill Slip Modal Preview & Printer */}
      <BillSlipModal
        prediction={billSlipPrediction}
        onClose={() => setBillSlipPrediction(null)}
      />
    </div>
  );
};
