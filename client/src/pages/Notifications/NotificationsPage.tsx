import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Bell, CheckCircle2, ShieldAlert, Zap, Globe } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  division: string;
  actionRequired?: string;
  actionTaken?: boolean;
}

export default function NotificationsPage() {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [alerts, setAlerts] = useState<NotificationItem[]>([
    {
      id: 'N-301',
      title: 'Critical Threat Alert: SIM-Swap Scams Active in Indiranagar',
      message: 'Predictive forecasting flags sudden increase in cell deactivation requests near Sector 4 commercial grid. Suspect patterns correlate with repeat offenders.',
      timestamp: '5 mins ago',
      severity: 'critical',
      division: 'Cyber Crime Unit',
      actionRequired: 'Deploy Patrol Warning Alerts',
      actionTaken: false,
    },
    {
      id: 'N-302',
      title: 'Suspicious Transaction Flagged: RTGS Bypass',
      message: 'NEFT transfer of ₹8,00,000 (TXN-9085) initiated to recipient account linked with A-1204 (Manjunath Swamy). Immediate freeze recommended.',
      timestamp: '45 mins ago',
      severity: 'critical',
      division: 'Financial Intelligence',
      actionRequired: 'Freeze Associated Bank Accounts',
      actionTaken: false,
    },
    {
      id: 'N-303',
      title: 'Repeat Offender Surveillance Alert',
      message: 'Accused A-1207 (Raghavendra Hegde) has been flagged with an active land-grabbing warrant. Pre-emptive monitoring is requested.',
      timestamp: '2 hours ago',
      severity: 'warning',
      division: 'Criminology Intelligence',
      actionRequired: 'Update Watchlist Log',
      actionTaken: false,
    },
    {
      id: 'N-304',
      title: 'CCTV Chain of Custody Uploaded',
      message: 'New CCTV evidence file uploaded for case KSP/2026/04431. Cryptographic hashes logged and signed securely by Officer Patel.',
      timestamp: '4 hours ago',
      severity: 'info',
      division: 'Digital Custody Vault',
      actionTaken: false,
    },
    {
      id: 'N-305',
      title: 'Monthly Analytics Model Completed',
      message: 'Socio-demographic correlation indicators refreshed. Urbanization vs. Cyber crime density Pearson coefficient stands at +0.84.',
      timestamp: '1 day ago',
      severity: 'info',
      division: 'Command Analytics Core',
      actionTaken: false,
    },
  ]);

  const handleAction = (id: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, actionTaken: true } : alert))
    );
  };

  const filteredAlerts = filterSeverity === 'all'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary-600" />
            <span>Early Warning & Active Alert Board</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Real-time proactive security warnings, repeat offender flags, and critical financial crime alerts.
          </p>
        </div>

        {/* Severity filter tabs */}
        <div className="rounded-2xl border border-slate-200 p-1 flex bg-white self-start md:self-auto shadow-sm">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'all' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'critical' ? 'bg-rose-600 text-white shadow-soft' : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Critical ({alerts.filter(a => a.severity === 'critical').length})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'warning' ? 'bg-amber-600 text-white shadow-soft' : 'text-amber-600 hover:bg-amber-50'
            }`}
          >
            Warning ({alerts.filter(a => a.severity === 'warning').length})
          </button>
          <button
            onClick={() => setFilterSeverity('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterSeverity === 'info' ? 'bg-indigo-600 text-white shadow-soft' : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Info ({alerts.filter(a => a.severity === 'info').length})
          </button>
        </div>
      </div>

      {/* Main Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const cardStyles = {
              critical: 'border-rose-100 bg-rose-50/20 hover:bg-rose-50/30',
              warning: 'border-amber-100 bg-amber-50/20 hover:bg-amber-50/30',
              info: 'border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/30',
            }[alert.severity];

            const badgeStyles = {
              critical: 'bg-rose-100 text-rose-700',
              warning: 'bg-amber-100 text-amber-700',
              info: 'bg-indigo-100 text-indigo-700',
            }[alert.severity];

            const icon = {
              critical: <ShieldAlert className="h-5 w-5 text-rose-600" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
              info: <Info className="h-5 w-5 text-indigo-600" />,
            }[alert.severity];

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition duration-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${cardStyles}`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className="mt-1 shrink-0">{icon}</div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${badgeStyles}`}>
                        {alert.severity} • {alert.division}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{alert.timestamp}</span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 leading-snug">{alert.title}</h2>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">{alert.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 self-end md:self-center">
                  {alert.actionRequired ? (
                    alert.actionTaken ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold py-2 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Action Acknowledged</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAction(alert.id)}
                        className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2 px-4 text-xs font-bold shadow-soft transition flex items-center gap-1.5"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>{alert.actionRequired}</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleAction(alert.id)}
                      disabled={alert.actionTaken}
                      className={`rounded-xl py-2 px-4 text-xs font-bold border transition ${
                        alert.actionTaken
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {alert.actionTaken ? 'Acknowledged' : 'Dismiss Alert'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-20 text-center text-slate-400 bg-white">
            <Bell className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <div className="text-xs font-bold">No warnings in this category</div>
            <p className="text-[10px] mt-1">There are currently no active intelligence updates matching the filter.</p>
          </div>
        )}
      </div>

      {/* early warning status summary */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Threat Forecasting Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Critical Threats Active</div>
              <div className="text-lg font-black text-rose-600 mt-0.5">2 Active Alerts</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <Zap className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Action Pending Cases</div>
              <div className="text-lg font-black text-amber-600 mt-0.5">3 Cases Requires Officer Signature</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <Globe className="h-6 w-6 text-indigo-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Governance Cryptographic Auditing</div>
              <div className="text-lg font-black text-indigo-600 mt-0.5">100% Traceable Logs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
