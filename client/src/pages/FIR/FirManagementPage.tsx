import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../shared/api';
import { FileText, Send, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

export default function FirManagementPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Cyber Crime');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [policeStation, setPoliceStation] = useState('');
  const [modusOperandi, setModusOperandi] = useState('');
  const [accusedNames, setAccusedNames] = useState('');
  const [victimName, setVictimName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !policeStation) {
      setError('Please fill in all mandatory fields (Title, Description, Location, Police Station)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCase = await api.createCase({
        title,
        description,
        type,
        severity,
        location,
        district,
        policeStation,
        modusOperandi,
        accusedIds: [], // mapped in backend
        victimIds: [], // mapped in backend
      });
      setLoading(false);
      // Success! Redirect to cases list and activate this new case
      navigate(`/cases?caseId=${newCase.id}`);
    } catch (err) {
      console.error('Error creating FIR:', err);
      setError('Could not establish secure connection to the KSP Data Store.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cases')}
          className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">FIR Digital Intake Form</h1>
          <p className="mt-1 text-sm text-slate-500">Ingest case reports directly into the centralized police database</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-soft">
        <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-indigo-900 text-xs flex gap-2.5 items-start">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
          <div>
            <strong>AI Auto-Linking Active:</strong> Accused names provided in the form are automatically checked against the state repeat-offender database. If matched, their risk profiles, accounts, and relationships will be dynamically linked to the case timeline.
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-800 flex gap-2 items-center">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                FIR Title / Short Incident Summary <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cryptocurrency extortion or vehicle theft from Indiranagar"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Detailed Incident Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive narrative of the crime event, including timeline, timestamps, and physical evidence observed..."
                rows={5}
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
                required
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Crime Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option>Cyber Crime</option>
                <option>Women Safety</option>
                <option>Financial Crimes</option>
                <option>Theft</option>
              </select>
            </div>

            {/* Severity selection */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Severity Assessment</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Specific Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Malleshwaram 4th Cross"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">District division</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option>Bengaluru Urban</option>
                <option>Mysuru</option>
                <option>Mangaluru</option>
                <option>Hubballi-Dharwad</option>
              </select>
            </div>

            {/* Police Station */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Police Station <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                placeholder="e.g. Indiranagar Police Station"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
                required
              />
            </div>

            {/* Modus Operandi */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Modus Operandi (MO)</label>
              <input
                type="text"
                value={modusOperandi}
                onChange={(e) => setModusOperandi(e.target.value)}
                placeholder="e.g. Sim Swap and OTP interception"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Suspect Names */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Suspect Names (Comma Separated)</label>
              <input
                type="text"
                value={accusedNames}
                onChange={(e) => setAccusedNames(e.target.value)}
                placeholder="e.g. Manjunath Swamy, Karthik Gowda"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Victim Name */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Primary Victim Name</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                placeholder="e.g. S. K. Ranganathan"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-6">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="rounded-2xl border border-[#E2E8F0] px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              File Official FIR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
