import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, FIR } from '../../shared/api';
import { Search, Plus, Filter, RefreshCw, HelpCircle } from 'lucide-react';

export default function CasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cases, setCases] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [district, setDistrict] = useState('All');
  const [status, setStatus] = useState('Any');

  const selectedCaseId = searchParams.get('caseId') || searchParams.get('id');

  const loadCases = () => {
    setLoading(true);
    api.getCases({
      type: type === 'All' ? undefined : type,
      district: district === 'All' ? undefined : district,
      status: status === 'Any' ? undefined : status,
      search: search === '' ? undefined : search,
    })
      .then((res) => {
        setCases(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cases:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCases();
  }, [type, district, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const handleSelectCase = (id: string) => {
    // Keep existing query params but set caseId
    setSearchParams({ caseId: id });
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">State Cases Registry</h1>
          <p className="mt-1 text-sm text-slate-500">Track and filter active investigation logs across districts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/fir')}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            File New FIR
          </button>
          <button
            onClick={loadCases}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-2.5 text-slate-600 hover:bg-slate-50 shadow-soft"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by FIR ID, Title, Modus Operandi..."
              className="w-full rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Search
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">District:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Mangaluru">Mangaluru</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
            </select>
          </div>

          {/* Crime Type Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Type:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Crimes</option>
              <option value="Cyber Crime">Cyber Crime</option>
              <option value="Women Safety">Women Safety</option>
              <option value="Financial Crimes">Financial Crimes</option>
              <option value="Theft">Theft</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="Any">Any Status</option>
              <option value="Open">Open</option>
              <option value="Pending Investigation">Pending</option>
              <option value="Solved">Solved</option>
            </select>
          </div>
        </form>
      </div>

      {/* Cases Ledger Table */}
      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-soft">
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">FIR / Case ID</th>
                  <th className="px-6 py-3.5">District / Station</th>
                  <th className="px-6 py-3.5">Incident Title</th>
                  <th className="px-6 py-3.5">Crime Type</th>
                  <th className="px-6 py-3.5">Filing Date</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No case logs match the specified search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  cases.map((r) => {
                    const isSelected = selectedCaseId?.toLowerCase() === r.id.toLowerCase();
                    return (
                      <tr
                        key={r.id}
                        onClick={() => handleSelectCase(r.id)}
                        className={`cursor-pointer transition duration-150 ${
                          isSelected ? 'bg-primary-50/70 hover:bg-primary-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-bold text-slate-800">{r.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700">{r.district}</div>
                          <div className="text-[10px] text-slate-400">{r.policeStation}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700 max-w-[220px] truncate">{r.title}</div>
                          <div className="text-xs text-slate-400 max-w-[220px] truncate">{r.modusOperandi}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{r.type}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{r.date}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-xl px-2 py-0.5 text-[10px] font-bold ${
                            r.severity === 'High' ? 'bg-rose-50 text-rose-700' :
                            r.severity === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {r.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              'rounded-xl px-3 py-1 text-xs font-semibold ' +
                              (r.status === 'Solved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : r.status === 'Open'
                                ? 'bg-primary-50 text-primary-700'
                                : 'bg-amber-50 text-amber-700')
                            }
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-[#FAFAFA] border-t border-[#E2E8F0] px-6 py-3 text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Select a row to populate the live investigation timeline and secure digital assets on the right panel.</span>
          </div>
        </div>
      )}
    </div>
  );
}
