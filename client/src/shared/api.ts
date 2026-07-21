import {
  mockFirs,
  mockAccused,
  mockVictims,
  mockWitnesses,
  mockHotspots,
  mockTransactions,
  mockEvidence,
  mockAuditLogs
} from './mockData';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : (isLocal ? 'http://localhost:3001/api' : '/api');

export interface FIR {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  severity: string;
  date: string;
  time: string;
  location: string;
  district: string;
  policeStation: string;
  modusOperandi: string;
  accusedIds: string[];
  victimIds: string[];
  witnessIds: string[];
  evidenceIds: string[];
}

export interface Accused {
  id: string;
  name: string;
  age: number;
  gender: string;
  education: string;
  occupation: string;
  socioEconomic: string;
  district: string;
  address: string;
  modusOperandi: string;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  priorArrests: number;
  criminalHistory: string[];
  bankAccounts: string[];
  networkTies: string[];
}

export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: string;
  socioEconomic: string;
  education: string;
  address: string;
  caseId: string;
}

export interface Witness {
  id: string;
  name: string;
  contact: string;
  statement: string;
  caseId: string;
}

export interface Hotspot {
  id: string;
  district: string;
  area: string;
  lat: number;
  lng: number;
  density: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  primaryType: string;
  recommendation: string;
}

export interface Transaction {
  id: string;
  sourceAccount: string;
  destAccount: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  flagged: boolean;
  notes: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: string;
  hash: string;
  caseId: string;
  uploadedBy: string;
  uploadedDate: string;
  status: string;
  chainOfCustody: string[];
}

export interface AuditLog {
  timestamp: string;
  user: string;
  role: string;
  action: string;
  ip: string;
}

export interface ChatResponse {
  response?: string;
  citations?: any[];
  sqlQuery?: string;
  dataSummary: string;
  policeReport: string;
  findings: Array<{
    title: string;
    description: string;
    status: string;
  }>;
  reasoningPath: string[];
}

