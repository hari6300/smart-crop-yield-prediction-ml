import React from 'react';
import { PredictionResult, PageType } from '../types';
import { CROP_YIELD_BENCHMARKS } from '../data/cropData';
import { 
  Sprout, 
  TrendingUp, 
  Activity, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  CloudSun,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface DashboardPageProps {
  history: PredictionResult[];
  onNavigate: (page: PageType) => void;
  onSelectPrediction: (pred: PredictionResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  history,
  onNavigate,
  onSelectPrediction
}) => {
  // Compute dashboard metrics dynamically
  const totalPredictions = history.length;
  const avgYield = totalPredictions > 0
    ? (history.reduce((acc, curr) => acc + curr.predictedYield, 0) / totalPredictions).toFixed(2)
    : '4.24';

  const totalAreaMonitored = history.reduce((acc, curr) => acc + curr.input.area, 0).toFixed(1);

  // Find most frequent / top crop
  const cropCounts: Record<string, number> = {};
  history.forEach(h => {
    cropCounts[h.input.crop] = (cropCounts[h.input.crop] || 0) + 1;
  });
  const topCrop = Object.keys(cropCounts).sort((a, b) => cropCounts[b] - cropCounts[a])[0] || 'Wheat';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 translate-y-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Smart Agriculture Decision Support System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Crop Yield Prediction Using ML
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
Empowering agricultural science with machine learning-based Random Forest regression.              Forecast expected yields in <span className="font-semibold text-white underline decoration-emerald-400">tons/hectare</span> across Indian agro-climatic zones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dash-predict-now"
              onClick={() => onNavigate('prediction')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Predict Yield Now</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Predictions</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalPredictions}</span>
            <span className="text-xs text-emerald-600 font-medium ml-2">Active records</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Simulated & logged inferences</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Yield</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{avgYield}</span>
            <span className="text-xs font-bold text-slate-600">tons / ha</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across monitored test farms</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model R² Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">91.81%</span>
            <span className="text-xs text-slate-500 ml-2">Test-set R²</span>          </div>
          <p className="text-xs text-slate-400 mt-1">Random Forest Regressor</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Studied Crop</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{topCrop}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{totalAreaMonitored} acres farmland modeled (~{(Number(totalAreaMonitored) * 0.404686).toFixed(1)} ha)</p>
        </div>

      </div>

      {/* Main Charts & Advisory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Crop Benchmark Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                National Average vs ML Predicted Yield Benchmarks
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of standard baseline yields vs optimized ML predictions (tons/hectare)
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Indian Agro Data
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CROP_YIELD_BENCHMARKS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="crop" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit=" t" />
                <Tooltip 
                  formatter={(value: any) => [`${value} tons/ha`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="nationalAvg" name="National Avg Yield" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mlPredictedAvg" name="ML Model Predicted Avg" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highPotential" name="High Potential (Optimum)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Info Box: Seasonal Agro Advisory (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Weather & Advisory Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CloudSun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Agro-Climatic Advisory</h4>
                <p className="text-[11px] text-slate-400">Current Season Guidelines</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="font-semibold text-emerald-900 block mb-0.5">🌾 Rabi Sowing Preparation</span>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Wheat and Mustard seedbed preparation in Northern plains. Ensure basal phosphate dose is applied before first irrigation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">💧 Water Table & Irrigation</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Micro-sprinkler and drip systems yield up to 18% higher productivity per cubic meter of water compared to traditional flood irrigation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="font-semibold text-amber-900 block mb-0.5">🌱 Fertilizer Efficiency Notice</span>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  Apply urea in split applications (basal + tillering + panicle initiation) rather than single heavy broadcasting.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Pipeline Status */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Project Pipeline</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Live ML API</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trained on multi-regional datasets from the Indian Council of Agricultural Research (ICAR).
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
  <span className="text-slate-400">Random Forest Trees</span>
  <span className="font-bold text-emerald-300">300</span>
</div>
          </div>

        </div>

      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Recent Prediction History</h3>
            <p className="text-xs text-slate-500">Latest field yield inferences processed by the system</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600 text-xs font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Predicted Yield</th>
                <th className="py-3 px-4">Total Production</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.slice(0, 5).map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
                        🌱
                      </span>
                      <span>{record.input.crop}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{record.input.district}, {record.input.state}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {record.input.season}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium">
                    <span className="font-bold text-slate-800">{record.input.area} acres</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                      {record.predictedYield} tons/ha
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-900">
                    {record.totalProduction} tons
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectPrediction(record)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Inspect Prediction Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
