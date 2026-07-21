import React from 'react';
import TopNavbar from './TopNavbar';
import LeftSidebar from './LeftSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import RightInvestigationPanel from './RightInvestigationPanel/RightInvestigationPanel';

export default function AppShell() {
  const location = useLocation();
  const showRightPanel = ['/', '/dashboard', '/cases'].includes(location.pathname);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      <div className="flex h-full w-full">
        <LeftSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />
          <main className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-auto">
              <Outlet />
            </div>
            {showRightPanel && (
              <div className="hidden w-[360px] border-l border-[#E2E8F0] bg-white lg:block">
                <RightInvestigationPanel />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