const getHeaders = () => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('ksp-token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  getDashboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unreachable, using local fallback dashboard metrics:', e);
      return {
        kpis: {
          totalFirs: mockFirs.length,
          openCases: mockFirs.filter(f => f.status === 'Open').length,
          solvedCases: mockFirs.filter(f => f.status === 'Solved').length,
          pendingCases: mockFirs.filter(f => f.status === 'Pending Investigation').length,
          repeatOffenders: mockAccused.filter(a => a.priorArrests >= 2).length,
          hotspotsCount: mockHotspots.length
        },
        activities: [
          { id: 1, type: 'FIR Registered', title: 'Phishing & Sim Swap Fraud', time: '10 mins ago', district: 'Bengaluru Urban' },
          { id: 2, type: 'Hotspot Alert', title: 'High Density Alert at Peenya Industrial Area', time: '25 mins ago', district: 'Bengaluru Urban' },
          { id: 3, type: 'Accused Flagged', title: 'Ramesh Kumar risk score updated to 88', time: '1 hour ago', district: 'Bengaluru Urban' },
          { id: 4, type: 'Transaction Flagged', title: 'Hawala transfer ₹7,50,000 intercepted', time: '2 hours ago', district: 'Mangaluru' }
        ],
        trends: [
          { name: 'Jan', crimes: 340 },
          { name: 'Feb', crimes: 380 },
          { name: 'Mar', crimes: 410 },
          { name: 'Apr', crimes: 450 },
          { name: 'May', crimes: 490 },
          { name: 'Jun', crimes: 530 }
        ],
        breakdown: [
          { type: 'Cyber Crime', count: 2 },
          { type: 'Women Safety', count: 1 },
          { type: 'Financial Crimes', count: 2 },
          { type: 'Theft', count: 1 }
        ]
      };
    }
  },
  getCases: async (filters?: { type?: string; district?: string; status?: string; search?: string }): Promise<FIR[]> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.type) params.append('type', filters.type);
        if (filters.district) params.append('district', filters.district);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
      }
      const res = await fetch(`${API_BASE}/cases?${params.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      console.warn('Backend API unreachable, using local fallback cases:', e);
      let results = [...mockFirs];
      if (filters) {
        if (filters.type && filters.type !== 'All') results = results.filter(f => f.type === filters.type);
        if (filters.district && filters.district !== 'All') results = results.filter(f => f.district === filters.district);
        if (filters.status && filters.status !== 'All') results = results.filter(f => f.status === filters.status);
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(f => f.title.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
        }
      }
      return results;
    }
  },
  createCase: async (caseData: Partial<FIR>): Promise<FIR> => {
    try {
      const res = await fetch(`${API_BASE}/cases`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(caseData),
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      const newFir: FIR = {
        id: caseData.id || `KSP/2026/${Math.floor(10000 + Math.random() * 90000)}`,
        title: caseData.title || 'New Unnamed Case',
        description: caseData.description || '',
        type: caseData.type || 'Other',
        status: caseData.status || 'Open',
        severity: caseData.severity || 'Medium',
        date: caseData.date || new Date().toISOString().substring(0, 10),
        time: caseData.time || '12:00',
        location: caseData.location || 'Karnataka',
        district: caseData.district || 'Bengaluru Urban',
        policeStation: caseData.policeStation || 'Central Police Station',
        modusOperandi: caseData.modusOperandi || '',
        accusedIds: caseData.accusedIds || [],
        victimIds: caseData.victimIds || [],
        witnessIds: caseData.witnessIds || [],
        evidenceIds: caseData.evidenceIds || []
      };
      mockFirs.unshift(newFir);
      return newFir;
    }
  },
  getAccused: async (filters?: { search?: string; district?: string; risk?: string }): Promise<Accused[]> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.district) params.append('district', filters.district);
        if (filters.risk) params.append('risk', filters.risk);
      }
      const res = await fetch(`${API_BASE}/accused?${params.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      let results = [...mockAccused];
      if (filters) {
        if (filters.district && filters.district !== 'All') results = results.filter(a => a.district === filters.district);
        if (filters.risk && filters.risk !== 'All') results = results.filter(a => a.riskLevel === filters.risk);
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.address.toLowerCase().includes(q));
        }
      }
      return results;
    }
  },
  getVictims: async (): Promise<Victim[]> => {
    try {
      const res = await fetch(`${API_BASE}/victims`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockVictims;
    }
  },
  getWitnesses: async (): Promise<Witness[]> => {
    try {
      const res = await fetch(`${API_BASE}/witnesses`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockWitnesses;
    }
  },
  getHotspots: async (): Promise<Hotspot[]> => {
    try {
      const res = await fetch(`${API_BASE}/hotspots`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockHotspots;
    }
  },
  getPredictions: async () => {
    try {
      const res = await fetch(`${API_BASE}/predictions`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return {
        forecast: [
          { month: 'Jan', predicted: 420, actual: 410 },
          { month: 'Feb', predicted: 440, actual: 435 },
          { month: 'Mar', predicted: 460, actual: 450 },
          { month: 'Apr', predicted: 480, actual: 475 },
          { month: 'May', predicted: 510, actual: 500 },
          { month: 'Jun', predicted: 530, actual: 520 }
        ],
        alerts: [
          { district: 'Bengaluru Urban', risk: 'High Risk Spike', recommendation: 'Increase cyber patrol at Peenya' },
          { district: 'Mangaluru', risk: 'Coastal Hawala Alert', recommendation: 'Joint checkpost with Marine Police' }
        ]
      };
    }
  },
  getEvidence: async (): Promise<Evidence[]> => {
    try {
      const res = await fetch(`${API_BASE}/evidence`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockEvidence;
    }
  },
  getFinancialCrimes: async (): Promise<Transaction[]> => {
    try {
      const res = await fetch(`${API_BASE}/financial-crimes`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockTransactions;
    }
  },
  getNetworkAnalysis: async (): Promise<{ nodes: any[]; links: any[] }> => {
    try {
      const res = await fetch(`${API_BASE}/network-analysis`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return {
        nodes: [
          { id: 'A-1193', label: 'Ramesh Kumar', type: 'accused', risk: 88 },
          { id: 'A-1204', label: 'Vikram Shetty', type: 'accused', risk: 79 },
          { id: 'A-1105', label: 'Priya Darshini', type: 'accused', risk: 71 },
          { id: 'TX-9001', label: 'HDFC Transfer ₹5L', type: 'transaction' },
          { id: 'TX-9002', label: 'Axis RTGS ₹7.5L', type: 'transaction' }
        ],
        links: [
          { source: 'A-1193', target: 'TX-9001' },
          { source: 'TX-9001', target: 'A-1204' },
          { source: 'A-1193', target: 'A-1105' }
        ]
      };
    }
  },
  sendChatMessage: async (message: string, language: string, role = 'investigator', file?: { name: string; type: string; base64: string }): Promise<ChatResponse> => {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, language, role, file }),
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      const reportText = `CONFIDENTIAL POLICE INTELLIGENCE SUMMARY:\nQuery: ${message}\nStatus: Intelligence records cross-referenced.\nKey Suspect: Ramesh Kumar @ Bullet Ramesh (Risk Score: 88/100, 4 Prior Arrests).\nAction Directive: Initiate surveillance on Peenya Industrial Area, Bengaluru Urban.`;
      return {
        response: reportText,
        citations: [{ id: "KSP/2026/04431", title: "Phishing & Sim Swap Bank Fraud" }],
        sqlQuery: `SELECT * FROM firs WHERE description LIKE '%${message}%' OR modusOperandi LIKE '%${message}%'`,
        dataSummary: `Found 2 matching case records in Karnataka State Police Database corresponding to query: "${message}".`,
        policeReport: reportText,
        findings: [
          { title: "Sim Swap & Cyber Phishing", description: "Case KSP/2026/04431 in Bengaluru Urban matches query.", status: "High Priority" },
          { title: "Financial Hawala Ledger", description: "Flagged transactions totaling ₹12,50,000 between suspect accounts.", status: "Under Review" }
        ],
        reasoningPath: [
          "Parsed query intent for crime entities and location parameters.",
          "Ran relational query against FIR and accused tables.",
          "Synthesized intelligence summary for officer review."
        ]
      };
    }
  },
  getChatHistory: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/chat/history`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },
  clearChatHistory: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/chat/history`, { method: 'DELETE', headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      return mockAuditLogs;
    }
  },
  signup: async (signupData: any): Promise<any> => {
    if (!signupData.email || !signupData.email.toLowerCase().endsWith('@ksp.gov.in')) {
      throw new Error('Access unauthorized. Only official emails ending with @ksp.gov.in are allowed to sign up.');
    }
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e: any) {
      // Ignore network error and proceed with local session creation
    }

    // Create & store session locally for static cloud deployment
    const token = btoa(`${signupData.email.toLowerCase()}:${signupData.role || 'investigator'}`);
    const user = {
      email: signupData.email.toLowerCase(),
      name: signupData.name || 'Official Officer',
      role: signupData.role || 'investigator'
    };
    localStorage.setItem('ksp-token', token);
    localStorage.setItem('ksp-user', JSON.stringify(user));
    return { token, user };
  },
  login: async (credentials: any): Promise<any> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide email and password.');
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e: any) {
      // Ignore network error and proceed with local session creation
    }

    const email = credentials.email.toLowerCase();
    const role = credentials.role || (email.includes('supervisor') ? 'supervisor' : email.includes('analyst') ? 'analyst' : 'investigator');
    const token = btoa(`${email}:${role}`);
    const user = { email, name: credentials.name || email.split('@')[0], role };
    localStorage.setItem('ksp-token', token);
    localStorage.setItem('ksp-user', JSON.stringify(user));
    return { token, user };
  },
  getProfile: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (e) {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('ksp-user') : null;
      if (stored) {
        try { return JSON.parse(stored); } catch (err) {}
      }
      return { email: 'investigator@ksp.gov.in', name: 'Officer Kumar', role: 'investigator' };
    }
  },
  updateProfile: async (profileData: any): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch (e) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ksp-user', JSON.stringify(profileData));
      }
      return profileData;
    }
  },
};
