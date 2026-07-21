import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, FIR } from '../../shared/api';
import { Search, Plus, Filter, RefreshCw, Eye, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function CasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cases, setCases] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [district, setDistrict] = useState('All');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');

  const selectedCaseId = searchParams.get('caseId') || searchParams.get('id');

  const loadCases = () => {
    setLoading(true);
    api.getCases({
      type: type === 'All' ? undefined : type,
      district: district === 'All' ? undefined : district,
      status: status === 'All' ? undefined : status,
      search: search === '' ? undefined : search,
    })
      .then((res) => {
        let filtered = res;
        if (severity !== 'All') {
          filtered = filtered.filter(f => f.severity === severity);
        }
        setCases(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cases:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCases();
  }, [type, district, status, severity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setDistrict('All');
    setStatus('All');
    setSeverity('All');
  };

  const selectedCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#F8FAFC] min-h-full">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Karnataka State Cases & FIR Registry</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Official real-time investigation ledger across all state jurisdictions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/fir')}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>File New FIR</span>
          </button>
          <button
            onClick={loadCases}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-2.5 text-slate-600 hover:bg-slate-50 shadow-soft transition"
            title="Refresh Ledger"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft space-y-3">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input across ALL categories */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search by FIR ID, Title, Crime Type, District, Station, Date, Severity, MO..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 md:flex-none rounded-xl bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-slate-900 shadow-soft transition"
              >
                Search Ledger
              </button>
              <button
                type="button"
                onClick={loadCases}
                className="rounded-xl bg-primary-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-primary-700 shadow-soft transition flex items-center gap-1.5"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Apply Filters</span>
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Category Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* District Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="All">All Districts</option>
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Bengaluru Rural">Bengaluru Rural</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Mangaluru">Mangaluru</option>
                <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
                <option value="Tumakuru">Tumakuru</option>
                <option value="Belagavi">Belagavi</option>
                <option value="Kalaburagi">Kalaburagi</option>
                <option value="Udupi">Udupi</option>
              </select>
            </div>

            {/* Crime Type Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Crime Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="All">All Crime Types</option>
                <option value="Cyber Crime">Cyber Crime</option>
                <option value="Women Safety">Women Safety</option>
                <option value="Financial Crimes">Financial Crimes</option>
                <option value="Theft">Theft</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Case Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Pending Investigation">Pending Investigation</option>
                <option value="Solved">Solved</option>
              </select>
            </div>

            {/* Severity Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="All">All Severities</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Cases Ledger Table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">Showing {cases.length} Verified Case Records</span>
          <span className="text-[11px] font-semibold text-slate-400">Click any row to inspect complete digital dossier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">FIR / Case ID</th>
                <th className="py-3.5 px-4">District / Station</th>
                <th className="py-3.5 px-4">Incident Title</th>
                <th className="py-3.5 px-4">Crime Type</th>
                <th className="py-3.5 px-4">Filing Date</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                      <span>Loading case ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    No case records found matching search filters. Click "Reset Filters" above.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSearchParams({ caseId: c.id })}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                      selectedCase?.id === c.id ? 'bg-primary-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-extrabold text-primary-700 font-mono whitespace-nowrap">{c.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{c.district}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{c.policeStation}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 max-w-[240px] truncate">{c.title}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-600">{c.type}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-500">{c.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.severity === 'High' ? 'bg-rose-100 text-rose-800' : c.severity === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold inline-flex items-center gap-1 ${
                        c.status === 'Solved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : c.status === 'Open' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.status === 'Solved' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchParams({ caseId: c.id });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3 w-3 text-primary-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Inspector Detail Modal / Panel */}
      {selectedCase && (
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-soft space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600">Selected FIR Case File</span>
              <h2 className="text-lg font-bold text-slate-800">{selectedCase.id}: {selectedCase.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                selectedCase.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedCase.severity} Severity
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                {selectedCase.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Jurisdiction & Station</span>
              <div className="font-bold text-slate-800">{selectedCase.district}</div>
              <div className="text-slate-500 font-semibold">{selectedCase.policeStation}</div>
            </div>
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Modus Operandi</span>
              <div className="font-bold text-slate-800">{selectedCase.modusOperandi}</div>
              <div className="text-slate-500 font-semibold">{selectedCase.type}</div>
            </div>
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Incident Timestamp</span>
              <div className="font-bold text-slate-800">{selectedCase.date} at {selectedCase.time}</div>
              <div className="text-slate-500 font-semibold">{selectedCase.location}</div>
            </div>
          </div>

          <div className="space-y-1 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Official FIR Investigation Narrative</span>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">{selectedCase.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
