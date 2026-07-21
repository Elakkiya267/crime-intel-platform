import { Fir, Accused, Victim, Witness, Transaction, Hotspot, Evidence, Predictions, AuditLog } from './mongodb.js';
import { catalystDb, getCatalystApp } from './catalyst-db.js';

export const db = {
  getFirs: async () => {
    if (getCatalystApp()) return await catalystDb.getFirs();
    return await Fir.find({}).lean();
  },
  getFirById: async (id) => {
    if (getCatalystApp()) return await catalystDb.getFirById(id);
    return await Fir.findOne({ id }).lean();
  },
  addFir: async (fir) => {
    if (getCatalystApp()) return await catalystDb.addFir(fir);
    const newFir = new Fir(fir);
    await newFir.save();
    return newFir.toObject();
  },
  getAccused: async () => {
    if (getCatalystApp()) return await catalystDb.getAccused();
    return await Accused.find({}).lean();
  },
  getAccusedById: async (id) => {
    if (getCatalystApp()) return await catalystDb.getAccusedById(id);
    return await Accused.findOne({ id }).lean();
  },
  getVictims: async () => {
    if (getCatalystApp()) return await catalystDb.getVictims();
    return await Victim.find({}).lean();
  },
  getWitnesses: async () => {
    if (getCatalystApp()) return await catalystDb.getWitnesses();
    return await Witness.find({}).lean();
  },
  getTransactions: async () => {
    if (getCatalystApp()) return await catalystDb.getTransactions();
    return await Transaction.find({}).lean();
  },
  getHotspots: async () => {
    if (getCatalystApp()) return await catalystDb.getHotspots();
    return await Hotspot.find({}).lean();
  },
  getDemographics: async () => {
    if (getCatalystApp()) return await catalystDb.getDemographics();
    const totalFirs = await Fir.countDocuments();
    const cyberCount = await Fir.countDocuments({ type: 'Cyber Crime' });
    const womenSafetyCount = await Fir.countDocuments({ type: 'Women Safety' });
    const financialCount = await Fir.countDocuments({ type: 'Financial Crimes' });
    const theftCount = await Fir.countDocuments({ type: 'Theft' });

    return {
      cyberCount,
      womenSafetyCount,
      financialCount,
      theftCount,
      totalCount: totalFirs
    };
  },
  getEvidence: async () => {
    if (getCatalystApp()) return await catalystDb.getEvidence();
    return await Evidence.find({}).lean();
  },
  getPredictions: async () => {
    if (getCatalystApp()) return await catalystDb.getPredictions();
    const p = await Predictions.findOne({}).lean();
    return p || { forecast: [], alerts: [] };
  },
  getAuditLogs: async () => {
    if (getCatalystApp()) return await catalystDb.getAuditLogs();
    return await AuditLog.find({}).sort({ _id: -1 }).lean();
  },
  addAuditLog: async (user, role, action, ip = '127.0.0.1') => {
    if (getCatalystApp()) return await catalystDb.addAuditLog(user, role, action, ip);
    const log = new AuditLog({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      role,
      action,
      ip
    });
    await log.save();
    return log.toObject();
  }
};
