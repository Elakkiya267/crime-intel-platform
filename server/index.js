import express from 'express';
import cors from 'cors';
import { db } from './db/db.js';
import { compileQuery } from './nlp.js';
import { connectMongo, User, hashPassword } from './db/mongodb.js';
import { sqliteChatDb } from './db/sqlite.js';
import catalyst from 'zcatalyst-sdk-node';
import { setCatalystApp } from './db/catalyst-db.js';

const app = express();
const port = 3001;

// Increase request limit for base64 file payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));
app.use(cors());

// Initialize Catalyst SDK middleware if running in Zoho Catalyst environment
app.use((req, res, next) => {
  try {
    if (process.env.CATALYST_PROJECT_ID || process.env.CATALYST_ENVIRONMENT || req.headers['x-zc-project-id']) {
      const catalystApp = catalyst.initialize(req);
      setCatalystApp(catalystApp);
    }
  } catch (err) {
    console.error('Catalyst initialization error:', err);
  }
  next();
});

// Establish MongoDB connection if not in Catalyst
if (!process.env.CATALYST_PROJECT_ID && !process.env.CATALYST_ENVIRONMENT) {
  connectMongo();
}

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [email, role] = decoded.split(':');
    
    if (!email) {
      return res.status(401).json({ error: 'Invalid token format.' });
    }

    const catalystApp = (process.env.CATALYST_PROJECT_ID || process.env.CATALYST_ENVIRONMENT) ? catalyst.initialize(req) : null;
    let userObj = null;

    if (catalystApp) {
      const results = await catalystApp.zcql().executeZCQLQuery(`SELECT * FROM users WHERE email = '${email.toLowerCase()}'`);
      userObj = results.length > 0 ? results[0].users : null;
    } else {
      userObj = await User.findOne({ email: email.toLowerCase() });
    }

    if (!userObj) {
      return res.status(401).json({ error: 'User session invalid.' });
    }

    req.user = userObj;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !email.toLowerCase().endsWith('@ksp.gov.in')) {
    return res.status(400).json({ error: 'Access unauthorized. Only official emails ending with @ksp.gov.in are allowed to sign up.' });
  }

  const catalystApp = (process.env.CATALYST_PROJECT_ID || process.env.CATALYST_ENVIRONMENT) ? catalyst.initialize(req) : null;
  try {
    let existing = null;
    if (catalystApp) {
      try {
        const results = await catalystApp.zcql().executeZCQLQuery(`SELECT * FROM users WHERE email = '${email.toLowerCase()}'`);
        existing = results.length > 0 ? results[0].users : null;
      } catch (err) {
        console.warn('Could not query users table in Catalyst (it might not exist yet):', err.message);
      }
    } else {
      existing = await User.findOne({ email: email.toLowerCase() });
    }

    if (existing) {
      return res.status(400).json({ error: 'User email already exists.' });
    }

    if (catalystApp) {
      const table = catalystApp.datastore().table('users');
      await table.insertRow({
        email: email.toLowerCase(),
        password: hashPassword(password),
        name,
        role,
        badgeNumber: '',
        department: '',
        phoneNumber: '',
        designation: '',
        status: 'Active'
      });
    } else {
      const newUser = new User({
        email: email.toLowerCase(),
        password: hashPassword(password),
        name,
        role
      });
      await newUser.save();
    }
    
    // Simple base64 token representing session
    const token = Buffer.from(email + ':' + role).toString('base64');
    
    // Log to audit log
    await db.addAuditLog(name, role, `Officer Signed Up: ${email}`);
    
    res.status(201).json({ token, user: { email, name, role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed due to database error.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.toLowerCase().endsWith('@ksp.gov.in')) {
    return res.status(400).json({ error: 'Access unauthorized. Only official emails ending with @ksp.gov.in are allowed to log in.' });
  }

  const catalystApp = (process.env.CATALYST_PROJECT_ID || process.env.CATALYST_ENVIRONMENT) ? catalyst.initialize(req) : null;
  try {
    let user = null;
    if (catalystApp) {
      const results = await catalystApp.zcql().executeZCQLQuery(`SELECT * FROM users WHERE email = '${email.toLowerCase()}'`);
      user = results.length > 0 ? results[0].users : null;
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = Buffer.from(email + ':' + user.role).toString('base64');
    
    // Log to audit log
    await db.addAuditLog(user.name, user.role, `Officer Logged In`);
    
    res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed due to database error.' });
  }
});

// GET /api/auth/profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  res.json({
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    badgeNumber: req.user.badgeNumber || '',
    department: req.user.department || '',
    phoneNumber: req.user.phoneNumber || '',
    designation: req.user.designation || '',
    status: req.user.status || 'Active'
  });
});

