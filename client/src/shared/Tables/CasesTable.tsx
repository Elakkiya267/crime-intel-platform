import React from 'react';

const rows = [
  { id: 'KSP/2026/04431', district: 'Bengaluru Urban', type: 'Cyber Crime', status: 'Open' },
  { id: 'KSP/2026/04108', district: 'Mysuru', type: 'Women Safety', status: 'Pending Investigation' },
  { id: 'KSP/2026/03977', district: 'Mangaluru', type: 'Financial Crimes', status: 'Solved' },
];

export default function CasesTable() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold text-slate-500">
              <th className="px-3 py-2">FIR / Case ID</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Crime Type</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#E2E8F0]">
                <td className="px-3 py-3 font-semibold text-slate-800">{r.id}</td>
                <td className="px-3 py-3 text-slate-700">{r.district}</td>
                <td className="px-3 py-3 text-slate-700">{r.type}</td>
                <td className="px-3 py-3">
                  <span
                    className={
                      'rounded-xl px-3 py-1 text-xs font-semibold ' +
                      (r.status === 'Solved'
                        ? 'bg-green-50 text-green-700'
                        : r.status === 'Open'
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-amber-50 text-amber-700')
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-slate-500">Clicking a case should populate the right investigation panel (wired later).</div>
    </div>
  );
}

