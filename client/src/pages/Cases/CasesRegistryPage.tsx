import React, { useState } from 'react';
import CasesPage from './CasesPage';
import FirManagementPage from '../FIR/FirManagementPage';
import VictimsPage from '../Victims/VictimsPage';
import WitnessesPage from '../Witnesses/WitnessesPage';
import { FileText, PlusCircle, Users, UserCheck, Shield } from 'lucide-react';

type TabId = 'cases' | 'fir' | 'victims' | 'witnesses';

export default function CasesRegistryPage() {
  const [activeTab, setActiveTab] = useState<TabId>('cases');

  const tabs = [
    { id: 'cases', label: 'Active Cases List', icon: <FileText className="h-4 w-4" /> },
    { id: 'fir', label: 'Register New FIR', icon: <PlusCircle className="h-4 w-4" /> },
    { id: 'victims', label: 'Victims Directory', icon: <Users className="h-4 w-4" /> },
    { id: 'witnesses', label: 'Witness Statements', icon: <UserCheck className="h-4 w-4" /> }
  ];

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      {/* Registry Header */}
      <div className="border-b border-[#E2E8F0] bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-sans flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <span>KSP Case & FIR Registry Hub</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              File new Digital FIR logs, query active case files, view witness transcripts, and access victim records.
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
        {activeTab === 'cases' && <CasesPage />}
        {activeTab === 'fir' && <FirManagementPage />}
        {activeTab === 'victims' && <VictimsPage />}
        {activeTab === 'witnesses' && <WitnessesPage />}
      </div>
    </div>
  );
}
