import React from 'react';
import { Shield, AlertTriangle, User, FileText } from 'lucide-react';

interface Activity {
  id: string;
  time: string;
  type: string;
  message: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case 'evidence':
        return <Shield className="h-4 w-4 text-emerald-600" />;
      case 'suspect':
        return <User className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-rose-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'case':
        return 'bg-indigo-50';
      case 'evidence':
        return 'bg-emerald-50';
      case 'suspect':
        return 'bg-amber-50';
      default:
        return 'bg-rose-50';
    }
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
        <div className="text-sm font-semibold text-slate-800">Live Activity Feed</div>
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
      </div>
      <div className="mt-4 space-y-4">
        {activities.map((f) => (
          <div key={f.id} className="flex gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getBg(f.type)}`}>
              {getIcon(f.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-slate-400">{f.time}</div>
              <div className="mt-0.5 text-sm leading-relaxed text-slate-700">{f.message}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

