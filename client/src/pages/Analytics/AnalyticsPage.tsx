import React, { useState } from 'react';
import HotspotsPage from '../Hotspots/HotspotsPage';
import CrimeAnalyticsPage from '../CrimeAnalytics/CrimeAnalyticsPage';
import FinancialCrimesPage from '../FinancialCrimes/FinancialCrimesPage';
import NetworkAnalysisPage from '../NetworkAnalysis/NetworkAnalysisPage';
import PredictionsPage from '../Predictions/PredictionsPage';
import { MapPin, BarChart3, Coins, Network, HandCoins, Sparkles, Download } from 'lucide-react';
import { mockFirs, mockHotspots, mockTransactions, mockAccused } from '../../shared/api';

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

  const handleDownloadOverallAnalytics = () => {
    const reportText = `====================================================
KARNATAKA STATE POLICE - STATEWIDE THREAT ANALYTICS REPORT
Generated On: ${new Date().toLocaleString()}
Security Classification: SECRET / OFFICIAL COMMAND USE ONLY
====================================================

1. STATEWIDE CRIME DENSITY METRICS:
- Total Cases Registered: ${mockFirs.length}
- High-Density Patrol Clusters: ${mockHotspots.length} (Peenya, Indiranagar, Devaraja Market, Old Port Area)
- Flagged Money Laundering Transactions: ${mockTransactions.length} (Total Intercepted Amount: ₹24,50,000)
- High-Risk Habitual Suspects: ${mockAccused.filter((a: any) => a.riskLevel === 'High').length}

2. REGIONAL RISK CLUSTERS & PATROL DIRECTIVES:
- Bengaluru Urban (Density 94%): Primary Crime: Cyber & Sim Swap Fraud. Patrol Recommendation: Enhanced Cyber Cell & ANPR.
- Mangaluru (Density 88%): Primary Crime: Hawala & Smuggling. Patrol Recommendation: Joint Coastal Checkpost.
- Mysuru (Density 85%): Primary Crime: Extortion. Patrol Recommendation: Facial Recognition CCTV.

3. PREDICTIVE EARLY WARNING ALERTS:
- Upcoming Seasonal Spike: 7% YoY increase in financial cyber fraud expected during Q3.
- Key Risk Nodes: Ramesh Kumar @ Bullet Ramesh (Risk 88), Vikram Shetty (Risk 79).

====================================================
Command Officer Seal: Karnataka State Police Intelligence Cell
====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KSP-Statewide-Analytics-Report-${new Date().toISOString().substring(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      {/* Analytics Header */}
      <div className="border-b border-[#E2E8F0] bg-white px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 font-sans flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600 animate-pulse" />
                <span>Analytics & Threat Intelligence Hub</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Consolidated spatial densities, money laundering networks, and predictive warnings.
              </p>
            </div>
            
            <button
              onClick={handleDownloadOverallAnalytics}
              className="flex md:hidden items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 text-xs font-bold shadow-soft transition shrink-0"
              title="Download Analytics Report"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Report</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
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

            {/* Desktop Download Report Button */}
            <button
              onClick={handleDownloadOverallAnalytics}
              className="hidden md:flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 text-xs font-bold shadow-soft transition shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Download Overall Analytics Report</span>
            </button>
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
