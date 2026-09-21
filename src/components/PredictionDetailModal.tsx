import React, { useState } from 'react';
import { PredictionResult } from '../types';
import {
  X,
  MapPin,
  FileText,
  Sparkles,
  Printer,
  Calendar,
} from 'lucide-react';
import { BillSlipModal } from './BillSlipModal';

interface PredictionDetailModalProps {
  prediction: PredictionResult | null;
  onClose: () => void;
  onNavigateToBillPreview?: (prediction: PredictionResult) => void;
}

export const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({
  prediction,
  onClose,
  onNavigateToBillPreview,
}) => {
  const [showBillModal, setShowBillModal] = useState<boolean>(false);

  if (!prediction) return null;

  const handlePrintSlip = () => {
    if (onNavigateToBillPreview) {
      onNavigateToBillPreview(prediction);
      onClose();
    } else {
      setShowBillModal(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prediction Audit Detail</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight">
                {prediction.input.crop} Yield Report
              </h3>

              <p className="text-xs text-emerald-100 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {prediction.input.district}, {prediction.input.state}
                </span>

                <span>•</span>

                <Calendar className="w-3.5 h-3.5" />

                <span>
                  {new Date(prediction.timestamp).toLocaleDateString()}
                </span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

            {/* Main Yield Result Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Estimated Yield Rate
              </span>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-emerald-900">
                  {prediction.predictedYield}
                </span>

                <span className="text-emerald-700 font-bold text-lg">
                  tons / hectare
                </span>
              </div>

              <div className="text-xs text-emerald-800 font-bold mt-1">
                ≈{' '}
                {(
                  prediction.yieldPerAcre ||
                  prediction.predictedYield * 0.404686
                ).toFixed(2)}{' '}
                tons / acre
              </div>

              {/* Random Forest tree-to-tree prediction spread */}
              <div className="text-xs text-emerald-700 mt-2 font-medium">
                Model Prediction Spread:{' '}
                {prediction.predictionSpread.min} –{' '}
                {prediction.predictionSpread.max} t/ha •{' '}
                {prediction.yieldCategory} Potential
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {/* Total Production */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Total Production
                </span>

                <span className="text-lg font-bold text-slate-900">
                  {prediction.totalProduction} tons
                </span>

                <span className="text-[10px] text-slate-500 font-medium block">
                  on {prediction.input.area} acres (~
                  {(
                    prediction.areaHectares ||
                    prediction.input.area * 0.404686
                  ).toFixed(2)}{' '}
                  ha)
                </span>
              </div>

              {/* Model R² */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Model R²
                </span>

                <span className="text-lg font-bold text-emerald-700">
                  {prediction.modelR2}%
                </span>

                <span className="text-[10px] text-slate-400">
                  Test-set R² score
                </span>
              </div>

              {/* Estimated MSP Value */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Estimated MSP Value
                </span>

                <span className="text-lg font-bold text-slate-900">
                  ₹
                  {prediction.estimatedRevenue.totalValue.toLocaleString(
                    'en-IN'
                  )}
                </span>

                <span className="text-[10px] text-slate-400">
                  ₹
                  {prediction.estimatedRevenue.pricePerTon.toLocaleString(
                    'en-IN'
                  )}
                  /ton
                </span>
              </div>
            </div>

            {/* Input Parameters Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Input Parameters Logged
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">

                {/* Land Area */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Land Area
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.area} acres (~
                    {(
                      prediction.areaHectares ||
                      prediction.input.area * 0.404686
                    ).toFixed(2)}{' '}
                    ha)
                  </span>
                </div>

                {/* Season */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Season
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.season}
                  </span>
                </div>

                {/* Soil Type */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Soil Type
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.soilType}
                  </span>
                </div>

                {/* Irrigation */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Irrigation
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.irrigation}
                  </span>
                </div>

                {/* Rainfall */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Rainfall (Auto/Weather)
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.rainfall} mm
                  </span>
                </div>

                {/* Temperature */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Temperature (Mean)
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.temperature} °C
                  </span>
                </div>

                {/* Fertilizer */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">
                    Fertilizer Application
                  </span>

                  <span className="font-semibold text-slate-800">
                    {prediction.input.fertilizer} kg/ha
                  </span>
                </div>
              </div>

              {/* Soil Telemetry */}
              {prediction.input.soilDetails && (
                <div className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs flex flex-wrap items-center gap-3">
                  <span className="text-emerald-900 font-semibold">
                    🌱 Auto Soil Telemetry:
                  </span>

                  <span>
                    pH: <strong>{prediction.input.soilDetails.pH}</strong>
                  </span>

                  <span>
                    OC:{' '}
                    <strong>
                      {prediction.input.soilDetails.organicCarbon}%
                    </strong>
                  </span>

                  <span>
                    NPK:{' '}
                    <strong>
                      {prediction.input.soilDetails.nitrogenStatus[0]}-
                      {prediction.input.soilDetails.phosphorusStatus[0]}-
                      {prediction.input.soilDetails.potassiumStatus[0]}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Agronomic Advisory
              </span>

              <ul className="space-y-1 text-amber-950">
                {prediction.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              ID: {prediction.id}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintSlip}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Download Bill Receipt Slip"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip (Bill Format)</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Slip Modal */}
      <BillSlipModal
        prediction={showBillModal ? prediction : null}
        onClose={() => setShowBillModal(false)}
      />
    </>
  );
};