export const API_BASE = 'http://localhost:3001/api';

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
  response: string;
  citations: Array<{
    type: 'case' | 'accused' | 'hotspot' | 'transaction';
    label: string;
    url: string;
    status: string;
  }>;
  reasoningPath: string[];
}

const getHeaders = () => {
  const token = localStorage.getItem('ksp-token');
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
    const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    return res.json();
  },
  getCases: async (filters?: { type?: string; district?: string; status?: string; search?: string }): Promise<FIR[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.district) params.append('district', filters.district);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
    }
    const res = await fetch(`${API_BASE}/cases?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },
  createCase: async (caseData: Partial<FIR>): Promise<FIR> => {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(caseData),
    });
    return res.json();
  },
  getAccused: async (filters?: { search?: string; district?: string; risk?: string }): Promise<Accused[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.district) params.append('district', filters.district);
      if (filters.risk) params.append('risk', filters.risk);
    }
    const res = await fetch(`${API_BASE}/accused?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },
  getVictims: async (): Promise<Victim[]> => {
    const res = await fetch(`${API_BASE}/victims`, { headers: getHeaders() });
    return res.json();
  },
  getWitnesses: async (): Promise<Witness[]> => {
    const res = await fetch(`${API_BASE}/witnesses`, { headers: getHeaders() });
    return res.json();
  },
  getHotspots: async (): Promise<Hotspot[]> => {
    const res = await fetch(`${API_BASE}/hotspots`, { headers: getHeaders() });
    return res.json();
  },
  getPredictions: async () => {
    const res = await fetch(`${API_BASE}/predictions`, { headers: getHeaders() });
    return res.json();
  },
  getEvidence: async (): Promise<Evidence[]> => {
    const res = await fetch(`${API_BASE}/evidence`, { headers: getHeaders() });
    return res.json();
  },
  getFinancialCrimes: async (): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE}/financial-crimes`, { headers: getHeaders() });
    return res.json();
  },
  getNetworkAnalysis: async (): Promise<{ nodes: any[]; links: any[] }> => {
    const res = await fetch(`${API_BASE}/network-analysis`, { headers: getHeaders() });
    return res.json();
  },
  sendChatMessage: async (message: string, language: string, role = 'investigator', file?: { name: string; type: string; base64: string }): Promise<ChatResponse> => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, language, role, file }),
    });
    return res.json();
  },
  getChatHistory: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/chat/history`, { headers: getHeaders() });
    return res.json();
  },
  clearChatHistory: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/chat/history`, { method: 'DELETE', headers: getHeaders() });
    return res.json();
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch(`${API_BASE}/audit-logs`, { headers: getHeaders() });
    return res.json();
  },
  signup: async (signupData: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },
  login: async (credentials: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },
  getProfile: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch profile');
    }
    return res.json();
  },
  updateProfile: async (profileData: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },
};
