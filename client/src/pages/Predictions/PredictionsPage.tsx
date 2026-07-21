import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { ShieldAlert, TrendingUp, Sparkles, Bell, HelpCircle } from 'lucide-react';

interface ForecastItem {
  month: string;
  actual: number | null;
  forecasted: number;
}

interface AlertItem {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  district: string;
  type: string;
}

export default function PredictionsPage() {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPredictions()
      .then(res => {
        setForecast(res.forecast || []);
        setAlerts(res.alerts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching predictions:', err);
        setLoading(false);
      });
  }, []);

  // Compute SVG coords for Actual & Forecast lines
  const width = 640;
  const height = 240;
  const padding = 45;
  const maxVal = 1450; // Max capacity index

  const actualPoints = forecast
    .map((item, idx) => {
      if (item.actual === null) return null;
      const x = padding + (idx * (width - padding * 2)) / (forecast.length - 1);
      const y = height - padding - (item.actual * (height - padding * 2)) / maxVal;
      return { x, y, label: item.month, val: item.actual };
    })
    .filter(p => p !== null) as Array<{ x: number; y: number; label: string; val: number }>;

  const forecastPoints = forecast.map((item, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (forecast.length - 1);
    const y = height - padding - (item.forecasted * (height - padding * 2)) / maxVal;
    return { x, y, label: item.month, val: item.forecasted };
  });

  const actualPath = actualPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const forecastPath = forecastPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Forecasting & Early Warnings</h1>
          <p className="mt-1 text-sm text-slate-500">Proactive prevention analysis powered by time-series predictive modeling</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          <Sparkles className="h-4 w-4" />
          Predictive Analytics Engine Active
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trend Index Forecast Chart */}
          <div className="lg:col-span-2 rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">State Crime Density Index Forecast</h2>
                <p className="text-xs text-slate-400">Quarterly progression curves comparing actual logs with forecasted alerts</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-600" /> Actual</div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400 border border-indigo-600 border-dashed" /> Forecasted</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                  const y = padding + r * (height - padding * 2);
                  return (
                    <line key={idx} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  );
                })}

                {/* Forecast Curve */}
                <path d={forecastPath} fill="none" stroke="#818CF8" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />

                {/* Actual Curve */}
                <path d={actualPath} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />

                {/* Actual Nodes */}
                {actualPoints.map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="4.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
                ))}

                {/* Forecast Nodes */}
                {forecastPoints.map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#FFFFFF" stroke="#818CF8" strokeWidth="2" />
                ))}

                {/* X labels */}
                {forecastPoints.map((p, idx) => (
                  <text key={idx} x={p.x} y={height - 10} fontSize="9" fill="#94A3B8" textAnchor="middle" fontWeight="600">
                    {p.label.split(' ')[0]}
                  </text>
                ))}
              </svg>
            </div>
            <div className="mt-4 bg-[#FAFAFA] rounded-2xl p-3 border border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Dashed line represents AI model forecasts based on historical monthly seasonality averages. Real values updated in real time.</span>
            </div>
          </div>

          {/* Early Warning Trigger Cards */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-rose-500" />
              Proactive Warning Triggers ({alerts.length})
            </div>

            <div className="space-y-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 shadow-soft space-y-3 transition-transform hover:-translate-y-0.5 ${
                    a.severity === 'Critical' ? 'bg-rose-50/50 border-rose-100' :
                    a.severity === 'Warning' ? 'bg-amber-50/50 border-amber-100' : 'bg-indigo-50/50 border-indigo-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-xl px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                      a.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      a.severity === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{a.district}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 leading-normal">{a.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-600 leading-normal">{a.description}</p>
                  </div>

                  <div className="text-[10px] font-bold text-slate-400">
                    Target Profile: <span className="text-slate-600 font-extrabold">{a.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
