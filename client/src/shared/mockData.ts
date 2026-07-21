import { FIR, Accused, Victim, Witness, Hotspot, Transaction, Evidence, AuditLog } from './api';

export const mockFirs: FIR[] = [
  {
    id: "KSP/2026/04431",
    title: "Phishing & Sim Swap Bank Fraud",
    description: "Victim reported sudden loss of cellular signal, followed by three unauthorized transactions totaling ₹15,00,000 from accounts.",
    type: "Cyber Crime",
    status: "Open",
    severity: "High",
    date: "2026-06-15",
    time: "14:30",
    location: "Indiranagar",
    district: "Bengaluru Urban",
    policeStation: "Indiranagar Station",
    modusOperandi: "Sim Swap and Phishing",
    accusedIds: ["A-1193", "A-1204"],
    victimIds: ["V-5001"],
    witnessIds: ["W-6001"],
    evidenceIds: ["E-8001", "E-8002"]
  },
  {
    id: "KSP/2026/04108",
    title: "Domestic Assault and Extortion",
    description: "Victim subjected to physical abuse and demands for dowry. Accused threatened victim's family with public defamation.",
    type: "Women Safety",
    status: "Pending Investigation",
    severity: "Medium",
    date: "2026-05-20",
    time: "09:00",
    location: "Kuchela Layout",
    district: "Mysuru",
    policeStation: "Mysuru East Station",
    modusOperandi: "Physical Abuse & Blackmail",
    accusedIds: ["A-1102"],
    victimIds: ["V-5002"],
    witnessIds: ["W-6002"],
    evidenceIds: ["E-8003"]
  },
  {
    id: "KSP/2026/03977",
    title: "Shell Company Investment Fraud",
    description: "Luring middle-income victims into investing in dummy agricultural startups promising 40% yearly returns. Money routed through shell accounts.",
    type: "Financial Crimes",
    status: "Solved",
    severity: "High",
    date: "2026-04-12",
    time: "11:15",
    location: "Lalbagh Road",
    district: "Bengaluru Urban",
    policeStation: "Wilson Garden Station",
    modusOperandi: "Shell Company Ponzi Scheme",
    accusedIds: ["A-1193", "A-1105"],
    victimIds: ["V-5003", "V-5004"],
    witnessIds: ["W-6003"],
    evidenceIds: ["E-8004"]
  },
  {
    id: "KSP/2026/02991",
    title: "Gold Smuggling Syndicate",
    description: "Interception of passenger carrying 4.5kg of undeclared gold paste in custom linings at airport transit. Linked to cross-border networks.",
    type: "Financial Crimes",
    status: "Open",
    severity: "High",
    date: "2026-03-05",
    time: "23:45",
    location: "Devanahalli Airport Road",
    district: "Bengaluru Rural",
    policeStation: "Devanahalli Airport Station",
    modusOperandi: "Body Concealment & Smuggling",
    accusedIds: ["A-1204"],
    victimIds: [],
    witnessIds: ["W-6004"],
    evidenceIds: ["E-8005"]
  },
  {
    id: "KSP/2026/01882",
    title: "Two-Wheeler Theft Ring",
    description: "Organized gang stealing parked two-wheelers outside metro stations using duplicate master keys and dismantling for spare parts.",
    type: "Theft",
    status: "Solved",
    severity: "Low",
    date: "2026-02-18",
    time: "18:10",
    location: "Yeshwanthpur Metro Station",
    district: "Bengaluru Urban",
    policeStation: "Yeshwanthpur Station",
    modusOperandi: "Master Key Theft",
    accusedIds: ["A-1088"],
    victimIds: ["V-5005"],
    witnessIds: ["W-6005"],
    evidenceIds: ["E-8006"]
  }
];

