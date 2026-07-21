import React from 'react';

export default function FilterPanel() {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <div className="text-xs font-bold text-slate-700">Quick Filters</div>
          <div className="text-[10px] text-slate-400 font-medium">Filter workspace context</div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5">AI-linked</div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">District</label>
          <select className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
            <option>All Districts</option>
            <option>Bengaluru Urban</option>
            <option>Mysuru</option>
            <option>Mangaluru</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crime Type</label>
          <select className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
            <option>All Categories</option>
            <option>Cyber Crime</option>
            <option>Women Safety</option>
            <option>Traffic Crimes</option>
            <option>Financial Crimes</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Investigation Status</label>
          <select className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
            <option>All Statuses</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Solved</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <button className="rounded-xl bg-primary-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-700 shadow-soft transition">
          Apply Filters
        </button>
        <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition">Reset</button>
      </div>
    </section>
  );
}

