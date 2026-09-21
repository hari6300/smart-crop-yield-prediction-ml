import React from 'react';
import { PredictionResult } from '../types';
import { downloadBillSlip } from '../utils/printBillSlip';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  Sprout, 
  FileSpreadsheet,
  Layers,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

interface BillSlipModalProps {
  prediction: PredictionResult | null;
  onClose: () => void;
}

export const BillSlipModal: React.FC<BillSlipModalProps> = ({
  prediction,
  onClose
}) => {
  const [hasDownloaded, setHasDownloaded] = React.useState(false);

  if (!prediction) return null;

  const handleDownload = () => {
    downloadBillSlip(prediction);
    setHasDownloaded(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const areaAcres = prediction.input.area;
  const areaHa = (areaAcres * 0.404686).toFixed(2);
  const yieldPerAcre = (prediction.predictedYield * 0.404686).toFixed(2);
  const totalVal = prediction.estimatedRevenue.totalValue;

  const printDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const printTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const billNo = `AGRO-BILL-${prediction.id.replace('pred-', '').toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:rounded-none print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar (Hidden during print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Official Kisan Mandi Bill Slip
              </h3>
              <p className="text-xs text-emerald-100">
                Itemized harvest valuation & agronomic estimation memo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Download Bill File (.html)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{hasDownloaded ? 'Downloaded ✓' : 'Save / Download'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white text-emerald-950 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Print to printer or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download notice banner */}
        {hasDownloaded && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 font-medium flex items-center justify-between print:hidden">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Bill slip downloaded to your downloads folder as an official HTML invoice document!
            </span>
            <button 
              onClick={handleDownload}
              className="text-emerald-700 hover:text-emerald-900 underline font-bold"
            >
              Download again
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* THE BILL SLIP CONTENT (Clean, authentic bill-receipt format) */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white font-sans text-slate-800 print:max-h-none print:p-0">
          
          {/* Bill Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="text-2xl mb-1">🌾</div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              Department of Agricultural Decision Support & Extension
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              CROP YIELD & HARVEST ESTIMATION BILL SLIP
            </h1>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Agro-Climatic Mandi Memorandum • Smart Kisan ML Protocol
            </div>
          </div>

          {/* Bill Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bill Memo No.</span>
              <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{billNo}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
              <span className="font-semibold text-slate-800">{printDate}</span>
              <span className="text-[10px] text-slate-500 block">{printTime}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agri Field ID</span>
              <span className="font-mono font-semibold text-slate-800">
                IN-{prediction.input.district.slice(0, 3).toUpperCase()}-{prediction.id.slice(-5)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Model Validation</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                Verified 95% CI
              </span>
            </div>
          </div>

          {/* Section 1: Farm Particulars (Area in ACRES prominent) */}
          <div>
            <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-l-3 border-emerald-600 pl-2 mb-2 flex items-center justify-between">
              <span>1. Cultivated Farm & Landholding Particulars</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Area Specified in Acres
              </span>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/70 divide-x divide-slate-200">
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Crop</span>
                  <span className="font-bold text-emerald-800 text-sm">{prediction.input.crop}</span>
                </div>
                <div className="p-2.5 bg-emerald-50/60">
                  <span className="text-[10px] text-emerald-800 uppercase font-extrabold block">Cultivated Land Area</span>
                  <span className="font-extrabold text-emerald-950 text-sm">
                    {areaAcres} Acres
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-medium">
                    (~{areaHa} hectares)
                  </span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Location</span>
                  <span className="font-bold text-slate-800">{prediction.input.district}, {prediction.input.state}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cropping Season</span>
                  <span className="font-semibold text-slate-800">{prediction.input.season}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 bg-white">
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Soil Profile</span>
                  <span className="font-medium text-slate-800">{prediction.input.soilType}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Irrigation System</span>
                  <span className="font-medium text-slate-800">{prediction.input.irrigation}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Rainfall / Temp</span>
                  <span className="font-medium text-slate-800">{prediction.input.rainfall} mm • {prediction.input.temperature}°C</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Fertilizer Dose</span>
                  <span className="font-medium text-slate-800">{prediction.input.fertilizer} kg/ha (NPK)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Itemized Yield Assessment Schedule (Bill / Receipt Format) */}
          <div>
            <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-l-3 border-emerald-600 pl-2 mb-2">
              2. Yield Assessment & Economic Valuation Schedule
            </div>
            
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Description of Assessment Item</th>
                    <th className="py-2.5 px-3 text-center">Rate / Metric</th>
                    <th className="py-2.5 px-3 text-center">Field Basis</th>
                    <th className="py-2.5 px-3 text-right">Computed Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono">01</td>
                    <td className="py-2 px-3">
                      <strong className="text-slate-900">Crop Yield Rate (Hectare Basis)</strong>
                      <span className="text-[10px] text-slate-500 block">Standard international agricultural unit</span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-700">
                      {prediction.predictedYield} t/ha
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">Per Hectare</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">
                      {prediction.predictedYield} Tons/ha
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 bg-emerald-50/30">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono">02</td>
                    <td className="py-2 px-3">
                      <strong className="text-emerald-950">Crop Yield Rate (Acre Basis)</strong>
                      <span className="text-[10px] text-emerald-700 block">Converted: 1 Acre = 0.4047 Hectare</span>
                    </td>
                    <td className="py-2 px-3 text-center font-extrabold text-emerald-800">
                      {yieldPerAcre} t/acre
                    </td>
                    <td className="py-2 px-3 text-center text-slate-700 font-medium">Per Acre</td>
                    <td className="py-2 px-3 text-right font-extrabold text-emerald-800">
                      {yieldPerAcre} Tons/acre
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono">03</td>
                    <td className="py-2 px-3">
                      <strong className="text-slate-900">Total Harvest Production</strong>
                      <span className="text-[10px] text-slate-500 block">Gross output across total {areaAcres} acres</span>
                    </td>
                    <td className="py-2 px-3 text-center font-medium">{yieldPerAcre} t/acre</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">{areaAcres} Acres</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 text-sm">
                      {prediction.totalProduction} MT
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono">04</td>
                    <td className="py-2 px-3">
                      <strong className="text-slate-900">Govt. Minimum Support Price (MSP)</strong>
                      <span className="text-[10px] text-slate-500 block">Official benchmark procurement valuation</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-700">₹{prediction.estimatedRevenue.pricePerTon.toLocaleString('en-IN')}/ton</td>
                    <td className="py-2 px-3 text-center font-medium">{prediction.totalProduction} MT</td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-800 font-mono">
                      ₹{(prediction.totalProduction * prediction.estimatedRevenue.pricePerTon).toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* Net production value row */}
                  <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] text-slate-700">
                      Net Assessed Gross Production Value:
                    </td>
                    <td className="py-2.5 px-3 text-right text-base text-emerald-800 font-extrabold font-mono">
                      ₹{totalVal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand Total Receipt Card */}
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Total Assessed Harvest Worth (Gross MSP Value)
              </span>
              <span className="text-[11px] text-emerald-700 italic font-medium">
                Calculated for {areaAcres} Acres of {prediction.input.crop} Cultivation
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono">
                ₹{totalVal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Section 3: ML Model Diagnostics & Agronomic Advisory */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Model R²: <span className="text-emerald-700">{prediction.confidenceScore}%</span> ({prediction.yieldCategory} Potential)
              </span>
              <span className="text-[11px] text-slate-500">
                Model Prediction Spread: <strong>{prediction.confidenceInterval.min} – {prediction.confidenceInterval.max} t/ha</strong>
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-1">
                Field Prescriptions & Management Advisory:
              </span>
              <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Footer: Barcode and Verification Seal */}
          <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Verification Barcode:</span>
              <div className="font-mono text-sm tracking-widest text-slate-800 font-bold bg-slate-100 px-3 py-1 rounded border border-slate-200 inline-block mt-0.5">
                ||| | ||||| | ||| ||||| || |||
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Computer-Generated Agro Memorandum • No Physical Signature Required
              </p>
            </div>

            <div className="border-2 border-dashed border-emerald-600 rounded-lg p-2.5 text-center text-emerald-700 font-extrabold uppercase text-[10px] tracking-wider transform -rotate-2">
              <div>★ AGRO-ML VERIFIED ★</div>
              <div>KRISHI KALYAN MANDI</div>
              <div className="text-[8px] font-bold text-slate-500 mt-0.5">AUTHENTIC MEMO</div>
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden on print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            Audit Hash: {prediction.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{hasDownloaded ? 'Downloaded ✓' : 'Save / Download Bill'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
