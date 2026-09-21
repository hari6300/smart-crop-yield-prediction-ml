import React from 'react';
import { PageType } from '../types';
import { Menu, Sprout, ShieldCheck, Activity, Calendar } from 'lucide-react';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenMobile
}) => {
  const getPageInfo = (page: PageType) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Smart Crop Intelligence Dashboard',
          description: 'Overview of yield forecasts, model benchmarks, and agro-climatic telemetry.'
        };
      case 'prediction':
        return {
          title: 'Crop Yield Prediction Model',
          description: 'Input soil, climate, fertilizer, and geographic parameters to infer yield in tons/hectare.'
        };
      case 'history':
        return {
          title: 'Prediction History & Audit Log',
          description: 'Review historical inferences, compare simulated yields, and export data.'
        };
      case 'analytics':
        return {
          title: 'Agricultural & ML Model Analytics',
          description: 'Feature importance, response curves, and multi-model benchmark statistics.'
        };
      case 'about':
        return {
          title: 'Project Documentation & Architecture',
          description: 'Methodology, regression ensemble architecture, dataset details, and credits.'
        };
      case 'bill-preview':
        return {
          title: 'Official Kisan Mandi Bill Slip Preview',
          description: 'Review harvest valuation receipt, then print or save/download the official document.'
        };
    }
  };

  const pageInfo = getPageInfo(currentPage);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            {pageInfo.description}
          </p>
        </div>
      </div>

      {/* Right Header Status and Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Model status pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Model R²: 91.81%</span>
        </div>

        {/* Season indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Indian Agro Season</span>
        </div>

        {/* Predict CTA button if not currently on prediction page */}
        {currentPage !== 'prediction' ? (
          <button
            id="btn-header-predict"
            onClick={() => onNavigate('prediction')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md active:scale-95"
          >
            <Sprout className="w-4 h-4" />
            <span>Predict Yield</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Active Form</span>
          </div>
        )}
      </div>
    </header>
  );
};
