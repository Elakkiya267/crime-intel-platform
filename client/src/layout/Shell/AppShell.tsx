import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import LeftSidebar from './LeftSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import RightInvestigationPanel from './RightInvestigationPanel/RightInvestigationPanel';

export default function AppShell() {
  const location = useLocation();
  const showRightPanel = ['/', '/dashboard', '/cases'].includes(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'KN'>('EN');

  const toggleLang = () => {
    const nextLang = lang === 'EN' ? 'KN' : 'EN';
    setLang(nextLang);
    localStorage.setItem('ksp-lang', nextLang);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      <div className="flex h-full w-full relative">
        {/* Desktop Sidebar & Mobile Drawer */}
        <div className={`fixed inset-y-0 left-0 z-50 md:relative md:z-auto transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <LeftSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
        </div>

        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            currentLang={lang}
            onToggleLang={toggleLang}
          />
          <main className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-auto">
              <Outlet context={{ lang }} />
            </div>
            {showRightPanel && (
              <div className="hidden w-[360px] border-l border-[#E2E8F0] bg-white xl:block">
                <RightInvestigationPanel />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
