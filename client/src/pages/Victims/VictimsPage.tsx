import React, { useEffect, useState } from 'react';
import { api, Victim } from '../../shared/api';
import { Users, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VictimsPage() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVictims()
      .then(res => {
        setVictims(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching victims:', err);
        setLoading(false);
      });
  }, []);

  // Calculate some simple demographics for the summary card
  const femaleCount = victims.filter(v => v.gender === 'Female').length;
  const maleCount = victims.filter(v => v.gender === 'Male').length;
  const avgAge = victims.length > 0 ? Math.round(victims.reduce((acc, curr) => acc + (curr.age || 0), 0) / victims.length) : 0;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Victims Directory</h1>
        <p className="mt-1 text-sm text-slate-500">Analyze victim demographic attributes and support services tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Logged Victims</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-800">{victims.length}</div>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Gender Distribution</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-800">
            {femaleCount} F / {maleCount} M
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <div className="text-xs font-bold text-slate-400 uppercase">Average Age Group</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-800">{avgAge} yrs</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Victim Reference</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Demographics</th>
                  <th className="px-6 py-3.5">Social/Economic Context</th>
                  <th className="px-6 py-3.5">Registered Address</th>
                  <th className="px-6 py-3.5">Linked Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-slate-700">
                {victims.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{v.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{v.name}</td>
                    <td className="px-6 py-4">
                      {v.age} years • {v.gender}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{v.socioEconomic}</div>
                      <div className="text-xs text-slate-400">Education: {v.education}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{v.address}</td>
                    <td className="px-6 py-4">
                      {v.caseId ? (
                        <Link
                          to={`/cases?caseId=${v.caseId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {v.caseId}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">No linked case</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
