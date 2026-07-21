import React, { useEffect, useState } from 'react';
import KPIGrid from '../../shared/KPIGrid/KPIGrid';
import ActivityFeed from '../../shared/ActivityFeed/ActivityFeed';
import { api } from '../../shared/api';
import { Shield, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import HotspotsMap from '../Hotspots/HotspotsPage'; // We will build HotspotsPage to be a beautiful map, so we can link or embed it

interface DashboardData {
  kpis: {
    totalFirs: number;
    openCases: number;
    solvedCases: number;
    pendingCases: number;
    repeatOffenders: number;
    hotspotsCount: number;
  };
  activities: any[];
  trends: Array<{ name: string; crimes: number }>;
  breakdown: Array<{ type: string; count: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard metrics:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-500">Loading KSP Intelligence Registry...</span>
        </div>
      </div>
    );
  }

  // Calculate SVG dimensions for the trend line chart
  const padding = 40;
  const chartHeight = 220;
  const chartWidth = 560;
  const trendMaxVal = Math.max(...data.trends.map((t) => t.crimes)) * 1.15;
  const trendPoints = data.trends.map((t, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (data.trends.length - 1);
    const y = chartHeight - padding - (t.crimes * (chartHeight - padding * 2)) / trendMaxVal;
    return { x, y, label: t.name, val: t.crimes };
  });

  const trendPath = trendPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${trendPath} L ${trendPoints[trendPoints.length - 1].x} ${chartHeight - padding} L ${trendPoints[0].x} ${chartHeight - padding} Z`;

  // Colors for breakdown chart
  const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500'];
  const textColors = ['text-indigo-600', 'text-rose-600', 'text-emerald-600', 'text-amber-600'];

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 p-6 text-white shadow-soft">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-700/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-indigo-500/15 blur-2xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Karnataka State Police Command</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligent Crime Intelligence & Copilot</h1>
            <p className="text-sm text-indigo-200">
              Natural language lookup, relationship audits, hotspots forecast, and digital evidence custody.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/chat" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 shadow-soft hover:bg-slate-50">
              Launch AI Copilot
            </a>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid metrics={data.kpis} />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Crime Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Monthly Crime Trend Index</h2>
              <p className="text-xs text-slate-400">Total recorded and forecasted index cases</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-xl">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Upward Trend (7% YoY)</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                const y = padding + r * (chartHeight - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Line path */}
              <path d={trendPath} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />

              {/* Points */}
              {trendPoints.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" />
                  <circle cx={p.x} cy={p.y} r="8" fill="#4F46E5" opacity="0" className="hover:opacity-20 transition-opacity" />
                  
                  {/* Labels on x-axis */}
                  <text x={p.x} y={chartHeight - 12} fontSize="10" fill="#94A3B8" textAnchor="middle" fontWeight="500">
                    {p.label}
                  </text>
                  
                  {/* Tooltip text */}
                  <text x={p.x} y={p.y - 12} fontSize="11" fill="#1E293B" textAnchor="middle" fontWeight="700" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                    {p.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Action Feeds */}
        <div>
          <ActivityFeed activities={data.activities} />
        </div>
      </div>

      {/* Bottom Grid: Crime Distribution & Geo Hotspots */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Crime Type Breakdown */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-800">Crime Type Distribution</h2>
          <p className="text-xs text-slate-400">Recorded cases categorized by prime offense</p>
          
          <div className="mt-6 space-y-4">
            {data.breakdown.map((item, idx) => {
              const total = data.breakdown.reduce((acc, curr) => acc + curr.count, 0);
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.type}</span>
                    <span>{item.count} cases ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hotspot & Sociological Insights Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Sociological Risk Indicators</h2>
              <p className="text-xs text-slate-400">Urban indicators correlating economic factors with crime types</p>
            </div>
            <a href="/crime-analytics" className="text-xs font-bold text-indigo-600 hover:underline">
              View Analytics Details
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-indigo-50/50 p-4 border border-indigo-100/50">
              <div className="text-xs font-bold text-indigo-600">Bengaluru Urban</div>
              <div className="mt-2 text-lg font-bold text-slate-800">93.4% Urban</div>
              <div className="mt-1 text-xs text-slate-500">Strong correlation with specialized cyber simulation rings.</div>
            </div>
            <div className="rounded-xl bg-rose-50/50 p-4 border border-rose-100/50">
              <div className="text-xs font-bold text-rose-600">Hubballi-Dharwad</div>
              <div className="mt-2 text-lg font-bold text-slate-800">61.0 Economic Stress</div>
              <div className="mt-1 text-xs text-slate-500">Elevated occurrence of land-grabbing and registration forgery.</div>
            </div>
            <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-100/50">
              <div className="text-xs font-bold text-emerald-600">Mangaluru</div>
              <div className="mt-2 text-lg font-bold text-slate-800">68.1% Migration</div>
              <div className="mt-1 text-xs text-slate-500">Linked to cross-border logistics bypass & smuggling transactions.</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-xs text-amber-800 flex gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Intelligence Alert:</strong> Fast urbanization trends directly drive high-impact sim swap phishing campaigns in Bangalore commercial nodes. High-density warning in effect.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
