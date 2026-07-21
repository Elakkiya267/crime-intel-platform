import React from 'react';

interface KPIGridProps {
  metrics: {
    totalFirs: number;
    openCases: number;
    solvedCases: number;
    pendingCases: number;
    repeatOffenders: number;
    hotspotsCount: number;
  };
}

export default function KPIGrid({ metrics }: KPIGridProps) {
  const kpis = [
    { label: 'Total FIRs', value: metrics.totalFirs.toLocaleString(), change: '+4.2%', changeType: 'increase' },
    { label: 'Open Cases', value: metrics.openCases.toLocaleString(), change: 'Needs Action', changeType: 'warning' },
    { label: 'Solved Cases', value: metrics.solvedCases.toLocaleString(), change: '81.4% Rate', changeType: 'success' },
    { label: 'Pending Investigation', value: metrics.pendingCases.toLocaleString(), change: '-12%', changeType: 'decrease' },
    { label: 'Repeat Offenders', value: metrics.repeatOffenders.toLocaleString(), change: 'High Risk', changeType: 'danger' },
    { label: 'Active Hotspots', value: metrics.hotspotsCount.toLocaleString(), change: 'Patrol Active', changeType: 'info' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k) => (
        <div key={k.label} className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{k.label}</div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-800">{k.value}</div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              k.changeType === 'success' ? 'bg-emerald-50 text-emerald-700' :
              k.changeType === 'danger' ? 'bg-rose-50 text-rose-700' :
              k.changeType === 'warning' ? 'bg-amber-50 text-amber-700' :
              k.changeType === 'info' ? 'bg-sky-50 text-sky-700' :
              k.changeType === 'increase' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-700'
            }`}>
              {k.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

