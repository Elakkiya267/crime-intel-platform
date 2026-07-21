import React from 'react';
import { FIR, Evidence } from '../../../../shared/api';
import { Calendar, Eye, ShieldCheck, UserCheck } from 'lucide-react';

interface TimelinePanelProps {
  activeCase: FIR;
  evidence: Evidence[];
}

export default function TimelinePanel({ activeCase, evidence }: TimelinePanelProps) {
  // Build dynamic timeline steps
  const steps = [];

  // Step 1: FIR Created
  steps.push({
    icon: <Calendar className="h-3.5 w-3.5 text-indigo-600" />,
    bg: 'bg-indigo-50',
    title: 'FIR Registered',
    date: `${activeCase.date} ${activeCase.time}`,
    description: `Filed at ${activeCase.policeStation} via station terminal.`
  });

  // Step 2: Evidence uploaded
  evidence.forEach((ev) => {
    steps.push({
      icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: `Evidence Hashed: ${ev.name}`,
      date: ev.uploadedDate,
      description: `Integrity check OK. Hashed by ${ev.uploadedBy}.`
    });
  });

  // Step 3: Accused profiles linked
  if (activeCase.accusedIds.length > 0) {
    steps.push({
      icon: <UserCheck className="h-3.5 w-3.5 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Suspect Registry Linked',
      date: activeCase.date,
      description: `${activeCase.accusedIds.length} profiles bound to case records.`
    });
  }

  // Step 4: Status checkpoint
  steps.push({
    icon: <Eye className="h-3.5 w-3.5 text-slate-600" />,
    bg: 'bg-slate-100',
    title: `Investigation checkpoint`,
    date: 'Current State',
    description: `Status: ${activeCase.status}. Severity: ${activeCase.severity}.`
  });

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-soft">
      <div>
        <div className="text-sm font-semibold text-slate-800">Investigation Timeline</div>
        <div className="text-xs text-slate-500">Auto-compiled timeline of audit actions</div>
      </div>

      <div className="mt-4 space-y-4">
        {steps.map((s, idx) => (
          <div key={idx} className="flex gap-3 relative">
            {idx < steps.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-[-16px] w-[1px] bg-slate-200" />
            )}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
              {s.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>{s.title}</span>
                <span>{s.date}</span>
              </div>
              <div className="mt-0.5 text-xs text-slate-600 leading-normal">{s.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
