import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, RefreshCw } from 'lucide-react';

export default function FilterPanel() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('All');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (district !== 'All') params.append('district', district);
    if (type !== 'All') params.append('type', type);
    if (status !== 'All') params.append('status', status);
    navigate(`/cases?${params.toString()}`);
  };

  const handleReset = () => {
    setDistrict('All');
    setType('All');
    setStatus('All');
    navigate('/cases');
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary-600" />
          <span className="text-xs font-bold text-slate-800">Quick Cases Search</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 rounded-lg px-2 py-0.5">
          Active Registry
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">District Jurisdiction</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
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
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crime Classification</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Cyber Crime">Cyber Crime</option>
            <option value="Women Safety">Women Safety</option>
            <option value="Financial Crimes">Financial Crimes</option>
            <option value="Theft">Theft</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Investigation Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending Investigation">Pending Investigation</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <button
          onClick={handleApply}
          className="rounded-xl bg-primary-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-700 shadow-soft transition"
        >
          Search Matching Cases
        </button>
        <button
          onClick={handleReset}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
}
