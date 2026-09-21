import React, { useState, useEffect } from 'react';
import { PageType, PredictionResult } from './types';
import { INITIAL_HISTORY } from './data/cropData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { PredictionPage } from './components/PredictionPage';
import { HistoryPage } from './components/HistoryPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AboutPage } from './components/AboutPage';
import { PredictionDetailModal } from './components/PredictionDetailModal';
import { BillPreviewPage } from './components/BillPreviewPage';

const STORAGE_KEY = 'smart_crop_prediction_history_v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [previewBillPrediction, setPreviewBillPrediction] = useState<PredictionResult | null>(null);
  const [billPreviewReturnPage, setBillPreviewReturnPage] = useState<PageType>('prediction');
  
  // Initialize prediction history from localStorage or seed data
  const [history, setHistory] = useState<PredictionResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading prediction history from localStorage:', e);
    }
    return INITIAL_HISTORY;
  });

  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(() => {
    return history.length > 0 ? history[0] : null;
  });

  // Sync to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save prediction history in localStorage:', e);
    }
  }, [history]);

  const handleSavePrediction = (newPrediction: PredictionResult) => {
    setHistory((prev) => {
      // Avoid duplicate by ID
      const filtered = prev.filter((p) => p.id !== newPrediction.id);
      return [newPrediction, ...filtered];
    });
    setLatestPrediction(newPrediction);
  };

  const handleDeletePrediction = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (selectedPrediction?.id === id) {
      setSelectedPrediction(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleRestoreSampleData = () => {
    setHistory(INITIAL_HISTORY);
    setLatestPrediction(INITIAL_HISTORY[0]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
  };

  const handleNavigateToBillPreview = (pred: PredictionResult, returnTo: PageType = 'prediction') => {
    setPreviewBillPrediction(pred);
    setBillPreviewReturnPage(returnTo);
    setCurrentPage('bill-preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        predictionCount={history.length}
      />

      {/* Main Content Area (offset on lg by sidebar width 72 -> 18rem) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMobile={() => setIsOpenMobile(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'dashboard' && (
            <DashboardPage
              history={history}
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPrediction={(pred) => setSelectedPrediction(pred)}
            />
          )}

          {currentPage === 'prediction' && (
            <PredictionPage
              onSavePrediction={handleSavePrediction}
              latestPrediction={latestPrediction}
              onNavigateToBillPreview={(pred) => handleNavigateToBillPreview(pred, 'prediction')}
            />
          )}

          {currentPage === 'history' && (
            <HistoryPage
              history={history}
              onSelectPrediction={(pred) => setSelectedPrediction(pred)}
              onDeletePrediction={handleDeletePrediction}
              onClearAll={handleClearAll}
              onRestoreSampleData={handleRestoreSampleData}
              onNavigateToBillPreview={(pred) => handleNavigateToBillPreview(pred, 'history')}
            />
          )}

          {currentPage === 'analytics' && <AnalyticsPage />}

          {currentPage === 'about' && <AboutPage />}

          {currentPage === 'bill-preview' && (
            <BillPreviewPage
              prediction={previewBillPrediction || latestPrediction}
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              returnPage={billPreviewReturnPage}
            />
          )}
        </main>

        {/* Clean Footer */}
        <footer className="bg-white border-t border-slate-200/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Smart Crop Yield Prediction</span>
            <span>•</span>
            <span>College Machine Learning Capstone</span>
          </div>
          <div className="text-slate-400">
            Random Forest & XGBoost Regression • Indian Council of Agricultural Research (ICAR) Data
          </div>
        </footer>
      </div>

      {/* Detail Inspection Modal */}
      <PredictionDetailModal
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
        onNavigateToBillPreview={(pred) => handleNavigateToBillPreview(pred, currentPage)}
      />
    </div>
  );
}
