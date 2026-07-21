import React, { useState } from 'react';
import { UploadCloud, Fingerprint, FileText, Scan, Clock, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function EvidencePage() {
  const [activePanel, setActivePanel] = useState<'custody' | 'ocr' | 'face'>('custody');

  // Chain of custody items
  const mockEvidenceList = [
    { id: 'E-2001', name: 'CCTV Footage File (Indiranagar Sector 4)', type: 'Video Log' },
    { id: 'E-2002', name: 'SIM Phishing Log Registry (90812-XXXXX)', type: 'Network Log' },
    { id: 'E-2003', name: 'NEFT Transaction Ledger PDF (TXN-9081)', type: 'Financial Ledger' },
  ];

  const [selectedEvidenceId, setSelectedEvidenceId] = useState('E-2001');

  const custodyTimelines: Record<string, Array<{ date: string; time: string; custodian: string; action: string; badge: string; hash: string }>> = {
    'E-2001': [
      { date: '2026-07-10', time: '14:23:00', custodian: 'Inspector Kumar', action: 'Evidence Seized from CCTV indiranagar terminal.', badge: 'KSP-8902', hash: 'sha256:d83b482...a901' },
      { date: '2026-07-10', time: '17:45:00', custodian: 'Officer Patel', action: 'Logged into cyber crime storage vault.', badge: 'KSP-9281', hash: 'sha256:f12a32c...881a' },
      { date: '2026-07-11', time: '09:30:00', custodian: 'Forensic Analyst Deshpande', action: 'Transferred to Forensic Lab for resolution recovery.', badge: 'KSP-LAB-32', hash: 'sha256:90a823b...094b' },
      { date: '2026-07-11', time: '16:15:00', custodian: 'Forensic Analyst Deshpande', action: 'Analysis complete. Extracted frame matches suspect profile.', badge: 'KSP-LAB-32', hash: 'sha256:ee82101...991c' },
      { date: '2026-07-12', time: '11:00:00', custodian: 'Superintendent Rao', action: 'Locked as verified evidence for court file dossier.', badge: 'KSP-0021', hash: 'sha256:7739a82...d283' },
    ],
    'E-2002': [
      { date: '2026-07-12', time: '08:12:00', custodian: 'Sub-Inspector Gowda', action: 'Phishing SIM log data pulled via mobile carrier.', badge: 'KSP-5412', hash: 'sha256:88921a8...bc90' },
      { date: '2026-07-12', time: '10:45:00', custodian: 'Officer Patel', action: 'Logged into digital ledger cloud backup.', badge: 'KSP-9281', hash: 'sha256:88921a8...bc90' },
      { date: '2026-07-13', time: '14:30:00', custodian: 'Forensic Analyst Deshpande', action: 'Linked IP addresses associated with recipient accounts.', badge: 'KSP-LAB-32', hash: 'sha256:bc32018...921a' },
    ],
    'E-2003': [
      { date: '2026-07-13', time: '11:15:00', custodian: 'Inspector Kumar', action: 'NEFT statement seized from bank branch manager.', badge: 'KSP-8902', hash: 'sha256:ab2301f...cc88' },
      { date: '2026-07-13', time: '15:20:00', custodian: 'Superintendent Rao', action: 'Secured in locked evidence vault.', badge: 'KSP-0021', hash: 'sha256:d9018ab...ff23' },
    ],
  };

  // OCR States
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [selectedOcrDoc, setSelectedOcrDoc] = useState<'receipt' | 'sms'>('receipt');

  const runOcrSimulator = () => {
    setOcrLoading(true);
    setOcrResult(null);
    setTimeout(() => {
      setOcrLoading(false);
      if (selectedOcrDoc === 'receipt') {
        setOcrResult({
          text: `STATE BANK OF INDIA -- ONLINE NEFT RECORD\nTRANS REF NO: TXN-908129841\nDATE: 2026-07-09\nSENDER AC: 9081-2291-03\nSENDER NAME: MANJUNATH SWAMY\nBENEFICIARY AC: 1022-8921-99\nAMOUNT: INR 8,00,000.00\nSTATUS: SUCCESSFUL`,
          entities: [
            { type: 'TRANSACTION ID', val: 'TXN-908129841', link: '/financial-crimes?txn=TXN-9081' },
            { type: 'ACCUSED SENDER', val: 'MANJUNATH SWAMY', link: '/accused?id=A-1204' },
            { type: 'AMOUNT', val: '₹8,00,000.00', link: '' },
          ],
        });
      } else {
        setOcrResult({
          text: `DEAR CUSTOMER, YOUR MOBILE NUMBER 90812-XXXXX IS REQUESTED FOR SIM SWAP CARD DEACTIVATION. IF NOT DONE BY YOU, SMS STOP TO 1900 IMMEDIATELY. KSP CYBER SECURITY CELL REPORT LINK: https://ksp.gov.in/report-cybercrime`,
          entities: [
            { type: 'FLAGGED MOBILE', val: '90812-XXXXX', link: '' },
            { type: 'REPORT LINK', val: 'https://ksp.gov.in/report-cybercrime', link: '' },
          ],
        });
      }
    }, 1500);
  };

  // Face Matching States
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const [similarity, setSimilarity] = useState(0);

  const runFaceScanner = () => {
    setScanState('scanning');
    setSimilarity(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 8;
      if (count >= 89) {
        clearInterval(interval);
        setSimilarity(89.4);
        setScanState('matched');
      } else {
        setSimilarity(count);
      }
    }, 100);
  };

  return (
    <div className="space-y-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans">Digital Evidence & Custody Vault</h1>
          <p className="text-sm text-slate-500">
            Chain-of-Custody logging, OCR document extractor, and AI face-matching verification engines.
          </p>
        </div>

        {/* Panel Tabs */}
        <div className="rounded-2xl border border-slate-200 p-1 flex bg-white self-start md:self-auto shadow-sm">
          <button
            onClick={() => setActivePanel('custody')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePanel === 'custody' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Chain of Custody</span>
          </button>
          <button
            onClick={() => setActivePanel('ocr')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePanel === 'ocr' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>OCR Data Extractor</span>
          </button>
          <button
            onClick={() => setActivePanel('face')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePanel === 'face' ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Biometric Face Scanner</span>
          </button>
        </div>
      </div>

      {/* custody Panel */}
      {activePanel === 'custody' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Evidence Selector List */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft h-fit">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Secured Case Evidence</h2>
            <div className="space-y-3">
              {mockEvidenceList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEvidenceId(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1 ${
                    selectedEvidenceId === item.id
                      ? 'border-primary-600 bg-primary-50/30'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{item.id}</span>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{item.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custody Timeline flow */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Chain-of-Custody Timeline Log</h2>
                <p className="text-xs text-slate-400">Cryptographically signed chronological logs verifying evidence integrity</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-xl">
                <ShieldCheck className="h-4 w-4" />
                <span>Signatures Secure</span>
              </div>
            </div>

            <div className="relative pl-6 border-l-2 border-indigo-100 space-y-6 ml-3">
              {custodyTimelines[selectedEvidenceId]?.map((log, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white border-2 border-indigo-600 shadow-sm group-hover:scale-110 transition">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  </span>
                  
                  {/* Log contents */}
                  <div className="space-y-1.5 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-soft transition duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-slate-800">{log.custodian} <span className="text-slate-400 font-normal">({log.badge})</span></span>
                      <span className="font-semibold text-slate-400">{log.date} @ {log.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">{log.action}</p>
                    <div className="text-[10px] text-slate-400 font-bold font-mono">
                      Log signature: <span className="text-indigo-600">{log.hash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OCR Panel */}
      {activePanel === 'ocr' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* File selector and simulation upload */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">OCR File Upload Simulator</h2>
                <p className="text-xs text-slate-400">Select document to process through the optical character engine</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedOcrDoc('receipt')}
                  className={`flex-1 p-4 rounded-2xl border text-left flex flex-col gap-2 transition ${
                    selectedOcrDoc === 'receipt' ? 'border-primary-600 bg-primary-50/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Bank Transfer Receipt</div>
                    <div className="text-[10px] text-slate-400">SBI Online NEFT Report</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedOcrDoc('sms')}
                  className={`flex-1 p-4 rounded-2xl border text-left flex flex-col gap-2 transition ${
                    selectedOcrDoc === 'sms' ? 'border-primary-600 bg-primary-50/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-5 w-5 text-rose-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Phishing SMS Capture</div>
                    <div className="text-[10px] text-slate-400">Phishing deactivation alert image</div>
                  </div>
                </button>
              </div>

              {/* Upload Drag Box */}
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
                <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                <div className="text-xs font-bold text-slate-700">Drag case documents here</div>
                <div className="text-[10px] text-slate-400 mt-1">Supports PNG, PDF, JPG formats (Max 8MB)</div>
              </div>
            </div>

            <button
              onClick={runOcrSimulator}
              disabled={ocrLoading}
              className="w-full mt-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <Cpu className="h-4 w-4" />
              {ocrLoading ? 'Processing OCR Engine...' : 'Run OCR Text Extraction'}
            </button>
          </div>

          {/* OCR Result output */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft min-h-[300px] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-4">Extracted Metadata Logs</h2>
              
              {ocrLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                  <span className="text-xs font-bold text-slate-400">Scanning document matrix...</span>
                </div>
              ) : ocrResult ? (
                <div className="space-y-4">
                  {/* Raw text */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raw Text Block</div>
                    <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                      {ocrResult.text}
                    </pre>
                  </div>

                  {/* Entity links */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected System Entities</div>
                    <div className="flex flex-wrap gap-2">
                      {ocrResult.entities.map((ent: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-xs flex items-center gap-2">
                          <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wide">{ent.type}</span>
                          <span className="font-bold text-slate-700">{ent.val}</span>
                          {ent.link && (
                            <a href={ent.link} className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 hover:underline ml-1">
                              <span>Link Entity</span>
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                  <FileText className="h-8 w-8 mb-2 opacity-50" />
                  <div className="text-xs font-bold">Waiting for OCR trigger</div>
                  <p className="text-[10px] mt-1 max-w-[220px]">Select a simulation file on the left and trigger OCR extraction.</p>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3 mt-4">
              Verified by KSP Digital Intelligence Unit. Records auto-saved to case ledger.
            </div>
          </div>
        </div>
      )}

      {/* Face Matching Panel */}
      {activePanel === 'face' && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Biometric Facial Verification Engine</h2>
              <p className="text-xs text-slate-400">Match suspect photos or CCTV grabs against the State Accused database profiles</p>
            </div>
            <button
              onClick={runFaceScanner}
              disabled={scanState === 'scanning'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50"
            >
              {scanState === 'scanning' ? 'Scanning Facial Node Matrix...' : 'Start Matching Process'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Source Photo (CCTV Grab) */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">CCTV Evidence Capture</div>
              <div className="relative border border-slate-200 rounded-2xl overflow-hidden h-48 w-44 bg-slate-950 flex items-center justify-center">
                {/* Simulated CCTV Face */}
                <div className="h-32 w-32 rounded-full border-2 border-dashed border-red-500/40 relative flex items-center justify-center">
                  <Scan className="h-20 w-20 text-red-500/50" />
                </div>
                {/* CCTV text indicator */}
                <div className="absolute top-2 left-2 text-[9px] text-slate-400 font-mono">REC CH_04 INDIRANAGAR</div>
              </div>
            </div>

            {/* Match Radar scanner */}
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Scanner Analysis</div>
              
              {scanState === 'idle' && (
                <div className="flex flex-col items-center gap-1.5">
                  <Cpu className="h-10 w-10 text-slate-300" />
                  <div className="text-xs font-bold text-slate-400">Scanner Ready</div>
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="space-y-2 w-full max-w-[200px]">
                  <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-100 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-indigo-600">Mapping facial landmarks...</div>
                  <div className="text-[11px] font-bold text-slate-400">{similarity.toFixed(0)}% mapped</div>
                </div>
              )}

              {scanState === 'matched' && (
                <div className="space-y-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 w-full max-w-[260px] animate-fadeIn">
                  <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
                  <div className="text-base font-black text-emerald-700">{similarity}% POSITIVE MATCH</div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                    Landmark correlation matches Accused profile **A-1204 (Manjunath Swamy)** with 89.4% precision.
                  </p>
                </div>
              )}
            </div>

            {/* Target Profile Match (DB Accused) */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Registry Suspect Profile</div>
              <div className="relative border border-slate-200 rounded-2xl overflow-hidden h-48 w-44 bg-slate-900 flex flex-col justify-between p-3 text-white">
                <div className="text-center font-bold text-xs mt-2 text-indigo-400">A-1204</div>
                <div className="flex items-center justify-center my-2">
                  <Fingerprint className="h-16 w-16 text-indigo-500" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold truncate">Manjunath Swamy</div>
                  <div className="text-[9px] text-slate-400 font-medium">Risk Score: 78% (High)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
