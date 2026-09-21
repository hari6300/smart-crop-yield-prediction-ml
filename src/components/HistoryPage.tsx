import React, { useState, useMemo } from 'react';
import { PredictionResult } from '../types';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  RotateCcw, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sprout, 
  TrendingUp,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { downloadBillSlip } from '../utils/printBillSlip';
import { BillSlipModal } from './BillSlipModal';

interface HistoryPageProps {
  history: PredictionResult[];
  onSelectPrediction: (pred: PredictionResult) => void;
  onDeletePrediction: (id: string) => void;
  onClearAll: () => void;
  onRestoreSampleData: () => void;
  onNavigateToBillPreview?: (pred: PredictionResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectPrediction,
  onDeletePrediction,
  onClearAll,
  onRestoreSampleData,
  onNavigateToBillPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'yield_desc' | 'yield_asc' | 'area_desc'>('date_desc');
  const [billSlipPrediction, setBillSlipPrediction] = useState<PredictionResult | null>(null);

  const handlePrintSlip = (pred: PredictionResult) => {
    if (onNavigateToBillPreview) {
      onNavigateToBillPreview(pred);
    } else {
      setBillSlipPrediction(pred);
    }
  };

  // Unique list of crops present in history
  const uniqueCrops = useMemo(() => {
    const crops = new Set<string>();
    history.forEach(h => crops.add(h.input.crop));
    return Array.from(crops);
  }, [history]);

  // Unique list of seasons
  const uniqueSeasons = useMemo(() => {
    const seasons = new Set<string>();
    history.forEach(h => seasons.add(h.input.season));
    return Array.from(seasons);
  }, [history]);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return history.filter(item => {
      // Search matching state, district, or crop
      const matchesSearch = 
        item.input.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.input.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.input.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.input.soilType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCrop = selectedCropFilter === 'ALL' || item.input.crop === selectedCropFilter;
      const matchesSeason = selectedSeasonFilter === 'ALL' || item.input.season === selectedSeasonFilter;

      return matchesSearch && matchesCrop && matchesSeason;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'date_asc') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === 'yield_desc') return b.predictedYield - a.predictedYield;
      if (sortBy === 'yield_asc') return a.predictedYield - b.predictedYield;
      if (sortBy === 'area_desc') return b.input.area - a.input.area;
      return 0;
    });
  }, [history, searchQuery, selectedCropFilter, selectedSeasonFilter, sortBy]);

  // Export to CSV function
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;

    const headers = [
      'Prediction ID',
      'Date',
      'Crop',
      'State',
      'District',
      'Area (Acres)',
      'Area (Hectares)',
      'Rainfall (mm)',
      'Temperature (°C)',
      'Fertilizer (kg/ha)',
      'Irrigation',
      'Season',
      'Soil Type',
      'Predicted Yield (tons/ha)',
      'Yield (tons/acre)',
      'Total Production (tons)',
      'Confidence Score (%)',
      'Category',
      'Estimated Value (INR)'
    ];

    const csvRows = filteredRecords.map(r => [
      r.id,
      new Date(r.timestamp).toLocaleDateString(),
      `"${r.input.crop}"`,
      `"${r.input.state}"`,
      `"${r.input.district}"`,
      r.input.area,
      (r.areaHectares || r.input.area * 0.404686).toFixed(2),
      r.input.rainfall,
      r.input.temperature,
      r.input.fertilizer,
      `"${r.input.irrigation}"`,
      `"${r.input.season}"`,
      `"${r.input.soilType}"`,
      r.predictedYield,
      (r.yieldPerAcre || r.predictedYield * 0.404686).toFixed(2),
      r.totalProduction,
      r.confidenceScore,
      r.yieldCategory,
      r.estimatedRevenue.totalValue
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crop_yield_predictions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header with Export & Restore Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Historical Crop Yield Predictions</h2>
              <p className="text-xs text-slate-500">Audit trail of all ML inference runs with export capabilities</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onRestoreSampleData}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Restore sample predictions for demonstration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Samples</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by state, district, or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Crops ({uniqueCrops.length})</option>
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <select
              value={selectedSeasonFilter}
              onChange={(e) => setSelectedSeasonFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Seasons</option>
              {uniqueSeasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            >
              <option value="date_desc">Latest Date First</option>
              <option value="date_asc">Oldest Date First</option>
              <option value="yield_desc">Yield: High to Low</option>
              <option value="yield_asc">Yield: Low to High</option>
              <option value="area_desc">Area: Largest First</option>
            </select>
          </div>

        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredRecords.length}</strong> of {history.length} records
          </span>
          {(searchQuery || selectedCropFilter !== 'ALL' || selectedSeasonFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCropFilter('ALL');
                setSelectedSeasonFilter('ALL');
              }}
              className="text-emerald-700 hover:underline text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-600 text-xs font-semibold border-b border-slate-200/70">
                <tr>
                  <th className="py-3.5 px-4">Date & ID</th>
                  <th className="py-3.5 px-4">Crop</th>
                  <th className="py-3.5 px-4">Geography</th>
                  <th className="py-3.5 px-4">Soil & Irrigation</th>
                  <th className="py-3.5 px-4">Rainfall / Temp</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Predicted Yield</th>
                  <th className="py-3.5 px-4">Production</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-900">
                        {new Date(item.timestamp).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id.slice(-6)}
                      </span>
                    </td>

                    {/* Crop */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                          🌱
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{item.input.crop}</span>
                          <span className="text-[10px] text-slate-500">{item.input.season}</span>
                        </div>
                      </div>
                    </td>

                    {/* Geography */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.input.district}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 pl-4">{item.input.state}</span>
                    </td>

                    {/* Soil & Irrigation */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">{item.input.soilType}</div>
                      <span className="text-[10px] text-slate-500">{item.input.irrigation}</span>
                    </td>

                    {/* Climate */}
                    <td className="py-3.5 px-4 text-xs">
                      <div>{item.input.rainfall} mm</div>
                      <span className="text-[10px] text-slate-500">{item.input.temperature}°C • {item.input.fertilizer}kg/ha</span>
                    </td>

                    {/* Area */}
                    <td className="py-3.5 px-4 text-xs font-medium">
                      <span className="font-bold text-slate-800">{item.input.area} acres</span>
                      <span className="text-[10px] text-slate-400 block">
                        ≈ {(item.areaHectares || item.input.area * 0.404686).toFixed(2)} ha
                      </span>
                    </td>

                    {/* Predicted Yield in tons/ha */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.predictedYield} tons/ha</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                        ≈ {(item.yieldPerAcre || item.predictedYield * 0.404686).toFixed(2)} t/acre
                      </span>
                    </td>

                    {/* Total Production */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-900">
                      {item.totalProduction} tons
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handlePrintSlip(item)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Print / Download Bill Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectPrediction(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="View In-Depth Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePrediction(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">No Matching Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No predictions match your search criteria. Try modifying your filter, or run a new prediction from the prediction page.
            </p>
          </div>
        )}
      </div>

      {/* Bill Slip Modal */}
      <BillSlipModal
        prediction={billSlipPrediction}
        onClose={() => setBillSlipPrediction(null)}
      />
    </div>
  );
};
