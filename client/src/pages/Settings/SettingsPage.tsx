import React, { useEffect, useState } from 'react';
import { api, AuditLog } from '../../shared/api';
import { ShieldCheck, UserCheck, Lock, RefreshCw, AlertTriangle, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [role, setRole] = useState<string>('investigator');
  const [username, setUsername] = useState<string>('officer_kumar');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load active user session from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('ksp-user-role') || 'investigator';
    const savedUsername = localStorage.getItem('ksp-user-name') || 'KSP Officer';
    setRole(savedRole);
    setUsername(savedUsername);

    if (savedRole === 'supervisor') {
      loadLogs();
    }
  }, []);

  const loadLogs = () => {
    setLoadingLogs(true);
    api.getAuditLogs()
      .then(res => {
        setAuditLogs(res);
        setLoadingLogs(false);
      })
      .catch(err => {
        console.error('Error fetching audit logs:', err);
        setLoadingLogs(false);
      });
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      const savedUsername = localStorage.getItem('ksp-user-name') || 'KSP Officer';
      const result = await api.updateProfile({
        name: savedUsername,
        role: newRole
      });
      if (result.success) {
        setRole(newRole);
        localStorage.setItem('ksp-user-role', newRole);
        localStorage.setItem('ksp-token', result.token);
        
        if (newRole === 'supervisor') {
          loadLogs();
        } else {
          setAuditLogs([]);
        }
      }
    } catch (err) {
      console.error('Failed to update operator role:', err);
    }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Security & Governance Portal</h1>
        <p className="mt-1 text-sm text-slate-500">Configure role-based access controls and audit trace logs</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RBAC Configurator Card */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-soft space-y-5 h-fit">
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-b">Role-Based Access (RBAC)</h2>
          
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-[#FAFAFA] p-3 text-xs flex gap-2">
              <UserCheck className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500">Active Operator Session:</span>
                <div className="font-bold text-slate-800 mt-0.5">{username}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{role} role</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modify Operator Persona</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleRoleChange('investigator')}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition-all text-left ${
                    role === 'investigator'
                      ? 'border-indigo-200 bg-indigo-50/40 text-slate-800'
                      : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    role === 'investigator' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    INV
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans">Investigator Role</h4>
                    <p className="text-[10px] opacity-75 mt-0.5">Read case registry, file FIRs, search AI chat.</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('supervisor')}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition-all text-left ${
                    role === 'supervisor'
                      ? 'border-indigo-200 bg-indigo-50/40 text-slate-800'
                      : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    role === 'supervisor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    SUP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans">Supervisor Role</h4>
                    <p className="text-[10px] opacity-75 mt-0.5">All access, view cryptographic audit trail, export logs.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Audit Trail Card */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-soft flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Governance Audit Trail</h2>
                <p className="text-xs text-slate-400">Cryptographic audit log tracing queries, updates, and accesses</p>
              </div>
              {role === 'supervisor' && (
                <button
                  onClick={loadLogs}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>

            {role !== 'supervisor' ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 my-auto h-64 border border-dashed rounded-2xl bg-slate-50/50">
                <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Audit Trail Access Restricted</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                    Viewing the state forensic audit log is restricted to operators with Supervisor credentials. Swap your active persona to Supervisor to inspect logs.
                  </p>
                </div>
              </div>
            ) : loadingLogs ? (
              <div className="flex justify-center p-12 my-auto">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 rounded-2xl border border-slate-100 bg-[#FAFAFA] text-xs">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-600 font-bold uppercase text-[10px]">
                      {log.role.substring(0, 3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>{log.user} ({log.ip})</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="mt-1 text-slate-700 font-semibold">{log.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-xs text-amber-800 flex gap-2">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Compliance Notice:</strong> This audit trail compiles queries and case accesses. Deletion or modifications of these logs is barred by KSP Governance Policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
