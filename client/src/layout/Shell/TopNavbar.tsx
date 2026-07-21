import React from 'react';
import { Bell, Moon, Sun, Search, Mic, Globe, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopNavbar() {
  const username = localStorage.getItem('ksp-user-name') || 'KSP Officer';
  const role = localStorage.getItem('ksp-user-role') || 'Investigator';

  const handleLogout = () => {
    localStorage.removeItem('ksp-token');
    localStorage.removeItem('ksp-user-role');
    localStorage.removeItem('ksp-user-name');
    window.location.hash = '#/login';
    window.location.reload();
  };

  const [darkMode, setDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="flex h-[56px] items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="w-[300px] max-w-[40vw] rounded-xl border border-[#E2E8F0] bg-slate-50/50 px-3 py-1.5 text-xs outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
          placeholder="Global Case Lookup..."
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 transition" title="Voice Search">
          <Mic className="h-4 w-4" />
        </button>
        <button className="flex h-9 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition" title="Language">
          <Globe className="h-4 w-4" />
          <span>English / Kannada</span>
        </button>
        <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 transition" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary-600" />
        </Link>
        <button 
          onClick={toggleTheme} 
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 transition" 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
        </button>

        <Link to="/profile" className="ml-1 hidden h-9 items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3 lg:flex hover:bg-slate-50 transition shadow-sm">
          <div className="h-6 w-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-[10px] font-extrabold text-primary-700 select-none uppercase shrink-0">
            {username.charAt(0)}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-black uppercase tracking-wider text-primary-600">{role}</span>
            <span className="mt-0.5 text-xs font-bold text-slate-800">{username}</span>
          </div>
        </Link>

        <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white hover:bg-rose-50 hover:text-rose-600 transition" title="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

