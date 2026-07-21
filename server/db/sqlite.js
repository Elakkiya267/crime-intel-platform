import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'crime_data.db');

// Open database connection
export const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log('Successfully connected to SQLite database.');
    initSqliteTables();
  }
});

// Wrap DB actions in Promise helpers
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function initSqliteTables() {
  try {
    // 1. Create chat_history
    await dbRun(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        content TEXT,
        citations TEXT,
        reasoningPath TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create firs
    await dbRun(`
      CREATE TABLE IF NOT EXISTS firs (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        type TEXT,
        status TEXT,
        severity TEXT,
        date TEXT,
        time TEXT,
        location TEXT,
        district TEXT,
        policeStation TEXT,
        modusOperandi TEXT
      )
    `);

    // 3. Create accused
    await dbRun(`
      CREATE TABLE IF NOT EXISTS accused (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        education TEXT,
        occupation TEXT,
        socioEconomic TEXT,
        district TEXT,
        address TEXT,
        modusOperandi TEXT,
        riskScore INTEGER,
        riskLevel TEXT,
        priorArrests INTEGER
      )
    `);

    // 4. Create hotspots
    await dbRun(`
      CREATE TABLE IF NOT EXISTS hotspots (
        id TEXT PRIMARY KEY,
        district TEXT,
        area TEXT,
        lat REAL,
        lng REAL,
        density INTEGER,
        riskLevel TEXT,
        primaryType TEXT,
        recommendation TEXT
      )
    `);

    // 5. Create transactions
    await dbRun(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        sourceAccount TEXT,
        destAccount TEXT,
        amount REAL,
        date TEXT,
        type TEXT,
        status TEXT,
        flagged INTEGER,
        notes TEXT
      )
    `);

    // 6. Create district_crimes (for real 2025 Karnataka State Police data!)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS district_crimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT,
        ipcCrimes INTEGER,
        sllCrimes INTEGER,
        range TEXT
      )
    `);

    // 7. Create ka_ipc_crimes (for real 2025 IPC/BNS head-wise crime categories!)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS ka_ipc_crimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        head TEXT,
        subhead TEXT,
        crimeCount INTEGER
      )
    `);

    await seedSqliteDatabase();
  } catch (err) {
    console.error('Error initializing SQLite tables:', err);
  }
}

async function seedSqliteDatabase() {
  try {
    const seedPath = path.join(__dirname, 'seed.json');
    if (fs.existsSync(seedPath)) {
      const rawSeed = fs.readFileSync(seedPath, 'utf8');
      const seedData = JSON.parse(rawSeed);

      // Check if data is already seeded
      const firCount = await dbGet('SELECT count(*) as count FROM firs');
      if (firCount.count === 0 && seedData.firs) {
        console.log('Seeding seed.json FIRs to SQLite...');
        for (const f of seedData.firs) {
          await dbRun(
            `INSERT OR REPLACE INTO firs (id, title, description, type, status, severity, date, time, location, district, policeStation, modusOperandi)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [f.id, f.title, f.description, f.type, f.status, f.severity, f.date, f.time, f.location, f.district, f.policeStation, f.modusOperandi]
          );
        }
      }

      const accusedCount = await dbGet('SELECT count(*) as count FROM accused');
      if (accusedCount.count === 0 && seedData.accused) {
        console.log('Seeding seed.json Accused to SQLite...');
        for (const a of seedData.accused) {
          await dbRun(
            `INSERT OR REPLACE INTO accused (id, name, age, gender, education, occupation, socioEconomic, district, address, modusOperandi, riskScore, riskLevel, priorArrests)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [a.id, a.name, a.age, a.gender, a.education, a.occupation, a.socioEconomic, a.district, a.address, a.modusOperandi, a.riskScore, a.riskLevel, a.priorArrests]
          );
        }
      }

      const hotspotCount = await dbGet('SELECT count(*) as count FROM hotspots');
      if (hotspotCount.count === 0 && seedData.hotspots) {
        console.log('Seeding seed.json Hotspots to SQLite...');
        for (const h of seedData.hotspots) {
          await dbRun(
            `INSERT OR REPLACE INTO hotspots (id, district, area, lat, lng, density, riskLevel, primaryType, recommendation)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [h.id, h.district, h.area, h.lat, h.lng, h.density, h.riskLevel, h.primaryType, h.recommendation]
          );
        }
      }

      const transactionCount = await dbGet('SELECT count(*) as count FROM transactions');
      if (transactionCount.count === 0 && seedData.transactions) {
        console.log('Seeding seed.json Transactions to SQLite...');
        for (const t of seedData.transactions) {
          await dbRun(
            `INSERT OR REPLACE INTO transactions (id, sourceAccount, destAccount, amount, date, type, status, flagged, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [t.id, t.sourceAccount, t.destAccount, t.amount, t.date, t.type, t.status, t.flagged ? 1 : 0, t.notes]
          );
        }
      }
    }

    // Seed real 2025 districts from CSV
    const csvPath = path.join(__dirname, 'ka-district-wise-2025.csv');
    const districtCount = await dbGet('SELECT count(*) as count FROM district_crimes');
    if (districtCount.count === 0 && fs.existsSync(csvPath)) {
      console.log('Seeding real Karnataka 2025 district-wise crime statistics into SQLite...');
      const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/);
      let currentRange = 'General';

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.endsWith(',,') || line.endsWith(',,,')) {
          currentRange = line.replace(/,+/g, '').trim();
          continue;
        }

        const parts = line.split(',');
        if (parts.length >= 3) {
          const districtName = parts[1]?.trim();
          const ipcVal = parseInt(parts[2]?.trim()) || 0;
          const sllVal = parseInt(parts[3]?.trim()) || 0;

          if (districtName && districtName !== 'Districts/Units' && districtName !== 'Commissionerates' && districtName !== 'STATE') {
            await dbRun(
              `INSERT INTO district_crimes (district, ipcCrimes, sllCrimes, range) VALUES (?, ?, ?, ?)`,
              [districtName, ipcVal, sllVal, currentRange]
            );
          }
        }
      }
      console.log('Finished seeding real crime statistics into SQLite.');
    }

    // Seed real IPC crimes from CSV
    const ipcCsvPath = path.join(__dirname, 'ka-ipc-crimes-2025.csv');
    const ipcDbCount = await dbGet('SELECT count(*) as count FROM ka_ipc_crimes');
    if (ipcDbCount.count === 0 && fs.existsSync(ipcCsvPath)) {
      console.log('Seeding real IPC/BNS 2025 crime statistics into SQLite...');
      const lines = fs.readFileSync(ipcCsvPath, 'utf8').split(/\r?\n/);
      let currentHead = 'General';

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        if (parts.length >= 3) {
          // If first column has a number, it's a new crime head (e.g. "1,Murder (Sec.302/303 IPC/103,104 BNS),")
          const isNum = /^\d+/.test(parts[0]?.trim());
          if (isNum) {
            currentHead = parts[1]?.trim()?.replace(/"/g, '') || currentHead;
            continue;
          }

          const subheadName = parts[1]?.trim()?.replace(/"/g, '');
          const countVal = parseInt(parts[2]?.trim()) || 0;

          if (subheadName && subheadName !== 'Sub Total' && !subheadName.toLowerCase().includes('total')) {
            await dbRun(
              `INSERT INTO ka_ipc_crimes (head, subhead, crimeCount) VALUES (?, ?, ?)`,
              [currentHead, subheadName, countVal]
            );
          }
        }
      }
      console.log('Finished seeding real IPC crime statistics into SQLite.');
    }
  } catch (err) {
    console.error('Error seeding SQLite database:', err);
  }
}

// Export Chat History & SQL Exec Helpers
export const sqliteChatDb = {
  getChatHistory: async () => {
    try {
      const rows = await dbAll('SELECT role, content, citations, reasoningPath, timestamp FROM chat_history ORDER BY id ASC');
      return rows.map(r => ({
        role: r.role,
        content: r.content,
        citations: r.citations ? JSON.parse(r.citations) : [],
        reasoningPath: r.reasoningPath ? JSON.parse(r.reasoningPath) : [],
        timestamp: r.timestamp
      }));
    } catch (e) {
      console.error('Error reading SQLite chat history:', e);
      return [];
    }
  },
  saveChatMessage: async (role, content, citations = [], reasoningPath = []) => {
    try {
      await dbRun(
        'INSERT INTO chat_history (role, content, citations, reasoningPath) VALUES (?, ?, ?, ?)',
        [role, content, JSON.stringify(citations), JSON.stringify(reasoningPath)]
      );
    } catch (e) {
      console.error('Error saving SQLite chat message:', e);
    }
  },
  clearChatHistory: async () => {
    try {
      await dbRun('DELETE FROM chat_history');
    } catch (e) {
      console.error('Error clearing SQLite chat history:', e);
    }
  },
  executeSQL: async (sql) => {
    console.log(`[SQL Agent Executing]: ${sql}`);
    // Restrict to read-only queries for safety
    const cleanSql = sql.trim();
    if (!cleanSql.toUpperCase().startsWith('SELECT')) {
      throw new Error('Only SELECT queries are authorized for this agent.');
    }
    return await dbAll(cleanSql);
  }
};
