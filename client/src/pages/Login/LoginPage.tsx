import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, Users, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../shared/api';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('investigator');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.toLowerCase().endsWith('@ksp.gov.in')) {
      setError('Access unauthorized. Only official emails ending with @ksp.gov.in are allowed to log in or register.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all fields.');
        }
        const data = await api.signup({ email, password, name, role });
        localStorage.setItem('ksp-token', data.token);
        localStorage.setItem('ksp-user-role', data.user.role);
        localStorage.setItem('ksp-user-name', data.user.name);
      } else {
        if (!email || !password) {
          throw new Error('Please fill in all fields.');
        }
        const data = await api.login({ email, password });
        localStorage.setItem('ksp-token', data.token);
        localStorage.setItem('ksp-user-role', data.user.role);
        localStorage.setItem('ksp-user-name', data.user.name);
      }
      
      // Redirect within HashRouter
      window.location.hash = '#/';
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Make sure your credentials are correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-soft space-y-6">
        {/* Title logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#E2E8F0] bg-white shadow-sm shrink-0">
            <img src="/logo.jpg" alt="KSP Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">KSP Intelligence Portal</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">State Security Command Cell</div>
          </div>
        </div>

        {/* Form header */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">{isSignUp ? 'Register New Officer' : 'Officer Authentication'}</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            {isSignUp ? 'Create new role-based investigator profile' : 'Sign in to access state crime intelligence ledger'}
          </p>
        </div>

        {/* Error alert banner */}
        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-800 flex gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Credentials form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officer Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="e.g. Officer Kumar"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="name@ksp.gov.in"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Role Classification</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <Users className="h-4 w-4" />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="investigator">Investigator (INV)</option>
                  <option value="analyst">Analyst (ANL)</option>
                  <option value="supervisor">Supervisor (SUP)</option>
                  <option value="policymaker">Superintendent / Policy Maker</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 text-xs font-bold shadow-soft transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Officer Profile' : 'Authenticate Session'}
          </button>
        </form>

        {/* Toggle options */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs font-bold text-primary-600 hover:underline"
          >
            {isSignUp ? 'Already registered? Sign in here' : 'New Officer registration request'}
          </button>
        </div>

        {/* Demo hints */}
        <div className="rounded-xl border border-indigo-50 bg-indigo-50/20 p-3.5 text-[11px] text-slate-500 leading-normal font-semibold space-y-1">
          <div className="flex items-center gap-1 text-indigo-700 font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MongoDB Seeding Active</span>
          </div>
          <div>For instant testing, use seed account credentials:</div>
          <div>• **Investigator:** <code>investigator@ksp.gov.in</code> / <code>investigator123</code></div>
          <div>• **Supervisor:** <code>supervisor@ksp.gov.in</code> / <code>supervisor123</code></div>
        </div>
      </div>
    </div>
  );
}