export const mockAccused: Accused[] = [
  {
    id: "A-1193",
    name: "Ramesh Kumar @ Bullet Ramesh",
    age: 34,
    gender: "Male",
    education: "Undergraduate Dropout",
    occupation: "Unemployed / Broker",
    socioEconomic: "Middle Class",
    district: "Bengaluru Urban",
    address: "House 42, 3rd Cross, Peenya Industrial Area, Bengaluru",
    modusOperandi: "Phishing emails and managing mule bank accounts for money transfer.",
    riskScore: 88,
    riskLevel: "High",
    priorArrests: 4,
    criminalHistory: ["KSP/2023/0112 - Cyber Fraud", "KSP/2024/0981 - Extortion", "KSP/2026/04431 - Sim Swap Fraud"],
    bankAccounts: ["HDFC - 50100234129481", "ICICI - 001105991823"],
    networkTies: ["A-1204", "A-1105"]
  },
  {
    id: "A-1204",
    name: "Vikram Shetty",
    age: 41,
    gender: "Male",
    education: "Diploma in Electrical Eng.",
    occupation: "Customs Agent / Dealer",
    socioEconomic: "Upper Middle Class",
    district: "Mangaluru",
    address: "Beach Road, Surathkal, Mangaluru",
    modusOperandi: "Cross-border gold smuggling, hawala transfers, corporate shell creation.",
    riskScore: 79,
    riskLevel: "High",
    priorArrests: 2,
    criminalHistory: ["KSP/2025/0042 - Customs Violation", "KSP/2026/02991 - Gold Smuggling"],
    bankAccounts: ["Axis Bank - 918020048123"],
    networkTies: ["A-1193"]
  },
  {
    id: "A-1102",
    name: "Santhosh Gowda",
    age: 29,
    gender: "Male",
    education: "Higher Secondary",
    occupation: "Real Estate Agent",
    socioEconomic: "Lower Middle Class",
    district: "Mysuru",
    address: "Vijayanagar 4th Stage, Mysuru",
    modusOperandi: "Domestic violence, blackmailing victims using recorded calls.",
    riskScore: 62,
    riskLevel: "Medium",
    priorArrests: 1,
    criminalHistory: ["KSP/2026/04108 - Assault & Extortion"],
    bankAccounts: ["SBI - 30491823910"],
    networkTies: []
  },
  {
    id: "A-1105",
    name: "Priya Darshini",
    age: 36,
    gender: "Female",
    education: "MBA Finance",
    occupation: "Financial Consultant",
    socioEconomic: "Upper Class",
    district: "Bengaluru Urban",
    address: "Koramangala 5th Block, Bengaluru",
    modusOperandi: "Drafting fraudulent prospectus for ponzi agricultural schemes.",
    riskScore: 71,
    riskLevel: "High",
    priorArrests: 1,
    criminalHistory: ["KSP/2026/03977 - Ponzi Scheme"],
    bankAccounts: ["Kotak - 4811928374"],
    networkTies: ["A-1193"]
  },
  {
    id: "A-1088",
    name: "Kiran @ Local Kiran",
    age: 23,
    gender: "Male",
    education: "10th Pass",
    occupation: "Mechanic Helper",
    socioEconomic: "Low Income",
    district: "Bengaluru Urban",
    address: "Laggere Slum Board, Peenya, Bengaluru",
    modusOperandi: "Master key ignition picking and vehicle disassembly.",
    riskScore: 45,
    riskLevel: "Low",
    priorArrests: 3,
    criminalHistory: ["KSP/2024/0012 - Bike Theft", "KSP/2025/0811 - Bike Theft", "KSP/2026/01882 - Bike Theft Ring"],
    bankAccounts: ["Paytm Payments Bank - 9901827361"],
    networkTies: []
  }
];

export const mockVictims: Victim[] = [
  { id: "V-5001", name: "Ananth Narayan", age: 52, gender: "Male", socioEconomic: "Middle Class", education: "Graduate", address: "Indiranagar, Bengaluru", caseId: "KSP/2026/04431" },
  { id: "V-5002", name: "Sunitha Gowda", age: 26, gender: "Female", socioEconomic: "Lower Middle Class", education: "High School", address: "Mysuru East, Mysuru", caseId: "KSP/2026/04108" },
  { id: "V-5003", name: "Dr. K.V. Rao", age: 61, gender: "Male", socioEconomic: "Upper Middle Class", education: "Post Graduate", address: "Wilson Garden, Bengaluru", caseId: "KSP/2026/03977" },
  { id: "V-5004", name: "Meenakshi Sundaram", age: 48, gender: "Female", socioEconomic: "Middle Class", education: "Graduate", address: "Jayanagar, Bengaluru", caseId: "KSP/2026/03977" },
  { id: "V-5005", name: "Suhas Hegde", age: 28, gender: "Male", socioEconomic: "Middle Class", education: "B.E. IT", address: "Yeshwanthpur, Bengaluru", caseId: "KSP/2026/01882" }
];

