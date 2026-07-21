import React, { useState } from 'react';
import { Users, BarChart2, Calendar, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

export default function CrimeAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'demographics' | 'correlations' | 'temporal'>('demographics');

  // Demographic Data
  const ageData = [
    { bracket: 'Under 18', count: 18, pct: 6.2, color: '#3B82F6' },
    { bracket: '18 - 25', count: 94, pct: 32.4, color: '#6366F1' },
    { bracket: '26 - 35', count: 118, pct: 40.7, color: '#EC4899' },
    { bracket: '36 - 50', count: 48, pct: 16.5, color: '#10B981' },
    { bracket: 'Over 50', count: 12, pct: 4.2, color: '#F59E0B' },
  ];

  const socioEconomicData = [
    { label: 'Low Income / Marginalized', count: 124, pct: 42.8, desc: 'High correlation with theft & local crime' },
    { label: 'Lower-Middle Income', count: 88, pct: 30.3, desc: 'Correlates with retail and local disputes' },
    { label: 'Middle Income', count: 62, pct: 21.4, desc: 'High victimhood rate for cyber financial scams' },
    { label: 'High Income', count: 16, pct: 5.5, desc: 'Low offender count, target for complex financial crimes' },
  ];

  // Correlation Data
  const correlationData = [
    {
      factor: 'Urbanization Level vs. Cyber Crime Density',
      coeff: '+0.84',
      type: 'Strong Positive',
      desc: 'Rapid technological integration in major cities (e.g. Bengaluru Urban) creates a dense vector of targets for digital/SIM swap scams.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      factor: 'Economic Distress (Unemployment) vs. Petty Theft',
      coeff: '+0.71',
      type: 'Moderate-Strong Positive',
      desc: 'Local spikes in retail theft and vehicle robbery map closely to microeconomic downturns in manufacturing hubs.',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      factor: 'Literacy / Education Levels vs. Financial Fraud',
      coeff: '+0.78',
      type: 'Strong Positive',
      desc: 'Paradoxically, regions with higher digital literacy experience increased volume of complex corporate and bank transfer fraud operations.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      factor: 'Migration Index vs. Cross-Border Smuggling',
      coeff: '+0.62',
      type: 'Moderate Positive',
      desc: 'High transit logistics hubs (e.g. Mangaluru port nodes) show consistent correlations with cross-district smuggling trails.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  // Temporal & Seasonal Data
  const seasonalMonthlyData = [
    { month: 'Jan', value: 45, event: 'Normal Baseline' },
    { month: 'Feb', value: 52, event: 'Normal Baseline' },
    { month: 'Mar', value: 61, event: 'Financial Year End Scams' },
    { month: 'Apr', value: 58, event: 'Normal Baseline' },
    { month: 'May', value: 74, event: 'Summer Vacation House Burglary' },
    { month: 'Jun', value: 85, event: 'Monsoon E-commerce Shopping Surge' },
    { month: 'Jul', value: 98, event: 'Monsoon Phishing Campaign Peak' },
    { month: 'Aug', value: 92, event: 'Monsoon High Alerts' },
    { month: 'Sep', value: 78, event: 'Festival Preparation' },
    { month: 'Oct', value: 88, event: 'Dussehra Festival Gold Smuggling' },
    { month: 'Nov', value: 94, event: 'Diwali Theft & Robbery Peak' },
    { month: 'Dec', value: 82, event: 'Year-End Transit Fraud' },
  ];

  // SVG parameters for seasonal chart
  const w = 720;
  const h = 260;
  const pad = 40;
  const maxVal = Math.max(...seasonalMonthlyData.map((d) => d.value)) * 1.15;
  const points = seasonalMonthlyData.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / (seasonalMonthlyData.length - 1);
    const y = h - pad - (d.value * (h - pad * 2)) / maxVal;
    return { x, y, ...d };
  });

  const seasonalPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans">Socio-Demographic & Crime Analytics</h1>
          <p className="text-sm text-slate-500">
            Advanced analytics aligning state crime database entries with sociological, demographic, and seasonal risk factors.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="rounded-2xl border border-slate-200 p-1 flex bg-white self-start md:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'demographics' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Demographic Profiling</span>
          </button>
          <button
            onClick={() => setActiveTab('correlations')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'correlations' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Social Correlations</span>
          </button>
          <button
            onClick={() => setActiveTab('temporal')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'temporal' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Temporal & Seasonal Waves</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Demographics */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Offender Age Group Breakdown */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-slate-800">Age Distribution Profile (Accused Registry)</h2>
            <p className="text-xs text-slate-400 mb-6">Offender ratios segmented across demographic groups</p>
            
            <div className="space-y-5">
              {ageData.map((item) => (
                <div key={item.bracket} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.bracket} Bracket</span>
                    <span>{item.count} accused ({item.pct}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-150 text-xs text-slate-500 leading-relaxed">
              <strong>Criminology Note:</strong> The 26-35 and 18-25 brackets combine for over 73% of offender entries. These are predominantly linked to cyber offenses, phishing trails, and identity frauds requiring immediate vocational intervention programs.
            </div>
          </div>

          {/* Socio-Economic Stress Breakdown */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Socio-Economic Distribution of Suspects</h2>
              <p className="text-xs text-slate-400 mb-6">Correlating suspect background indicators with primary crimes</p>
              
              <div className="space-y-4">
                {socioEconomicData.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                    <div className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                      {item.pct}% Ratio
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 text-xs text-rose-800 flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>
                <strong>Predictive Warning:</strong> Microeconomic indicators flag low-income pockets near industrial grids at higher risk of petty theft theft surges. Proactive community patrol recommendations sent to local supervisors.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Correlations */}
      {activeTab === 'correlations' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-slate-800">Socio-Environmental Correlation Matrices</h2>
            <p className="text-xs text-slate-400 mb-6">Statistically calculated Pearson coefficients correlating social stressors with specific crime clusters.</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {correlationData.map((c, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${c.color} flex flex-col justify-between space-y-3 shadow-sm`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-tight text-slate-700">{c.factor}</span>
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-white shadow-sm border border-slate-100">
                        Coeff: {c.coeff}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 font-medium">{c.desc}</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Strength: {c.type} Relation
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Indicators Map Insights */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Migration Trends</h3>
              <div className="mt-3 text-2xl font-extrabold text-slate-800">High Impact</div>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Districts like Mangaluru and Belagavi with high interstate floating population correlate with trans-border vehicle logistics theft networks.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urbanization Velocity</h3>
              <div className="mt-3 text-2xl font-extrabold text-indigo-600">+12.4% Annual</div>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Rapid conversion of rural borders in Bengaluru Outer Ring zones creates dense nodes of high-value construction site logistics vulnerability.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Economic Vulnerability</h3>
              <div className="mt-3 text-2xl font-extrabold text-rose-600">68/100 Stress Index</div>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Unemployed youth pockets display direct statistical correlation with drug sales and local street-level gambling network activations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Temporal & Seasonal */}
      {activeTab === 'temporal' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Seasonal Trend Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Seasonal Crime Index Wave (Annual Cycle)</h2>
                <p className="text-xs text-slate-400">Monthly crime density spikes mapped to festivals and monsoon seasons</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Monsoon Surge Spikes</span>
              </div>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible min-w-[500px]">
                <defs>
                  <linearGradient id="seasonalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* X and Y Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                  const yVal = pad + r * (h - pad * 2);
                  return (
                    <line
                      key={idx}
                      x1={pad}
                      y1={yVal}
                      x2={w - pad}
                      y2={yVal}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Shaded Area */}
                <path d={`${seasonalPath} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`} fill="url(#seasonalGradient)" />

                {/* Line Path */}
                <path d={seasonalPath} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />

                {/* Interactive Points */}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
                    <circle cx={p.x} cy={p.y} r="8" fill="#4F46E5" opacity="0" className="hover:opacity-10 transition-opacity" />
                    
                    {/* Month Label */}
                    <text x={p.x} y={h - 12} fontSize="9" fill="#94A3B8" textAnchor="middle" fontWeight="700">
                      {p.month}
                    </text>

                    {/* Hover tooltip card */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <rect
                        x={p.x - 70}
                        y={p.y - 45}
                        width="140"
                        height="35"
                        rx="8"
                        fill="#0F172A"
                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                      />
                      <text x={p.x} y={p.y - 32} fontSize="9" fill="#F8FAFC" textAnchor="middle" fontWeight="bold">
                        {p.event}
                      </text>
                      <text x={p.x} y={p.y - 20} fontSize="9" fill="#818CF8" textAnchor="middle" fontWeight="black">
                        Index: {p.value} Cases
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>
            
            <div className="mt-4 text-[10px] text-slate-400 font-bold flex gap-3 justify-center">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> English & Kannada Database Trends</span>
              <span>• Hover over dots to view seasonal crime triggers</span>
            </div>
          </div>

          {/* Modus Operandi Modality Spikes */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-slate-800">Seasonal Modus Operandi Triggers</h2>
            <p className="text-xs text-slate-400 mb-6">Seasonal activities driving crime modalities</p>

            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3">
                <div className="text-xs font-bold text-indigo-700">Monsoon Cyber Phishing Surge (June - Aug)</div>
                <p className="mt-1 text-[11px] text-slate-500 leading-normal font-semibold">
                  Coincides with high volume e-commerce monsoon sales. Suspects launch heavy SIM-swap phishing links.
                </p>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-3">
                <div className="text-xs font-bold text-rose-700">Festival Gold Smuggling Spike (Oct - Nov)</div>
                <p className="mt-1 text-[11px] text-slate-500 leading-normal font-semibold">
                  Gold purchases rise around Dussehra and Diwali. Transit pathways show spikes in theft of jewellery and smuggler movements.
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-3">
                <div className="text-xs font-bold text-amber-700">Summer Vacation House Burglary (May)</div>
                <p className="mt-1 text-[11px] text-slate-500 leading-normal font-semibold">
                  High frequency of families leaving residences unattended. Modus operandi shifts toward lock-breaking and digital surveillance evasion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
