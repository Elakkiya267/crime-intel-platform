import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  UserRound,
  BarChart3,
  Video,
  Settings,
  HelpCircle,
  User,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

type NavItem = { to: string; label: string; icon: React.ReactNode };

interface LeftSidebarProps {
  onCloseMobile?: () => void;
}

export default function LeftSidebar({ onCloseMobile }: LeftSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { to: '/chat', label: 'AI Copilot Chat', icon: <MessageSquare className="h-4 w-4" /> },
      { to: '/cases', label: 'Cases & FIRs', icon: <FileText className="h-4 w-4" /> },
      { to: '/accused', label: 'Suspect Directory', icon: <UserRound className="h-4 w-4" /> },
      { to: '/analytics', label: 'Threat Analytics', icon: <BarChart3 className="h-4 w-4" /> },
      { to: '/evidence', label: 'Evidence Vault', icon: <Video className="h-4 w-4" /> },
      { to: '/reports', label: 'Dossier Reports', icon: <FileText className="h-4 w-4" /> },
      { to: '/profile', label: 'Officer Profile', icon: <User className="h-4 w-4" /> },
      { to: '/settings', label: 'Security & RBAC', icon: <Settings className="h-4 w-4" /> },
      { to: '/help', label: 'Help Center', icon: <HelpCircle className="h-4 w-4" /> },
    ],
    []
  );

  return (
    <aside
      className={
        'relative flex h-full flex-col border-r border-[#E2E8F0] bg-white transition-[width] duration-200 shadow-lg md:shadow-none ' +
        (collapsed ? 'w-[72px]' : 'w-[260px]')
      }
    >
      <div className="flex h-[64px] items-center justify-between px-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#E2E8F0] bg-white shadow-sm shrink-0">
            <img src="./logo.jpg" alt="KSP Logo" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-800">KSP Intelligence</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Copilot</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="hidden md:flex rounded-lg p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <span className="text-xs font-bold">{collapsed ? '→' : '←'}</span>
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="flex md:hidden rounded-lg p-1.5 hover:bg-slate-50 text-slate-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-auto px-2 py-3">
        <div className="space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ' +
                (isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
              }
            >
              <div className="text-slate-500 group-[.active]:text-primary-700">{it.icon}</div>
              {!collapsed && <span className="truncate">{it.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
