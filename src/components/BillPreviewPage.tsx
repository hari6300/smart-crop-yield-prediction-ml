import React, { useState } from 'react';
import { PredictionResult, PageType } from '../types';
import { downloadBillSlip } from '../utils/printBillSlip';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  CheckCircle2, 
  Sprout, 
  FileSpreadsheet,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Maximize2
} from 'lucide-react';

interface BillPreviewPageProps {
  prediction: PredictionResult | null;
  onNavigate: (page: PageType) => void;
  returnPage?: PageType;
}

export const BillPreviewPage: React.FC<BillPreviewPageProps> = ({
  prediction,
  onNavigate,
  returnPage = 'prediction'
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!prediction) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FileSpreadsheet className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Prediction Selected for Bill Preview</h3>
        <p className="text-xs text-slate-500">
          Please run a prediction or select a record from your history to preview its official Kisan Mandi bill slip.
        </p>
        <button
          onClick={() => onNavigate('prediction')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Prediction Form</span>
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    downloadBillSlip(prediction);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4500);
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
    <div className="space-y-6 max-w-4xl mx-auto pb-16 print:p-0 print:m-0 print:max-w-none">
      
      {/* Download Success Confirmation Banner */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 print:hidden">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold block">Bill Slip Downloaded Successfully!</span>
            <span>Your official Kisan Mandi invoice document has been saved to your device in printable receipt format.</span>
          </div>
        </div>
      )}

      {/* THE BILL SLIP CONTAINER (Styled like authentic APMC Mandi Memo) */}
      <div 
        id="printable-bill-slip"
        className="bg-white rounded-3xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 font-sans text-slate-900 space-y-6 relative overflow-hidden print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0"
      >
        {/* Subtle Watermark Stamp */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <div className="text-8xl font-black rotate-[-30deg] uppercase tracking-widest text-slate-900">
            KRISHI MANDI
          </div>
        </div>

        {/* 1. Header: APMC / Agricultural Market Committee */}
        <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            <span>🇮🇳 Government Agricultural Marketing Board</span>
            <span>•</span>
            <span>APMC Regd.</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            KISAN MANDI YIELD & VALUATION SLIP
          </h1>
          <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto">
            Agricultural Produce Market Committee (APMC) • Machine Learning Crop Yield Estimation & Advisory Memo
          </p>
          <div className="inline-block px-3 py-0.5 mt-1 rounded bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-700">
            COMPLIANT WITH ICAR AGRO-DATA STANDARDS
          </div>
        </div>

        {/* 2. Slip Meta & Barcode Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Bill / Slip Serial No.</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{billNo}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Date & Time Issued</span>
            <span className="font-semibold text-slate-800">{printDate} at {printTime}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Verification Audit Hash</span>
            <span className="font-mono text-[11px] text-emerald-700 font-bold">{prediction.id.slice(0, 16)}...</span>
          </div>
        </div>

        {/* 3. Farm & Farmer Particulars */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            1. Farmer & Field Location Particulars
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase">State</span>
              <span className="font-bold text-slate-800">{prediction.input.state}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase">District</span>
              <span className="font-bold text-slate-800">{prediction.input.district}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase">Agro Season</span>
              <span className="font-bold text-slate-800">{prediction.input.season}</span>
            </div>
            <div className="p-3 rounded-lg border-2 border-emerald-500 bg-emerald-50/50">
              <span className="text-emerald-800 block text-[10px] font-extrabold uppercase flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Cultivated Land Area
              </span>
              <span className="font-black text-emerald-950 text-sm">{areaAcres} Acres</span>
              <span className="text-[10px] text-emerald-700 block font-medium">
                (≈ {areaHa} Hectares)
              </span>
            </div>
          </div>
        </div>

        {/* 4. Soil & Environmental Telemetry */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            2. Soil & Agro-Climatic Telemetry Vectors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px]">Soil Classification</span>
              <span className="font-bold text-slate-800">{prediction.input.soilType}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px]">Irrigation System</span>
              <span className="font-bold text-slate-800">{prediction.input.irrigation}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px]">Rainfall Metric</span>
              <span className="font-bold text-slate-800">{prediction.input.rainfall} mm</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px]">Temperature (Mean)</span>
              <span className="font-bold text-slate-800">{prediction.input.temperature} °C</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px]">Fertilizer Applied</span>
              <span className="font-bold text-slate-800">{prediction.input.fertilizer} kg/ha</span>
            </div>
          </div>
        </div>

        {/* 5. Itemized Crop Yield Assessment Table */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            3. Crop Harvest & Minimum Support Price (MSP) Assessment
          </h2>
          
          <div className="border-2 border-slate-900 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-700">Crop Commodity</th>
                  <th className="py-2.5 px-3 border-r border-slate-700">Yield / Hectare</th>
                  <th className="py-2.5 px-3 border-r border-slate-700">Yield / Acre</th>
                  <th className="py-2.5 px-3 border-r border-slate-700">Land Area</th>
                  <th className="py-2.5 px-3 border-r border-slate-700">Gross Harvest</th>
                  <th className="py-2.5 px-3 border-r border-slate-700">Govt MSP Rate</th>
                  <th className="py-2.5 px-3 text-right">Est. Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="bg-white">
                  <td className="py-3 px-3 font-extrabold text-slate-900 border-r border-slate-200">
                    🌾 {prediction.input.crop}
                  </td>
                  <td className="py-3 px-3 border-r border-slate-200 font-bold text-emerald-700">
                    {prediction.predictedYield} t/ha
                  </td>
                  <td className="py-3 px-3 border-r border-slate-200 font-bold text-emerald-800">
                    {yieldPerAcre} t/acre
                  </td>
                  <td className="py-3 px-3 border-r border-slate-200">
                    <strong>{areaAcres} acres</strong> <span className="text-[10px] text-slate-500">({areaHa} ha)</span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 border-r border-slate-200">
                    {prediction.totalProduction} MT
                  </td>
                  <td className="py-3 px-3 border-r border-slate-200">
                    ₹{prediction.estimatedRevenue.pricePerTon.toLocaleString('en-IN')}/ton
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 text-sm">
                    ₹{totalVal.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-900">
                <tr>
                  <td colSpan={6} className="py-2.5 px-3 text-right text-xs uppercase tracking-wider text-slate-600">
                    Total Estimated Farm Valuation (Gross INR):
                  </td>
                  <td className="py-2.5 px-3 text-right text-base font-black text-emerald-800">
                    ₹{totalVal.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 6. Agronomic Advisory & Model Confidence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="sm:col-span-2 space-y-1">
            <span className="font-bold text-slate-900 uppercase text-[10px] block">
              Krishi Vigyan Agro-Advisory Notes:
            </span>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {prediction.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-3 sm:pt-0">
            <span className="font-bold text-slate-900 uppercase text-[10px] block">
              Model Evaluation:
            </span>
            <div className="text-lg font-black text-emerald-700">
              {prediction.modelR2}% R²
            </div>
            <p className="text-[10px] text-slate-500">
              Model Prediction Spread: {prediction.predictionSpread.min} – {prediction.predictionSpread.max} t/ha
            </p>
            <div className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
              {prediction.yieldCategory} Potential
            </div>
          </div>
        </div>

        {/* 7. Official Seal, Signature & Barcode */}
        <div className="pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Verification Barcode</span>
            <div className="font-mono text-base tracking-widest text-slate-800 font-black bg-slate-100 px-4 py-1.5 rounded border border-slate-300 inline-block">
              ||| | ||||| | ||| ||||| || |||
            </div>
            <p className="text-[10px] text-slate-400">
              Authentic Electronic Memorandum • Valid across APMC & State Mandi Centers
            </p>
          </div>

          <div className="border-2 border-dashed border-emerald-600 bg-emerald-50/50 rounded-xl p-3 text-center text-emerald-800 font-black uppercase text-xs tracking-wider transform -rotate-1 shadow-sm">
            <div>★ AGRO-ML VERIFIED ★</div>
            <div className="text-emerald-950 font-black text-sm">KRISHI KALYAN MANDI</div>
            <div className="text-[9px] font-bold text-slate-500 mt-0.5">OFFICIAL SLIP MEMO</div>
          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Bar (Hidden during print) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <span className="text-xs text-slate-500">
          Document ID: <strong className="font-mono text-slate-800">{billNo}</strong>
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigate(returnPage)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {returnPage === 'history' ? 'History' : 'Prediction'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Downloaded ✓' : 'Save / Download Bill'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

    </div>
  );
};
