import React, { useState } from 'react';
import { FileText, Download, Filter, Settings, Award, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('cyber');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data matching selected template
  const templatesData: Record<string, { title: string; category: string; description: string; kpis: Array<{ name: string; val: string }>; rows: Array<any> }> = {
    cyber: {
      title: 'Weekly Cyber Threat Alert Dossier',
      category: 'Cyber Crime Division',
      description: 'Weekly review of phishing trends, SIM swap vectors, and associated cybercrime hubs.',
      kpis: [
        { name: 'Total Incidents', val: '24' },
        { name: 'Phishing Clusters', val: '5' },
        { name: 'Active SIM-swappers', val: '4' },
        { name: 'Est. Leak Amount', val: '₹14,50,000' }
      ],
      rows: [
        { caseId: 'KSP/2026/04431', title: 'SIM swap deactivation phishing', date: '2026-07-09', location: 'Indiranagar', status: 'Open' },
        { caseId: 'KSP/2026/04435', title: 'Identity fraud via forged adhaar', date: '2026-07-11', location: 'Whitefield', status: 'Pending' },
        { caseId: 'KSP/2026/04442', title: 'Phishing portal redirection scam', date: '2026-07-13', location: 'Malleshwaram', status: 'Solved' }
      ]
    },
    offender: {
      title: 'Monthly Repeat Offender Threat Profile Summary',
      category: 'Criminology Intelligence Unit',
      description: 'Monthly summary tracking repeat criminals with 2+ prior arrests and high risk scores.',
      kpis: [
        { name: 'Monitored Accused', val: '6' },
        { name: 'Average Risk Score', val: '72%' },
        { name: 'Recent Violations', val: '3' },
        { name: 'Prior Arrests Combined', val: '18' }
      ],
      rows: [
        { suspectId: 'A-1204', name: 'Manjunath Swamy', risk: '78%', priors: '3', primaryMo: 'Phishing & SIM swap', status: 'Active Watch' },
        { suspectId: 'A-1205', name: 'Karthik Gowda', risk: '62%', priors: '2', primaryMo: 'Forgery & Cheating', status: 'Under Surveillance' },
        { suspectId: 'A-1207', name: 'Raghavendra Hegde', risk: '84%', priors: '4', primaryMo: 'Land grabbing extortion', status: 'Arrest Warrant Issued' }
      ]
    },
    hotspots: {
      title: 'Indiranagar High-Density Hotspots Brief',
      category: 'Proactive Policing division',
      description: 'Tactical deployment advisory mapping spatial densities and recommendation algorithms.',
      kpis: [
        { name: 'Identified Hotspots', val: '4' },
        { name: 'High Risk Zones', val: '2' },
        { name: 'Patrol Dispatch Recommended', val: '3' },
        { name: 'Est. Patrol Hours/Week', val: '42' }
      ],
      rows: [
        { zoneId: 'H-901', area: 'Indiranagar Sector 4', risk: 'High', primaryCrime: 'Cyber Phishing Hub', recommendation: 'Increase evening cruiser coverage' },
        { zoneId: 'H-902', area: 'Whitefield Commercial Loop', risk: 'Medium', primaryCrime: 'Retail Forgery', recommendation: 'Liaison with bank branch safety units' },
        { zoneId: 'H-903', area: 'Malleshwaram Junction', risk: 'High', primaryCrime: 'Transit Theft', recommendation: 'Deploy foot patrols near metro' }
      ]
    }
  };

  const currentReport = templatesData[selectedTemplate];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 1000);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the report.');
      return;
    }

    const username = localStorage.getItem('ksp-user-name') || 'KSP Officer';
    const role = localStorage.getItem('ksp-user-role') || 'Investigator';

    const htmlContent = `
      <html>
        <head>
          <title>${currentReport.title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1E293B; background: #FFF; }
            .header { text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: #0F172A; }
            .header p { margin: 5px 0 0 0; font-size: 12px; color: #64748B; font-weight: 600; }
            .classification { color: #DC2626; font-weight: bold; font-size: 11px; text-align: center; margin-bottom: 20px; letter-spacing: 1.5px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 25px; font-size: 11px; }
            .meta-item { display: flex; justify-content: justify; }
            .meta-label { font-weight: bold; color: #64748B; margin-right: 10px; width: 120px; }
            .kpis { display: flex; gap: 15px; margin-bottom: 30px; }
            .kpi-card { flex: 1; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; background: #FFF; text-align: center; }
            .kpi-title { font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase; margin-bottom: 5px; }
            .kpi-val { font-size: 18px; font-weight: 900; color: #0F172A; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #0F172A; color: #FFF; text-align: left; padding: 10px; font-weight: 600; }
            td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
            .footer { border-top: 1px solid #E2E8F0; font-size: 10px; text-align: center; color: #94A3B8; padding-top: 15px; margin-top: 50px; }
            .sign { margin-top: 40px; text-align: right; font-size: 11px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="classification">CONFIDENTIAL // LAW ENFORCEMENT INTERNAL RECORD</div>
          <div class="header">
            <h1>KARNATAKA STATE POLICE</h1>
            <p>${currentReport.category} • Command intelligence Report</p>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Report Title:</span> <span>${currentReport.title}</span></div>
            <div class="meta-item"><span class="meta-label">Date Generated:</span> <span>${new Date().toLocaleString()}</span></div>
            <div class="meta-item"><span class="meta-label">Operator:</span> <span>${username} (${role.toUpperCase()})</span></div>
            <div class="meta-item"><span class="meta-label">District Scope:</span> <span>${districtFilter} Divisions</span></div>
          </div>
          <div class="kpis">
            ${currentReport.kpis.map(k => `
              <div class="kpi-card">
                <div class="kpi-title">${k.name}</div>
                <div class="kpi-val">${k.val}</div>
              </div>
            `).join('')}
          </div>
          <h3>Incident / suspect Ledger</h3>
          <table>
            <thead>
              <tr>
                ${Object.keys(currentReport.rows[0]).map(k => `<th style="text-transform: capitalize;">${k}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${currentReport.rows.map(row => `
                <tr>
                  ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="sign">
            Digital Cryptographic Signature Verification: KSP-AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}<br/>
            Approved by: Superintendent KSP Cyber Cell
          </div>
          <div class="footer">
            CONFIDENTIAL - Preserved under Secure Audit governance. Cryptographic logs active.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadCSV = () => {
    alert('CSV Export: Cryptographic Audit Ledger generated and downloaded locally to secure cache.');
  };

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans">Crime intelligence Report Dossier</h1>
          <p className="text-sm text-slate-500 font-medium">
            Generate and export official crime reports, repeat offender audits, and spatial hotspot briefs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Parameters Form */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft h-fit space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="h-4.5 w-4.5 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800">Report Parameters</h2>
          </div>

          {/* Template Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Report Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                setReportGenerated(false);
              }}
              className="w-full text-xs font-semibold p-3.5 rounded-xl border border-[#E2E8F0] bg-white outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="cyber">Weekly Cyber Threat Dossier</option>
              <option value="offender">Monthly Repeat Offender Profiles</option>
              <option value="hotspots">Indiranagar Hotspots Patrol Advisory</option>
            </select>
          </div>

          {/* District Scope */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">District scope</label>
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setReportGenerated(false);
              }}
              className="w-full text-xs font-semibold p-3.5 rounded-xl border border-[#E2E8F0] bg-white outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Karnataka State Districts</option>
              <option value="Bengaluru">Bengaluru Urban</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Mangaluru">Mangaluru</option>
            </select>
          </div>

          {/* Date range selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date Range Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                defaultValue="2026-07-01"
                className="text-[11px] font-bold p-2.5 rounded-xl border border-[#E2E8F0] bg-white outline-none"
              />
              <input
                type="date"
                defaultValue="2026-07-16"
                className="text-[11px] font-bold p-2.5 rounded-xl border border-[#E2E8F0] bg-white outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <FileText className="h-4.5 w-4.5" />
            {isGenerating ? 'Compiling Ledger...' : 'Compile intelligence Report'}
          </button>
        </div>

        {/* Right Side: Report Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft min-h-[400px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Confidential Dossier Preview</span>
              </div>
              {reportGenerated && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintPDF}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl px-3 py-1.5 text-xs font-bold transition border border-indigo-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold transition border border-slate-200"
                  >
                    <span>Export CSV</span>
                  </button>
                </div>
              )}
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                <span className="text-xs font-bold text-slate-400">Hashing ledger records and compiling graphs...</span>
              </div>
            ) : reportGenerated ? (
              <div className="space-y-6">
                {/* Title block */}
                <div>
                  <h2 className="text-base font-bold text-slate-800">{currentReport.title}</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">{currentReport.description}</p>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentReport.kpis.map((kpi, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{kpi.name}</div>
                      <div className="text-base font-extrabold text-slate-800 mt-1">{kpi.val}</div>
                    </div>
                  ))}
                </div>

                {/* Data preview table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                      <tr>
                        {Object.keys(currentReport.rows[0]).map((key) => (
                          <th key={key} className="p-3 select-none">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentReport.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          {Object.values(row).map((val: any, colIdx) => (
                            <td key={colIdx} className="p-3 font-semibold text-slate-700">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center text-slate-400 space-y-2">
                <FileText className="h-10 w-10 opacity-30" />
                <div className="text-xs font-bold">No report compiled yet</div>
                <p className="text-[10px] max-w-[240px] leading-relaxed">
                  Configure the parameters on the left and select "Compile" to generate the tactical dossier ledger.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 border border-slate-100 text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>Security Classification: CONFIDENTIAL</span>
            <span>Trace ID: KSP-AUDIT-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
