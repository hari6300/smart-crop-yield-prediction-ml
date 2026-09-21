import React from 'react';
import { PageType } from '../types';
import { 
  LayoutDashboard, 
  Sprout, 
  History, 
  BarChart3, 
  GraduationCap, 
  Cpu, 
  CheckCircle2, 
  X,
  Leaf
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  predictionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  predictionCount
}) => {
  const navItems: { id: PageType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prediction', label: 'Crop Yield Prediction', icon: Sprout, badge: 'ML Form' },
    { id: 'history', label: 'Prediction History', icon: History, badge: predictionCount > 0 ? predictionCount : undefined },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'about', label: 'About Project', icon: GraduationCap }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SmartCrop</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">AI</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Yield Prediction System</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'prediction' && currentPage === 'bill-preview');
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom ML Model Active Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 m-3 rounded-xl border">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Random Forest Regressor
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
<span>Test-set R²</span>           
 <span className="font-bold text-emerald-700 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 91.81% R²
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[91.81%]" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Trained on 17,180 samples
          </p>
        </div>
      </aside>
    </>
  );
};
