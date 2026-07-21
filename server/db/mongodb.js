import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ksp-crime-intel';

export async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB database.');
    await seedMongoDatabase();
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['investigator', 'analyst', 'supervisor', 'policymaker'] },
  badgeNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  designation: { type: String, default: '' },
  status: { type: String, default: 'Active' }
});
export const User = mongoose.model('User', UserSchema);

// FIR Schema
const FirSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  type: String,
  status: String,
  severity: String,
  date: String,
  time: String,
  location: String,
  district: String,
  policeStation: String,
  modusOperandi: String,
  accusedIds: [String],
  victimIds: [String],
  witnessIds: [String],
  evidenceIds: [String]
});
export const Fir = mongoose.model('Fir', FirSchema);

// Accused Schema
const AccusedSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: String,
  education: String,
  occupation: String,
  socioEconomic: String,
  district: String,
  address: String,
  modusOperandi: String,
  riskScore: Number,
  riskLevel: String,
  priorArrests: Number,
  criminalHistory: [String],
  bankAccounts: [String],
  networkTies: [String]
});
export const Accused = mongoose.model('Accused', AccusedSchema);

// Victim Schema
const VictimSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: String,
  socioEconomic: String,
  education: String,
  address: String,
  caseId: String
});
export const Victim = mongoose.model('Victim', VictimSchema);

// Witness Schema
const WitnessSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  contact: String,
  statement: String,
  caseId: String
});
export const Witness = mongoose.model('Witness', WitnessSchema);

// Hotspot Schema
const HotspotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  district: String,
  area: String,
  lat: Number,
  lng: Number,
  density: Number,
  riskLevel: String,
  primaryType: String,
  recommendation: String
});
export const Hotspot = mongoose.model('Hotspot', HotspotSchema);

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sourceAccount: String,
  destAccount: String,
  amount: Number,
  date: String,
  type: String,
  status: String,
  flagged: Boolean,
  notes: String
});
export const Transaction = mongoose.model('Transaction', TransactionSchema);

// Evidence Schema
const EvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  type: String,
  hash: String,
  caseId: String,
  uploadedBy: String,
  uploadedDate: String,
  status: String,
  chainOfCustody: [String]
});
export const Evidence = mongoose.model('Evidence', EvidenceSchema);

// Predictions Schema
const PredictionsSchema = new mongoose.Schema({
  forecast: Array,
  alerts: Array
});
export const Predictions = mongoose.model('Predictions', PredictionsSchema);

// AuditLog Schema
const AuditLogSchema = new mongoose.Schema({
  timestamp: String,
  user: String,
  role: String,
  action: String,
  ip: String
});
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// Password hashing helper (built-in node crypto, works natively on Windows)
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Seeder Function
async function seedMongoDatabase() {
  try {
    // 1. Seed Users (if empty)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default operator users into MongoDB...');
      const defaultUsers = [
        {
          email: 'investigator@ksp.gov.in',
          password: hashPassword('investigator123'),
          name: 'officer_kumar',
          role: 'investigator'
        },
        {
          email: 'supervisor@ksp.gov.in',
          password: hashPassword('supervisor123'),
          name: 'supervisor_patil',
          role: 'supervisor'
        },
        {
          email: 'analyst@ksp.gov.in',
          password: hashPassword('analyst123'),
          name: 'analyst_sharma',
          role: 'analyst'
        },
        {
          email: 'policymaker@ksp.gov.in',
          password: hashPassword('policymaker123'),
          name: 'policymaker_deshpande',
          role: 'policymaker'
        }
      ];
      await User.insertMany(defaultUsers);
      console.log('Seeded 4 default users.');
    }

    // 2. Seed State Crime Registry Data (from seed.json)
    const seedPath = path.join(__dirname, 'seed.json');
    if (fs.existsSync(seedPath)) {
      const rawSeed = fs.readFileSync(seedPath, 'utf8');
      const seedData = JSON.parse(rawSeed);

      const firCount = await Fir.countDocuments();
      if (firCount === 0 && seedData.firs) {
        await Fir.insertMany(seedData.firs);
        console.log(`Seeded ${seedData.firs.length} FIR records to MongoDB.`);
      }

      const accusedCount = await Accused.countDocuments();
      if (accusedCount === 0 && seedData.accused) {
        await Accused.insertMany(seedData.accused);
        console.log(`Seeded ${seedData.accused.length} Accused records to MongoDB.`);
      }

      const victimCount = await Victim.countDocuments();
      if (victimCount === 0 && seedData.victims) {
        await Victim.insertMany(seedData.victims);
        console.log(`Seeded ${seedData.victims.length} Victim records to MongoDB.`);
      }

      const witnessCount = await Witness.countDocuments();
      if (witnessCount === 0 && seedData.witnesses) {
        await Witness.insertMany(seedData.witnesses);
        console.log(`Seeded ${seedData.witnesses.length} Witness records to MongoDB.`);
      }

      const hotspotCount = await Hotspot.countDocuments();
      if (hotspotCount === 0 && seedData.hotspots) {
        await Hotspot.insertMany(seedData.hotspots);
        console.log(`Seeded ${seedData.hotspots.length} Hotspot records to MongoDB.`);
      }

      const transactionCount = await Transaction.countDocuments();
      if (transactionCount === 0 && seedData.transactions) {
        await Transaction.insertMany(seedData.transactions);
        console.log(`Seeded ${seedData.transactions.length} Transaction records to MongoDB.`);
      }

      const evidenceCount = await Evidence.countDocuments();
      if (evidenceCount === 0 && seedData.evidence) {
        await Evidence.insertMany(seedData.evidence);
        console.log(`Seeded ${seedData.evidence.length} Evidence records to MongoDB.`);
      }

      const predictionsCount = await Predictions.countDocuments();
      if (predictionsCount === 0 && seedData.predictions) {
        await Predictions.create(seedData.predictions);
        console.log('Seeded Predictions & alerts records to MongoDB.');
      }

      const logsCount = await AuditLog.countDocuments();
      if (logsCount === 0 && seedData.auditLogs) {
        await AuditLog.insertMany(seedData.auditLogs);
        console.log(`Seeded ${seedData.auditLogs.length} AuditLog records to MongoDB.`);
      }
    }
  } catch (err) {
    console.error('Error seeding MongoDB database:', err);
  }
}
