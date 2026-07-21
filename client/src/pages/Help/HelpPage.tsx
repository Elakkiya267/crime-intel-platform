import React from 'react';
import { HelpCircle, Sparkles, Shield, Key, Terminal, Languages } from 'lucide-react';

export default function HelpPage() {
  const sampleQueries = [
    { eng: 'Show all FIRs in Bengaluru.', kan: 'ಬೆಂಗಳೂರು ಜಿಲ್ಲೆಯ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ', desc: 'Queries case records filterable by division' },
    { eng: 'Find repeat offenders.', kan: 'ಹಳೆಯ ಮತ್ತು ಅಪಾಯಕಾರಿ ಅಪರಾಧಿಗಳು ಯಾರು?', desc: 'Filters accused profiles with 2+ prior arrests' },
    { eng: 'I am worried about high crime and unsafe areas in Indiranagar.', kan: 'ನನಗೆ ಹೆದರಿಕೆಯಾಗುತ್ತಿದೆ, ಇಂದಿರಾನಗರದಲ್ಲಿ ಏನಾದರೂ ಗಲಾಟೆ ನಡೆದಿದೆಯೇ?', desc: 'Fetches spatial crime hotspots and warning alerts' },
    { eng: 'Find cheat transactions and bank scams.', kan: 'ಯಾರೋ ನನ್ನ ಹಣವನ್ನು ವಂಚಿಸಿದ್ದಾರೆ, ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ವಿವರ ನೀಡಿ', desc: 'Isolates flagged suspicious money transfers' },
    { eng: 'Generate case summary for KSP/2026/04431.', kan: 'KSP/2026/04431 ಪ್ರಕರಣದ ಸಾರಾಂಶ ನೀಡಿ', desc: 'Performs direct ID lookup with complete evidence summary' },
  ];

  const roleGovernance = [
    {
      role: 'Investigator',
      permissions: 'Read Cases, Upload Evidence, View Suspects, Add FIRs',
      governance: 'Generates detailed audit logs for every query or case edit.',
      color: 'border-indigo-100 bg-indigo-50/20 text-indigo-800'
    },
    {
      role: 'Analyst',
      permissions: 'Access Hotspots Map, Demographic Trends, Correlation Index',
      governance: 'Authorized to export aggregated statistics; no PII exposure.',
      color: 'border-emerald-100 bg-emerald-50/20 text-emerald-800'
    },
    {
      role: 'Supervisor / Inspector',
      permissions: 'Freeze Accounts, Approve Patrol Dispatch, Sign dossiers',
      governance: 'High-level signatures preserved under strict biometric audit trail.',
      color: 'border-rose-100 bg-rose-50/20 text-rose-800'
    },
    {
      role: 'Superintendent / Policy Maker',
      permissions: 'Audit log inspection, governance reports, compliance dashboard',
      governance: 'Read-only trace logs detailing officer queries and database health.',
      color: 'border-amber-100 bg-amber-50/20 text-amber-800'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary-600" />
            <span>KSP AI Portal Help & Compliance Manual</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Understand bilingual prompt structuring, role-based authorization levels, and governance guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prompt Cheat Sheet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quickstart prompt dictionary */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Terminal className="h-4.5 w-4.5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Bilingual Prompt Dictionary (English & Kannada)</h2>
            </div>
            
            <div className="space-y-4">
              {sampleQueries.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition space-y-2">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                      Query Intent {idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold truncate">{item.desc}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="font-bold text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-0.5">English</span>
                      "{item.eng}"
                    </div>
                    <div className="font-bold text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-indigo-400 uppercase tracking-wide block mb-0.5">Kannada (ಕನ್ನಡ)</span>
                      "{item.kan}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bilingual NLP mechanism description */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Languages className="h-4.5 w-4.5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">Bilingual Token Translation Framework</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              The chatbot uses a state-of-the-art parsing engine. When Kannada prompts are queried, the system performs a token translation lookup using a dictionary mapping terms like <code>ಬೆಂಗಳೂರು</code> (bengaluru), <code>ಅಪರಾಧಿಗಳು</code> (offender), and <code>ಅಪಾಯ</code> (danger) to English vectors, compiling standard state reports. Natural speech synthesis is available in both languages by clicking the speaker icon in the chat logs.
            </p>
          </div>
        </div>

        {/* Right Col: Access Governance */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="h-4.5 w-4.5 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800">Role-Based Governance</h2>
          </div>

          <div className="space-y-4">
            {roleGovernance.map((r, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${r.color} space-y-2`}>
                <div className="flex items-center gap-2">
                  <Key className="h-3.5 w-3.5" />
                  <span className="text-xs font-black uppercase tracking-wider">{r.role}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] leading-relaxed">
                    <strong>Capabilities:</strong> {r.permissions}
                  </div>
                  <div className="text-[10px] opacity-75 leading-relaxed font-medium">
                    <strong>Auditing:</strong> {r.governance}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 text-xs text-amber-800 flex gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Cryptographic Traceability:</strong> Every API fetch and natural language query is signed with local timestamps and recorded in the secure audit logs database visible to supervisors.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
