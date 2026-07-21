import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Video, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Evidence } from '../../../../shared/api';

interface EvidencePanelProps {
  evidence: Evidence[];
}

export default function EvidencePanel({ evidence }: EvidencePanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('mp4')) {
      return <Video className="h-4 w-4" />;
    } else if (t.includes('image') || t.includes('jpg') || t.includes('png')) {
      return <ImageIcon className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
        <div>
          <div className="text-sm font-semibold text-slate-800">Secured Evidence ({evidence.length})</div>
          <div className="text-xs text-slate-500">Integrity check logs & chain of custody</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {evidence.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No digital evidence uploaded yet. Use the Intake form to attach items.
          </div>
        ) : (
          evidence.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-[#E2E8F0] bg-white transition-all hover:border-primary-200">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 rounded-lg bg-primary-50 p-2 text-primary-700">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.type} • {item.uploadedDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5">
                      <ShieldCheck className="h-2.5 w-2.5" /> Checked
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-[#FAFAFA] p-3 text-xs space-y-2 rounded-b-xl">
                    <div>
                      <span className="font-bold text-slate-500">Hash ID:</span>
                      <code className="ml-1 select-all bg-white px-1.5 py-0.5 border rounded text-rose-600 block truncate font-mono text-[10px]">
                        {item.hash}
                      </code>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Custodian Officer:</span>
                      <span className="ml-1 text-slate-700">{item.uploadedBy}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 block">Chain of Custody:</span>
                      <div className="space-y-1 pl-2 border-l-2 border-primary-100">
                        {item.chainOfCustody.map((step: string, idx: number) => (
                          <div key={idx} className="text-[10px] text-slate-600 leading-normal">
                            • {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
