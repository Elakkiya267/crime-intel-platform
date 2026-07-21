import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { Shield, User, Mail, Phone, Briefcase, FileText, Edit2, Save, X, CheckCircle, AlertCircle, Bookmark } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('investigator');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [designation, setDesignation] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setName(data.name);
      setRole(data.role);
      setBadgeNumber(data.badgeNumber || '');
      setDepartment(data.department || '');
      setPhoneNumber(data.phoneNumber || '');
      setDesignation(data.designation || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load officer profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Officer name is required.');
      return;
    }

    try {
      const result = await api.updateProfile({
        name,
        role,
        badgeNumber,
        department,
        phoneNumber,
        designation,
      });

      if (result.success) {
        setProfile(result.user);
        setIsEditing(false);
        setSuccess('Officer profile details updated successfully.');
        
        // Sync local storage so navbar/settings update instantly
        localStorage.setItem('ksp-user-name', result.user.name);
        localStorage.setItem('ksp-user-role', result.user.role);
        localStorage.setItem('ksp-token', result.token);

        // Auto reload to update navbar state
        setTimeout(() => {
          setSuccess(null);
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <span className="text-xs font-bold text-slate-500">Retrieving Secure Ledger Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <Shield className="h-6 w-6 text-primary-600" />
          <span>Operator Profile Ledger</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Verify and update official state law enforcement credentials</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-800 flex gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800 flex gap-2.5">
          <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Summary Card */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-soft flex flex-col items-center text-center space-y-5 h-fit relative overflow-hidden">
          {/* Glass banner decor */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-600 to-indigo-700 opacity-80" />
          
          <div className="relative pt-8">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center text-4xl font-extrabold text-primary-700 shrink-0 select-none uppercase">
              {name ? name.charAt(0) : 'U'}
            </div>
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Clearance Status">
              ✓
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-800">{name || 'KSP Officer'}</h2>
            <div className="text-[10px] uppercase font-black tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full w-fit mx-auto border border-primary-200">
              {role}
            </div>
          </div>

          <div className="w-full border-t border-slate-100 pt-4 space-y-3.5 text-left text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-slate-400">Badge Number:</span>
              <span className="text-slate-800 font-bold">{badgeNumber || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cell Division:</span>
              <span className="text-slate-800 font-bold">{department || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cleared Designation:</span>
              <span className="text-slate-800 font-bold">{designation || 'Officer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duty Status:</span>
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">On Duty</span>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-primary-600 text-primary-600 hover:bg-primary-50 py-2.5 text-xs font-bold transition shadow-sm"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Modify Details</span>
            </button>
          )}
        </div>

        {/* Right Side: Details View / Form */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-soft">
          <div className="pb-4 border-b border-slate-100 mb-6 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Security Clearance Dossier Details</h3>
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officer Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="e.g. Officer Dharshana"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-slate-50 text-slate-500 pl-10 pr-3 py-2.5 outline-none"
                    placeholder="name@ksp.gov.in"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Official email address cannot be modified.</p>
              </div>

              {/* Badge Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Badge ID</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Bookmark className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="e.g. KSP-9018-CYBER"
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Designation</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="e.g. Cyber Crime Sub-Inspector"
                  />
                </div>
              </div>

              {/* Cell/Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department / Command Unit</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="e.g. Command Cyber Threat Intelligence Cell"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Contact Extension</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditing}
                    className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="e.g. +91 94808 xxxxx"
                  />
                </div>
              </div>

              {/* Security Classification (Role) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Role Classification</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs font-bold rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="investigator">Investigator (INV)</option>
                  <option value="analyst">Analyst (ANL)</option>
                  <option value="supervisor">Supervisor (SUP) - Audit Logs Access</option>
                  <option value="policymaker">Superintendent / Policy Maker</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  className="rounded-2xl border border-[#E2E8F0] px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-primary-700 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Operator Profile
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
