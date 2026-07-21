let catalystApp = null;

export function setCatalystApp(app) {
  catalystApp = app;
}

export function getCatalystApp() {
  return catalystApp;
}

/**
 * Helper to execute a ZCQL query and extract the flat rows.
 */
async function executeQuery(query, tableName) {
  if (!catalystApp) {
    throw new Error('Catalyst SDK is not initialized.');
  }
  const result = await catalystApp.zcql().executeZCQLQuery(query);
  return result.map(row => {
    const data = row[tableName] || {};
    // Parse serialized JSON arrays/objects back to their original form
    for (const key in data) {
      if (typeof data[key] === 'string') {
        const val = data[key].trim();
        if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
          try {
            data[key] = JSON.parse(val);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
      }
    }
    return data;
  });
}

/**
 * Helper to insert a row into a Catalyst table.
 */
async function insertRow(tableName, rowData) {
  if (!catalystApp) {
    throw new Error('Catalyst SDK is not initialized.');
  }
  
  // Clone data and serialize arrays/objects to strings
  const preparedData = { ...rowData };
  for (const key in preparedData) {
    if (preparedData[key] !== null && (Array.isArray(preparedData[key]) || typeof preparedData[key] === 'object')) {
      preparedData[key] = JSON.stringify(preparedData[key]);
    }
  }

  const table = catalystApp.datastore().table(tableName);
  const inserted = await table.insertRow(preparedData);
  return inserted;
}

export const catalystDb = {
  getFirs: async () => {
    return await executeQuery('SELECT * FROM firs', 'firs');
  },
  
  getFirById: async (id) => {
    const results = await executeQuery(`SELECT * FROM firs WHERE id = '${id}'`, 'firs');
    return results[0] || null;
  },
  
  addFir: async (fir) => {
    await insertRow('firs', fir);
    return fir;
  },
  
  getAccused: async () => {
    return await executeQuery('SELECT * FROM accused', 'accused');
  },
  
  getAccusedById: async (id) => {
    const results = await executeQuery(`SELECT * FROM accused WHERE id = '${id}'`, 'accused');
    return results[0] || null;
  },
  
  getVictims: async () => {
    return await executeQuery('SELECT * FROM victims', 'victims');
  },
  
  getWitnesses: async () => {
    return await executeQuery('SELECT * FROM witnesses', 'witnesses');
  },
  
  getTransactions: async () => {
    return await executeQuery('SELECT * FROM transactions', 'transactions');
  },
  
  getHotspots: async () => {
    return await executeQuery('SELECT * FROM hotspots', 'hotspots');
  },
  
  getDemographics: async () => {
    const firs = await catalystDb.getFirs();
    const totalFirs = firs.length;
    const cyberCount = firs.filter((f) => f.type === 'Cyber Crime').length;
    const womenSafetyCount = firs.filter((f) => f.type === 'Women Safety').length;
    const financialCount = firs.filter((f) => f.type === 'Financial Crimes').length;
    const theftCount = firs.filter((f) => f.type === 'Theft').length;

    return {
      cyberCount,
      womenSafetyCount,
      financialCount,
      theftCount,
      totalCount: totalFirs
    };
  },
  
  getEvidence: async () => {
    return await executeQuery('SELECT * FROM evidence', 'evidence');
  },
  
  getPredictions: async () => {
    const results = await executeQuery('SELECT * FROM predictions', 'predictions');
    return results[0] || { forecast: [], alerts: [] };
  },
  
  getAuditLogs: async () => {
    return await executeQuery('SELECT * FROM audit_logs ORDER BY ROWID DESC', 'audit_logs');
  },
  
  addAuditLog: async (user, role, action, ip = '127.0.0.1') => {
    const log = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      role,
      action,
      ip
    };
    await insertRow('audit_logs', log);
    return log;
  }
};
