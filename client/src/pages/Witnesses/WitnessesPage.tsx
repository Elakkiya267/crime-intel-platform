import React, { useEffect, useState } from 'react';
import { api, Witness } from '../../shared/api';
import { FileText, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WitnessesPage() {
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWitnesses()
      .then(res => {
        setWitnesses(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching witnesses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Witness Statements</h1>
        <p className="mt-1 text-sm text-slate-500">Access registered witnesses and transcript of statements for case filings</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {witnesses.map((w) => (
            <div key={w.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-soft hover:shadow-medium transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{w.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-slate-400 text-xs font-semibold">
                      <Phone className="h-3 w-3" />
                      <span>{w.contact}</span>
                    </div>
                  </div>
                  <Link
                    to={`/cases?caseId=${w.caseId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Case: {w.caseId}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-[#E2E8F0] text-slate-600 text-xs leading-relaxed flex gap-2.5">
                  <MessageSquare className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                  <p>"{w.statement}"</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-right">
                Digitally Authenticated
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
