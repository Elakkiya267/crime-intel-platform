import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from './components/FilterPanel';
import EvidencePanel from './components/EvidencePanel';
import TimelinePanel from './components/TimelinePanel';
import { api, FIR, Evidence } from '../../../shared/api';
import { ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export default function RightInvestigationPanel() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') || searchParams.get('id');

  const [activeCase, setActiveCase] = useState<FIR | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setActiveCase(null);
      setEvidenceList([]);
      return;
    }

    setLoading(true);
    // Fetch all cases to find details
    Promise.all([
      api.getCases(),
      api.getEvidence()
    ])
      .then(([cases, allEvidence]) => {
        const found = cases.find(c => c.id.toLowerCase() === caseId.toLowerCase());
        if (found) {
          setActiveCase(found);
          const filteredEvidence = allEvidence.filter(e => e.caseId.toLowerCase() === caseId.toLowerCase());
          setEvidenceList(filteredEvidence);
        } else {
          setActiveCase(null);
          setEvidenceList([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading investigation context:', err);
        setLoading(false);
      });
  }, [caseId]);

  return (
    <div className="h-full overflow-auto p-4 bg-[#FAFAFA] border-l border-[#E2E8F0]">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div>
          <div className="text-sm font-semibold text-slate-800">Investigation Hub</div>
          <div className="text-xs text-slate-500">Linked context & evidence trail</div>
        </div>
        {caseId ? (
          <div className="rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-semibold text-primary-700">
            Active: {caseId}
          </div>
        ) : (
          <div className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
            Select Case
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-soft">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : activeCase ? (
          <>
            {/* Selected Case Summary Block */}
            <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-bold text-primary-700">{activeCase.id}</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-slate-800">{activeCase.title}</h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-3">{activeCase.description}</p>
              
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-400">Severity: <span className="text-slate-600 font-bold">{activeCase.severity}</span></span>
                <span className={`rounded-xl px-2 py-0.5 ${
                  activeCase.status === 'Solved' ? 'bg-emerald-50 text-emerald-700' :
                  activeCase.status === 'Open' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {activeCase.status}
                </span>
              </div>
            </div>

            {/* Evidence & Custody */}
            <EvidencePanel evidence={evidenceList} />

            {/* Dynamic Timeline */}
            <TimelinePanel activeCase={activeCase} evidence={evidenceList} />
          </>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-center">
            <h3 className="text-xs font-bold text-slate-700">No Active Case Selected</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400 font-medium">
              Select any Case in the registry, or click an AI citation link in the Chat to load the timeline & evidence vault.
            </p>
          </div>
        )}

        {/* Global Filters Panel */}
        <FilterPanel />
      </div>
    </div>
  );
}