// PUT /api/auth/profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { name, role, badgeNumber, department, phoneNumber, designation } = req.body;
  const email = req.user.email;
  const catalystApp = (process.env.CATALYST_PROJECT_ID || process.env.CATALYST_ENVIRONMENT) ? catalyst.initialize(req) : null;

  try {
    let updatedUser = null;
    if (catalystApp) {
      const table = catalystApp.datastore().table('users');
      const results = await catalystApp.zcql().executeZCQLQuery(`SELECT ROWID FROM users WHERE email = '${email.toLowerCase()}'`);
      if (results.length > 0) {
        const rowId = results[0].users.ROWID;
        updatedUser = {
          ROWID: rowId,
          email: email.toLowerCase(),
          name: name || req.user.name,
          role: role || req.user.role,
          badgeNumber: badgeNumber !== undefined ? badgeNumber : (req.user.badgeNumber || ''),
          department: department !== undefined ? department : (req.user.department || ''),
          phoneNumber: phoneNumber !== undefined ? phoneNumber : (req.user.phoneNumber || ''),
          designation: designation !== undefined ? designation : (req.user.designation || ''),
          status: req.user.status || 'Active'
        };
        await table.updateRow(updatedUser);
      } else {
        return res.status(404).json({ error: 'User not found in Catalyst.' });
      }
    } else {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if (name) user.name = name;
      if (role) user.role = role;
      if (badgeNumber !== undefined) user.badgeNumber = badgeNumber;
      if (department !== undefined) user.department = department;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (designation !== undefined) user.designation = designation;
      
      await user.save();
      updatedUser = user;
    }

    const newRole = role || req.user.role;
    const newName = name || req.user.name;
    const token = Buffer.from(email + ':' + newRole).toString('base64');

    // Log update action to audit log
    await db.addAuditLog(newName, newRole, `Profile details updated`);

    res.json({
      success: true,
      token,
      user: {
        email,
        name: newName,
        role: newRole,
        badgeNumber: updatedUser.badgeNumber || '',
        department: updatedUser.department || '',
        phoneNumber: updatedUser.phoneNumber || '',
        designation: updatedUser.designation || '',
        status: updatedUser.status || 'Active'
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// GET /api/dashboard
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const firs = await db.getFirs();
    const accused = await db.getAccused();
    const hotspots = await db.getHotspots();

    const total = firs.length;
    const open = firs.filter((f) => f.status === 'Open').length;
    const solved = firs.filter((f) => f.status === 'Solved').length;
    const pending = firs.filter((f) => f.status === 'Pending Investigation').length;
    const repeats = accused.filter((a) => a.priorArrests >= 2).length;
    const activeHotspots = hotspots.filter((h) => h.riskLevel === 'High').length;

    const activities = [
      { id: '1', time: '5m ago', type: 'case', message: 'New FIR KSP/2026/05501 filed in Whitefield (Cyber Crime)' },
      { id: '2', time: '2h ago', type: 'evidence', message: 'CCTV footage hash verified for Case KSP/2026/04431' },
      { id: '3', time: '4h ago', type: 'suspect', message: 'Manjunath Swamy flagged on Suspicious Money Trail (TXN-9081)' },
      { id: '4', time: '1d ago', type: 'hotspot', message: 'High cybercrime warning issued for Indiranagar sector' },
    ];

    const trendsByMonth = [
      { name: 'Jan', crimes: 45 },
      { name: 'Feb', crimes: 52 },
      { name: 'Mar', crimes: 61 },
      { name: 'Apr', crimes: 58 },
      { name: 'May', crimes: 74 },
      { name: 'Jun', crimes: 85 },
      { name: 'Jul (Proj)', crimes: 98 },
    ];

    const crimeTypesBreakdown = [
      { type: 'Cyber Crime', count: firs.filter((f) => f.type === 'Cyber Crime').length },
      { type: 'Women Safety', count: firs.filter((f) => f.type === 'Women Safety').length },
      { type: 'Financial Crimes', count: firs.filter((f) => f.type === 'Financial Crimes').length },
      { type: 'Theft', count: firs.filter((f) => f.type === 'Theft').length },
    ];

    res.json({
      kpis: {
        totalFirs: total,
        openCases: open,
        solvedCases: solved,
        pendingCases: pending,
        repeatOffenders: repeats,
        hotspotsCount: activeHotspots,
      },
      activities,
      trends: trendsByMonth,
      breakdown: crimeTypesBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cases
app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    let firs = await db.getFirs();
    const { type, district, status, search } = req.query;

    if (type && type !== 'All') {
      firs = firs.filter((f) => f.type.toLowerCase() === type.toString().toLowerCase());
    }
    if (district && district !== 'All') {
      firs = firs.filter((f) => f.district.toLowerCase() === district.toString().toLowerCase());
    }
    if (status && status !== 'Any') {
      firs = firs.filter((f) => f.status.toLowerCase() === status.toString().toLowerCase());
    }
    if (search) {
      const q = search.toString().toLowerCase();
      firs = firs.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.modusOperandi.toLowerCase().includes(q)
      );
    }

    res.json(firs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cases
app.post('/api/cases', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, severity, location, district, policeStation, modusOperandi, accusedNames, victimName } = req.body;
    const firs = await db.getFirs();
    const accusedList = await db.getAccused();
    const victims = await db.getVictims();

    const count = firs.length + 1;
    const newId = `KSP/2026/0${4000 + count}`;

    const linkedAccusedIds = [];
    if (accusedNames && accusedNames.trim() !== '') {
      const names = accusedNames.split(',').map(n => n.trim());
      for (const name of names) {
        const found = accusedList.find(a => a.name.toLowerCase() === name.toLowerCase());
        if (found) {
          linkedAccusedIds.push(found.id);
        } else {
          // Dummy create accused
          const newAccId = `A-${1000 + accusedList.length + 1}`;
          linkedAccusedIds.push(newAccId);
        }
      }
    }

    const linkedVictimIds = [];
    if (victimName && victimName.trim() !== '') {
      const newVicId = `V-${5000 + victims.length + 1}`;
      linkedVictimIds.push(newVicId);
    }

    const newFir = {
      id: newId,
      title,
      description,
      type,
      status: 'Open',
      severity: severity || 'Medium',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      location,
      district,
      policeStation,
      modusOperandi: modusOperandi || 'General Theft',
      accusedIds: linkedAccusedIds,
      victimIds: linkedVictimIds,
      witnessIds: [],
      evidenceIds: []
    };

    await db.addFir(newFir);
    await db.addAuditLog(req.user.name, req.user.role, `Filed new FIR: ${newId}`);

    res.status(201).json(newFir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accused
app.get('/api/accused', authenticateToken, async (req, res) => {
  try {
    let accused = await db.getAccused();
    const { search, district, risk } = req.query;

    if (district && district !== 'All') {
      accused = accused.filter((a) => a.district.toLowerCase() === district.toString().toLowerCase());
    }
    if (risk && risk !== 'All') {
      accused = accused.filter((a) => a.riskLevel.toLowerCase() === risk.toString().toLowerCase());
    }
    if (search) {
      const q = search.toString().toLowerCase();
      accused = accused.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.modusOperandi.toLowerCase().includes(q) ||
          a.education.toLowerCase().includes(q)
      );
    }

    res.json(accused);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/victims
app.get('/api/victims', authenticateToken, async (req, res) => {
  try {
    const victims = await db.getVictims();
    res.json(victims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/witnesses
app.get('/api/witnesses', authenticateToken, async (req, res) => {
  try {
    const witnesses = await db.getWitnesses();
    res.json(witnesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hotspots
app.get('/api/hotspots', authenticateToken, async (req, res) => {
  try {
    const hotspots = await db.getHotspots();
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/predictions
app.get('/api/predictions', authenticateToken, async (req, res) => {
  try {
    const predictions = await db.getPredictions();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/evidence
app.get('/api/evidence', authenticateToken, async (req, res) => {
  try {
    const evidence = await db.getEvidence();
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/financial-crimes
app.get('/api/financial-crimes', authenticateToken, async (req, res) => {
  try {
    const transactions = await db.getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/audit-logs
app.get('/api/audit-logs', authenticateToken, async (req, res) => {
  try {
    const logs = await db.getAuditLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/history
app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const history = await sqliteChatDb.getChatHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/chat/history
app.delete('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    await sqliteChatDb.clearChatHistory();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, language, file } = req.body;
    const activeUser = req.user.name;
    const activeRole = req.user.role;

    const result = await compileQuery(message, language || 'english', file);

    // Save chat interaction to SQLite
    const displayMsg = file ? `[Attached File: ${file.name}] ${message}` : message;
    await sqliteChatDb.saveChatMessage('user', displayMsg);
    await sqliteChatDb.saveChatMessage('assistant', result.response, result.citations, result.reasoningPath);

    // Log to audit log
    await db.addAuditLog(activeUser, activeRole, `Chat Query [${language || 'english'}]: ${message}`);

    res.json(result);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/network-analysis
app.get('/api/network-analysis', authenticateToken, async (req, res) => {
  try {
    const firs = await db.getFirs();
    const accused = await db.getAccused();
    const victims = await db.getVictims();
    const txns = await db.getTransactions();

    const nodes = [];
    const links = [];

    // Add Case nodes
    firs.forEach((f) => {
      nodes.push({ id: f.id, label: f.id, type: 'case', details: f.title });
    });

    // Add Accused nodes
    accused.forEach((a) => {
      nodes.push({ id: a.id, label: a.name, type: 'accused', details: `Risk: ${a.riskLevel} (${a.riskScore}%)` });
      
      // Connect Accused -> Cases they are involved in
      firs.forEach((f) => {
        if (f.accusedIds.includes(a.id)) {
          links.push({ source: a.id, target: f.id, label: 'suspect', type: 'involvement' });
        }
      });

      // Add Bank Account nodes and link them to Accused
      a.bankAccounts.forEach((accNum) => {
        nodes.push({ id: accNum, label: `Acc: ${accNum}`, type: 'account', details: 'Linked Account' });
        links.push({ source: a.id, target: accNum, label: 'owns', type: 'ownership' });
      });

      // Network ties between accused
      a.networkTies.forEach((tie) => {
        const match = tie.match(/A-\d+/);
        if (match) {
          const targetId = match[0];
          if (a.id < targetId) {
            links.push({ source: a.id, target: targetId, label: 'associate', type: 'accomplice' });
          }
        }
      });
    });

    // Add Victim nodes
    victims.forEach((v) => {
      nodes.push({ id: v.id, label: v.name, type: 'victim', details: `Victim in ${v.caseId}` });
      if (v.caseId) {
        links.push({ source: v.id, target: v.caseId, label: 'victim', type: 'involvement' });
      }
    });

    // Add Transaction links between bank accounts or suspect accounts
    txns.forEach((t) => {
      let srcId = t.sourceAccount.split(' ')[0];
      let destId = t.destAccount.split(' ')[0];

      if (!nodes.find(n => n.id === srcId)) {
        nodes.push({ id: srcId, label: srcId, type: 'account', details: t.sourceAccount });
      }
      if (!nodes.find(n => n.id === destId)) {
        nodes.push({ id: destId, label: destId, type: 'account', details: t.destAccount });
      }

      links.push({
        source: srcId,
        target: destId,
        label: `Transfer ₹${t.amount.toLocaleString()}`,
        type: 'transaction',
        flagged: t.flagged
      });
    });

    res.json({ nodes, links });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected' });
});

app.listen(port, () => {
  console.log(`KSP Crime Intelligence Backend running on http://localhost:${port}`);
});
