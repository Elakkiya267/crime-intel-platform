import React from 'react';

export default function HeatmapPlaceholder() {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Crime Heatmaps</div>
          <div className="text-xs text-slate-500">Interactive Leaflet heatmaps will be implemented next</div>
        </div>
        <div className="rounded-xl bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          Drill-down enabled
        </div>
      </div>
      <div className="mt-4 h-64 rounded-xl bg-slate-50" />
    </section>
  );
}

