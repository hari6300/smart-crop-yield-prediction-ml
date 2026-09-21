import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Compass, 
  Target, 
  Lightbulb, 
  FileText 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* College Project Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Academic Engineering Capstone Project</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Smart Crop Yield Prediction Using Machine Learning
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              An intelligent decision-support system designed to forecast agricultural harvest productivity, 
              mitigate climate risks, and optimize chemical fertilizer deployment using a Random Forest regression model.
            </p>
          </div>

          {/* College / Batch Badge */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-xs space-y-2 flex-shrink-0 w-full sm:w-auto">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Project Metadata</div>
            <div className="flex justify-between sm:justify-start gap-4 text-slate-700">
              <span className="text-slate-400">Department:</span>
              <span className="font-semibold text-slate-900">Computer Science & AI</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 text-slate-700">
              <span className="text-slate-400">Target Output:</span>
              <span className="font-semibold text-emerald-700">Yield (tons/hectare)</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 text-slate-700">
              <span className="text-slate-400">Primary Model:</span>
              <span className="font-semibold text-slate-900">Random Forest Regressor</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 text-slate-700">
              <span className="text-slate-400">R² Score:</span>
              <span className="font-bold text-emerald-600">0.9181 (91.81%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract & Problem Statement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Target className="w-4 h-4" />
            </div>
            <span>Problem Statement</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Agricultural productivity across developing nations faces immense challenges from volatile precipitation patterns, erratic monsoon cycles, and suboptimal fertilizer application. Traditional agronomic estimates often fail to model the non-linear interdependencies between thermal stress, soil characteristics, and moisture availability.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This project bridges the information asymmetry by leveraging multi-variable machine learning regressors to furnish farmers, agronomists, and policy makers with accurate pre-harvest yield projections.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>Project Abstract & Scope</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
  We present a responsive full-stack predictive interface that evaluates agricultural parameters
  including crop type, state, cultivated area, seasonal rainfall, fertilizer usage, pesticide usage,
  season, and year.
</p>

<p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
  The Random Forest model predicts crop yield in <strong>tons/hectare</strong> and provides
  a model prediction spread along with agricultural recommendations.
</p>
        </div>

      </div>

      {/* Machine Learning Pipeline Diagram / Cards */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Machine Learning Workflow Pipeline</h3>
          <p className="text-xs text-slate-500">From raw data collection to real-time client inference</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Phase 01</span>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-700" /> Data Collection
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Historical records collected from Ministry of Agriculture, ICAR, and open agricultural databases spanning 1997-2023 across Indian agro-climatic zones.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Phase 02</span>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-700" /> Preprocessing & Scaling
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
  Handling missing observations, feature engineering for area-based inputs,
  and categorical One-Hot Encoding for state, crop, and season.
</p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Phase 03</span>
             <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
  <Cpu className="w-4 h-4 text-slate-700" /> Random Forest Training
</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
  Random Forest Regressor trained with 300 decision trees using One-Hot Encoding
  for categorical features and optimized preprocessing.
</p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Phase 04</span>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-slate-700" /> Precision Inference
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
Real-time inference yielding productivity in tons/ha, feature importance analysis,
and tree-to-tree model prediction spread.            </p>
          </div>

        </div>
      </div>

      {/* Tech Stack & Key Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Frontend Architecture</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>• React 19 with TypeScript</li>
            <li>• Vite ultra-fast build toolchain</li>
            <li>• Tailwind CSS utility framework</li>
            <li>• Lucide React iconography</li>
            <li>• Recharts responsive data visualizations</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>ML Models Benchmarked</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
  <li>• <strong>Random Forest Regressor</strong></li>
  <li>• <strong>300 Decision Trees</strong></li>
  <li>• Test-set R²: <strong>0.9181 (91.81%)</strong></li>
  <li>• MAE: <strong>1.3296 tons/ha</strong></li>
  <li>• RMSE: <strong>3.4796 tons/ha</strong></li>
</ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Academic References</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-500">
            <li>• ICAR Agricultural Statistics Handbook</li>
            <li>• FAO Precision Farming Guidelines</li>
            <li>• Breiman, L. "Random Forests" (2001)</li>
            <li>• Ministry of Ag. & Farmers Welfare (India)</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