export const mockWitnesses: Witness[] = [
  { id: "W-6001", name: "Airtel Nodal Officer", contact: "+91 9845012345", statement: "Confirmed SIM swap request was initiated from fraudulent ID documents.", caseId: "KSP/2026/04431" },
  { id: "W-6002", name: "Neighbor - Lakshmi Amma", contact: "+91 9900112233", statement: "Heard violent argument and screaming on night of May 19th.", caseId: "KSP/2026/04108" },
  { id: "W-6003", name: "Bank Branch Manager", contact: "+91 8023456789", statement: "Suspicious bulk cash withdrawals were flagged to FIU-IND.", caseId: "KSP/2026/03977" },
  { id: "W-6004", name: "Airport Customs Inspector", contact: "+91 9811223344", statement: "Passenger displayed anomalous thermal imagery signature during X-ray check.", caseId: "KSP/2026/02991" },
  { id: "W-6005", name: "Metro Security Guard", contact: "+91 9740011223", statement: "Spotted suspect lingering near parking lot with heavy backpack.", caseId: "KSP/2026/01882" }
];

export const mockHotspots: Hotspot[] = [
  { id: "H-101", district: "Bengaluru Urban", area: "Peenya Industrial Area", lat: 13.0285, lng: 77.5197, density: 94, riskLevel: "High", primaryType: "Cyber & Mule Fraud", recommendation: "Increase cyber patrol & verify SIM retailers" },
  { id: "H-102", district: "Bengaluru Urban", area: "Indiranagar 100ft Road", lat: 12.9784, lng: 77.6408, density: 78, riskLevel: "Medium", primaryType: "Pub Scams & Theft", recommendation: "Enhanced midnight patrolling near nightlife venues" },
  { id: "H-103", district: "Mysuru", area: "Devaraja Market", lat: 12.3087, lng: 76.6531, density: 85, riskLevel: "High", primaryType: "Pickpocketing & extortion", recommendation: "Deploy CCTV facial recognition cameras" },
  { id: "H-104", district: "Mangaluru", area: "Old Port Area", lat: 12.8628, lng: 74.8347, density: 88, riskLevel: "High", primaryType: "Smuggling & Hawala", recommendation: "Joint coastal security checkposts" },
  { id: "H-105", district: "Hubballi-Dharwad", area: "Old Hubli Market", lat: 15.3524, lng: 75.1419, density: 64, riskLevel: "Medium", primaryType: "Vehicle Theft", recommendation: "Automated Number Plate Recognition (ANPR)" }
];

export const mockTransactions: Transaction[] = [
  { id: "TX-9001", sourceAccount: "HDFC - 50100234129481", destAccount: "ICICI - 001105991823", amount: 500000, date: "2026-06-15", type: "IMPS", status: "Completed", flagged: true, notes: "Sim swap fraud money transfer" },
  { id: "TX-9002", sourceAccount: "HDFC - 50100234129481", destAccount: "Axis - 918020048123", amount: 750000, date: "2026-06-15", type: "RTGS", status: "Completed", flagged: true, notes: "Hawala routing to gold syndicate" },
  { id: "TX-9003", sourceAccount: "Kotak - 4811928374", destAccount: "SBI - 30491823910", amount: 1200000, date: "2026-04-12", type: "NEFT", status: "Completed", flagged: true, notes: "Ponzi payout payout stream" }
];

export const mockEvidence: Evidence[] = [
  { id: "E-8001", name: "CCTV Grab - ATM Cash Withdrawal.jpg", type: "Image", hash: "a3f8901bce45d", caseId: "KSP/2026/04431", uploadedBy: "officer_kumar", uploadedDate: "2026-06-16", status: "Verified", chainOfCustody: ["Uploaded by Officer Kumar", "Verified by Forensic Lab"] },
  { id: "E-8002", name: "SIM Swap Request Log.pdf", type: "Document", hash: "78b10492cca10", caseId: "KSP/2026/04431", uploadedBy: "officer_kumar", uploadedDate: "2026-06-16", status: "Verified", chainOfCustody: ["Submitted by Airtel Nodal"] },
  { id: "E-8003", name: "Extortion WhatsApp Call Audio.mp3", type: "Audio", hash: "991827364510a", caseId: "KSP/2026/04108", uploadedBy: "supervisor_patil", uploadedDate: "2026-05-21", status: "Pending Analysis", chainOfCustody: ["Uploaded by Supervisor Patil"] }
];

export const mockAuditLogs: AuditLog[] = [
  { timestamp: "2026-07-21 09:30:15", user: "officer_kumar@ksp.gov.in", role: "investigator", action: "Queried Case KSP/2026/04431 details", ip: "10.14.22.8" },
  { timestamp: "2026-07-21 09:15:00", user: "supervisor_patil@ksp.gov.in", role: "supervisor", action: "Approved Crime Hotspot Patrol Directive H-101", ip: "10.14.22.1" },
  { timestamp: "2026-07-21 08:45:22", user: "analyst_sharma@ksp.gov.in", role: "analyst", action: "Generated Predictive Analytics Risk Matrix for Peenya", ip: "10.14.22.14" }
];
