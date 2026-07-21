import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, Accused } from '../../shared/api';
import { Search, User, ShieldAlert, Award, PhoneCall, Link as LinkIcon, HelpCircle, Activity } from 'lucide-react';

export default function AccusedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accusedList, setAccusedList] = useState<Accused[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState('All');
  const [district, setDistrict] = useState('All');

  const selectedId = searchParams.get('id') || (accusedList.length > 0 ? accusedList[0].id : null);
  const activeAccused = accusedList.find(a => a.id === selectedId) || accusedList[0];

  const loadAccused = () => {
    setLoading(true);
    api.getAccused({
      search: search === '' ? undefined : search,
      risk: risk === 'All' ? undefined : risk,
      district: district === 'All' ? undefined : district
    })
      .then(res => {
        setAccusedList(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading accused:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCasesAndAccused();
  }, [risk, district]);

  const loadCasesAndAccused = () => {
    loadAccused();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadAccused();
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Criminology & Offender Profiling</h1>
        <p className="mt-1 text-sm text-slate-500">Conduct behavioral assessments and risk evaluations of repeat offenders</p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suspect name, MO, ID..."
              className="w-full rounded-xl border border-[#E2E8F0] pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button type="submit" className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900">
            Search
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Risk Level */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Risk Assessment:</span>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-slate-600 outline-none"
            >
              <option value="All">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {/* District */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">District:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-slate-600 outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Mangaluru">Mangaluru</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Suspects List */}
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suspect Profiles ({accusedList.length})</div>
            {accusedList.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center text-xs text-slate-400 shadow-soft">
                No offender profiles found matching search criteria.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-auto pr-1">
                {accusedList.map((a) => {
                  const isSelected = activeAccused && activeAccused.id === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSearchParams({ id: a.id })}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-primary-200 bg-primary-50/50 shadow-soft'
                          : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3 min-w-0">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            a.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {a.id}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-800 truncate">{a.name}</h3>
                            <p className="text-xs text-slate-400 truncate">{a.modusOperandi}</p>
                          </div>
                        </div>
                        <span className={`rounded-xl px-2 py-0.5 text-[9px] font-bold ${
                          a.riskLevel === 'High' ? 'bg-rose-50 text-rose-700' :
                          a.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {a.riskLevel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suspect Profile Detail */}
          <div className="lg:col-span-2">
            {activeAccused ? (
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-soft space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{activeAccused.name}</h2>
                      <p className="text-xs text-slate-400">Suspect Registry Reference: <strong className="text-slate-600">{activeAccused.id}</strong></p>
                      <p className="mt-1 text-xs text-slate-500 font-semibold">{activeAccused.address}</p>
                    </div>
                  </div>
                  
                  {/* Risk Badge Dial */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-[#E2E8F0]">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Risk Evaluation</div>
                      <div className="text-sm font-extrabold text-slate-700">{activeAccused.riskLevel} Risk</div>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-4 font-bold text-xs ${
                      activeAccused.riskScore >= 80 ? 'border-rose-500 text-rose-600' :
                      activeAccused.riskScore >= 50 ? 'border-amber-500 text-amber-600' : 'border-indigo-500 text-indigo-600'
                    }`}>
                      {activeAccused.riskScore}%
                    </div>
                  </div>
                </div>

                {/* Behavioral & Socioeconomic Factors */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-[#E2E8F0]">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sociological Risk Profile</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500">Education:</span>
                        <span className="ml-1.5 font-bold text-slate-700">{activeAccused.education}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Economic Background:</span>
                        <span className="ml-1.5 font-bold text-slate-700">{activeAccused.socioEconomic}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Regular Occupation:</span>
                        <span className="ml-1.5 font-bold text-slate-700">{activeAccused.occupation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-[#E2E8F0]">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Criminology MO Assessment</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500">Modus Operandi:</span>
                        <span className="ml-1.5 font-bold text-slate-700 block mt-0.5 leading-normal">{activeAccused.modusOperandi}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Repeat Index:</span>
                        <span className="ml-1.5 font-bold text-slate-700">{activeAccused.priorArrests} Prior Convictions/Arrests</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criminal Records Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    State Criminal Case Involvements
                  </h4>
                  <div className="space-y-2">
                    {activeAccused.criminalHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                        <div className="text-xs font-bold text-slate-700">{item}</div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">Suspect Record</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial accounts linked */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-indigo-500" />
                    Linked Financial Assets & bank routes
                  </h4>
                  {activeAccused.bankAccounts.length === 0 ? (
                    <div className="text-xs text-slate-400 p-3 bg-slate-50 border border-dashed rounded-xl">No active bank accounts linked to this profile.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {activeAccused.bankAccounts.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA]">
                          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <ShieldAlert className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{item}</div>
                            <div className="text-[9px] text-slate-400 font-semibold">Flagged Account Node</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Network associations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associate Network Connections</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeAccused.networkTies.map((item, idx) => (
                      <span key={idx} className="rounded-xl border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-12 text-center shadow-soft">
                <HelpCircle className="mx-auto h-8 w-8 text-slate-300" />
                <h3 className="mt-2 text-sm font-semibold text-slate-700">Select Offender Profile</h3>
                <p className="mt-1 text-xs text-slate-400">Click a name in the listing to display details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
