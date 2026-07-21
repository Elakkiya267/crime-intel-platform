import React, { useState } from 'react';
import HotspotsPage from '../Hotspots/HotspotsPage';
import CrimeAnalyticsPage from '../CrimeAnalytics/CrimeAnalyticsPage';
import FinancialCrimesPage from '../FinancialCrimes/FinancialCrimesPage';
import NetworkAnalysisPage from '../NetworkAnalysis/NetworkAnalysisPage';
import PredictionsPage from '../Predictions/PredictionsPage';
import { MapPin, BarChart3, Coins, Network, HandCoins, Sparkles } from 'lucide-react';

type TabId = 'hotspots' | 'trends' | 'money' | 'network' | 'predictions';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hotspots');

  const tabs = [
    { id: 'hotspots', label: 'Crime Hotspots', icon: <MapPin className="h-4 w-4" /> },
    { id: 'trends', label: 'Demographics & Trends', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'money', label: 'Money Flow Trails', icon: <Coins className="h-4 w-4" /> },
    { id: 'network', label: 'Accomplice Network', icon: <Network className="h-4 w-4" /> },
    { id: 'predictions', label: 'Early Warnings', icon: <HandCoins className="h-4 w-4" /> }
  ];

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      {/* Analytics Header */}
      <div className="border-b border-[#E2E8F0] bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-sans flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-600 animate-pulse" />
              <span>Analytics & Threat Intelligence Hub</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Consolidated spatial densities, money laundering networks, socio-demographic indicators, and predictive warnings.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="rounded-2xl border border-slate-200 p-1 flex bg-slate-50 overflow-x-auto shrink-0 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render Active Tab Component */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'hotspots' && <HotspotsPage />}
        {activeTab === 'trends' && <CrimeAnalyticsPage />}
        {activeTab === 'money' && <FinancialCrimesPage />}
        {activeTab === 'network' && <NetworkAnalysisPage />}
        {activeTab === 'predictions' && <PredictionsPage />}
      </div>
    </div>
  );
}
