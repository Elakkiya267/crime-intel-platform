import React, { useEffect, useState } from 'react';
import { api, Transaction } from '../../shared/api';
import { Landmark, TrendingDown, ShieldAlert, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function FinancialCrimesPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);

  const loadTransactions = () => {
    setLoading(true);
    api.getFinancialCrimes()
      .then(res => {
        setTxns(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTxns = showOnlyFlagged ? txns.filter(t => t.flagged) : txns;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Intelligence Hub</h1>
          <p className="mt-1 text-sm text-slate-500">Trace money trails, analyze Hawala routes, and audit transaction records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition ${
              showOnlyFlagged ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
            }`}
          >
            {showOnlyFlagged ? 'Show Flagged Transactions Only' : 'Filter Suspect Accounts'}
          </button>
          <button
            onClick={loadTransactions}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Interactive Money Flow Trail Map */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Active Laundering Flow Map</h2>
            <p className="text-xs text-slate-400">Visual mapping of illicit transfers linked to SIM Swap Case #KSP/2026/04431</p>
          </div>
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 animate-pulse" /> Hawala Leak Detected
          </span>
        </div>

        {/* Dynamic flow graphic */}
        <div className="relative overflow-auto py-6 flex justify-center bg-[#0F172A] rounded-2xl border border-slate-800">
          <svg width="780" height="200" className="overflow-visible select-none text-white">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
              </marker>
            </defs>

            {/* Victim Node */}
            <g transform="translate(40, 75)">
              <rect width="110" height="50" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <text x="55" y="22" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle">VICTIM NODE</text>
              <text x="55" y="38" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">S. K. Ranganathan</text>
            </g>

            {/* Hacker Node */}
            <g transform="translate(240, 75)">
              <rect width="120" height="50" rx="8" fill="#1E293B" stroke="#F43F5E" strokeWidth="2" />
              <text x="60" y="22" fill="#F43F5E" fontSize="9" fontWeight="extrabold" textAnchor="middle">CYBER HACKER</text>
              <text x="60" y="38" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">Karthik Gowda</text>
            </g>

            {/* Broker Node */}
            <g transform="translate(450, 75)">
              <rect width="120" height="50" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <text x="60" y="22" fill="#F59E0B" fontSize="9" fontWeight="bold" textAnchor="middle">HAWALA BROKER</text>
              <text x="60" y="38" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">Manjunath Swamy</text>
            </g>

            {/* Accomplices Nodes */}
            <g transform="translate(640, 25)">
              <rect width="110" height="46" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <text x="55" y="20" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">INSIDER ROLE</text>
              <text x="55" y="34" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">Raghavendra Hegde</text>
            </g>
            <g transform="translate(640, 125)">
              <rect width="110" height="46" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="55" y="20" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">LOGISTICS</text>
              <text x="55" y="34" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">Vikram D'Souza</text>
            </g>

            {/* Flow arrows */}
            {/* Victim -> Hacker */}
            <path d="M 150 100 L 232 100" fill="none" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="3 3" />
            <text x="190" y="90" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">₹15,00,000</text>

            {/* Hacker -> Broker */}
            <path d="M 360 100 L 442 100" fill="none" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="3 3" />
            <text x="405" y="90" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">₹5,00,000</text>

            {/* Broker -> Insider */}
            <path d="M 570 90 L 632 60" fill="none" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 3" />
            <text x="600" y="65" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle">₹3,50,000</text>

            {/* Broker -> Logistics */}
            <path d="M 570 110 L 632 140" fill="none" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 3" />
            <text x="600" y="140" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle">₹1,20,000</text>
          </svg>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-b">Audit ledger</h2>
          <div className="overflow-auto mt-3">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Sender account node</th>
                  <th className="px-6 py-3.5">Recipient account node</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Audit Risk Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredTxns.map((t) => (
                  <tr key={t.id} className={t.flagged ? 'bg-rose-50/30 hover:bg-rose-50/50' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Landmark className={`h-4 w-4 ${t.flagged ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span>{t.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{t.sourceAccount}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{t.destAccount}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">₹{t.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{t.date}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-xl bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-semibold">{t.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.flagged ? (
                        <span className="text-xs text-rose-700 font-bold flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                          <span>{t.notes}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">{t.notes || 'Normal transfer profile.'}</span>
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
