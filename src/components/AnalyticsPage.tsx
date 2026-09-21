import React from 'react';
import { 
  FEATURE_IMPORTANCE_DATA, 
  MODEL_METRICS, 
  RAINFALL_RESPONSE_CURVE, 
  FERTILIZER_EFFICIENCY_DATA, 
  STATE_PRODUCTIVITY_DATA 
} from '../data/cropData';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Droplets, 
  Thermometer, 
  FlaskConical 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Machine Learning & Agronomic Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Predictive Analytics & Model Performance
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Exploratory data analysis, SHAP feature importance weights, environmental response curves, and cross-model validation scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Top Predictor</span>
            <span className="text-base font-bold text-emerald-950">Rainfall (28.4%)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Best Model R²</span>
            <span className="text-base font-bold text-slate-900">0.948</span>
          </div>
        </div>
      </div>

      {/* Row 1: Feature Importance & Fertilizer Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ML Feature Importance (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Feature Importance (Gini Impurity / SHAP)
              </h3>
              <p className="text-xs text-slate-500">
                Relative contribution percentage of each input feature to yield variance
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Random Forest
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={FEATURE_IMPORTANCE_DATA}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" unit="%" stroke="#64748b" fontSize={11} domain={[0, 35]} />
                <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={12} width={120} tickLine={false} />
                <Tooltip 
                  formatter={(val: any) => [`${val}% contribution`, 'Importance']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="importance" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Rainfall and balanced NPK fertilizer account for &gt;50% of model prediction weight.
          </p>
        </div>

        {/* Fertilizer Efficiency & Diminishing Returns (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Fertilizer Response & Diminishing Returns
              </h3>
              <p className="text-xs text-slate-500">
                Liebig's Law of the Minimum vs actual biomass yield response
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Agronomy Law
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FERTILIZER_EFFICIENCY_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fertilizer" stroke="#64748b" fontSize={12} unit=" kg" />
                <YAxis stroke="#64748b" fontSize={12} unit=" t" />
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} tons/ha`, String(name)]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actualYield" name="Actual Yield Curve" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="optimalYield" name="Theoretical Ceiling" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Yield plateaus at ~140-160 kg/ha NPK. Over-application beyond 220 kg causes soil salinity and diminishing yield.
          </p>
        </div>

      </div>

      {/* Row 2: Rainfall Response Curves (Area Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Rainfall Sensitivity Non-Linear Curves Across Crops
            </h3>
            <p className="text-xs text-slate-500">
              Yield output (tons/hectare) simulated across precipitation gradient (200mm to 1800mm)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Quadratic Agro-Response
          </span>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RAINFALL_RESPONSE_CURVE} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="wheatColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="riceColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="maizeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="rainfall" stroke="#64748b" fontSize={12} unit=" mm" />
              <YAxis stroke="#64748b" fontSize={12} unit=" t" />
              <Tooltip 
                formatter={(val: any) => [`${val} tons/ha`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="wheat" name="Wheat (Optimal 500-700mm)" stroke="#f59e0b" fillOpacity={1} fill="url(#wheatColor)" strokeWidth={2} />
              <Area type="monotone" dataKey="rice" name="Rice / Paddy (Optimal 1200-1600mm)" stroke="#0284c7" fillOpacity={1} fill="url(#riceColor)" strokeWidth={2} />
              <Area type="monotone" dataKey="maize" name="Maize (Optimal 700-900mm)" stroke="#10b981" fillOpacity={1} fill="url(#maizeColor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: ML Algorithm Benchmarks Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Machine Learning Model Evaluation & Benchmarks
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison across 5 supervised regression architectures evaluated on test split (20%)
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Random Forest Selected as Primary
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600 text-xs font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3.5 px-4">Algorithm Name</th>
                <th className="py-3.5 px-4">Model Architecture</th>
                <th className="py-3.5 px-4">R² Score</th>
                <th className="py-3.5 px-4">RMSE (tons/ha)</th>
                <th className="py-3.5 px-4">MAE</th>
                <th className="py-3.5 px-4">Training Latency</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MODEL_METRICS.map((m, idx) => (
                <tr key={idx} className={idx === 0 ? 'bg-emerald-50/40 font-medium' : 'hover:bg-slate-50/60'}>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {m.type}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-extrabold text-xs px-2 py-0.5 rounded ${
                      m.r2Score >= 0.93
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.r2Score >= 0.85
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {m.r2Score.toFixed(3)} ({m.accuracy})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                    {m.rmse}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                    {m.mae}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {m.trainingTime}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {idx === 0 ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-full">
                        Deployed In App
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">
                        Evaluated
                      </span>
                    )}
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
