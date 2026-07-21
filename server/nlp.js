import { sqliteChatDb } from './db/sqlite.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCatalystApp } from './db/catalyst-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt instructing Llama to translate natural language questions to SQLite SELECT statements
const SQL_AGENT_PROMPT = `
You are the database retrieval agent for the Karnataka State Police (KSP) Crime Intelligence Platform.
Your task is to translate a user's natural language question into a single, valid SQLite SELECT query.

Here is the database schema:

1. Table: "firs" (Official mock FIR / Case records)
   Columns: id (TEXT PRIMARY KEY), title (TEXT), description (TEXT), type (TEXT), status (TEXT), severity (TEXT), date (TEXT), time (TEXT), location (TEXT), district (TEXT), policeStation (TEXT), modusOperandi (TEXT)

2. Table: "accused" (Suspect profiles)
   Columns: id (TEXT PRIMARY KEY), name (TEXT), age (INTEGER), gender (TEXT), education (TEXT), occupation (TEXT), socioEconomic (TEXT), district (TEXT), address (TEXT), modusOperandi (TEXT), riskScore (INTEGER), riskLevel (TEXT), priorArrests (INTEGER)

3. Table: "hotspots" (Crime prone zones)
   Columns: id (TEXT PRIMARY KEY), district (TEXT), area (TEXT), lat (REAL), lng (REAL), density (INTEGER), riskLevel (TEXT), primaryType (TEXT), recommendation (TEXT)

4. Table: "transactions" (Financial money transfers)
   Columns: id (TEXT PRIMARY KEY), sourceAccount (TEXT), destAccount (TEXT), amount (REAL), date (TEXT), type (TEXT), status (TEXT), flagged (INTEGER), notes (TEXT)

5. Table: "district_crimes" (Real 2025 Karnataka State Police district-wise crime statistics)
   Columns: id (INTEGER PRIMARY KEY), district (TEXT), ipcCrimes (INTEGER), sllCrimes (INTEGER), range (TEXT)
   IMPORTANT RULES for district_crimes:
   - This table represents ONLY 2025 crime counts. There is NO year column.
   - The 'range' column contains police ranges (e.g. 'Commissionerates', 'Central Range', 'Eastern Range', etc.). It does NOT represent the year.
   - NEVER filter by: range = '2025' or range = 2025.
   - For Bengaluru, always do a wild search: district LIKE '%Bengaluru%'.

6. Table: "ka_ipc_crimes" (Real 2025 Karnataka category-wise crime heads)
   Columns: id (INTEGER PRIMARY KEY), head (TEXT), subhead (TEXT), crimeCount (INTEGER)
   - Ex: head = 'Murder', subhead = 'Over Property Dispute', crimeCount = 24.
   - Use this table for questions about specific crime heads (e.g. counts of Dowry deaths, Rape, Burglary, Robbery, Riots, Cheating, Forgery, Negligent acts, etc.).

Rules:
- Generate ONLY a valid SQLite SELECT query.
- Use LIKE operator for string matching (e.g. district LIKE '%Bengaluru%' or name LIKE '%Manjunath%').
- For repeat/habitual offenders, filter: priorArrests >= 2.
- For flagged transactions, filter: flagged = 1.
- The database spelling for the capital is always 'Bengaluru' (or 'Bengaluru City' / 'Bengaluru Rural'). If the query asks about 'Bangalore', you MUST search using 'Bengaluru' (e.g. district LIKE '%Bengaluru%' or area LIKE '%Bengaluru%'). Never generate SQL containing the spelling 'Bangalore'.
- If the query mentions 'Karnataka' (or asks about the whole state), DO NOT filter by district = 'Karnataka'. Instead, query across all records (e.g. SELECT * FROM hotspots ORDER BY density DESC LIMIT 1) since Karnataka is the state containing all districts.
- Keep queries read-only.
- If the query is a general greeting or does not require database records, output "SELECT 1" as the SQL.
- Return ONLY a JSON object matching this schema:
{
  "reasoning": "Brief explanation of what table/filter is selected",
  "sql": "SELECT ... FROM ... WHERE ..."
}
`;

// System prompt instructing Llama to write a final bilingual report based on retrieved rows
const FINAL_RESPONSE_PROMPT = `
You are the KSP AI Copilot, an official intelligence assistant for the Karnataka State Police.
Your task is to draft a comprehensive, structured response based on the SQL query results retrieved from the SQLite database.

Rules:
- Format the response in clear, professional Markdown.
- If the user prefers Kannada (or queries in Kannada), write the "response" text in Kannada. Otherwise, write in English.
- If the SQL query retrieved rows from "district_crimes" or "ka_ipc_crimes", explicitly state in the response that these are the **Official 2025 Karnataka State Police Crime Registry statistics** for the queried district or category.
- Summarize the statistics in a clean Markdown table.
- Provide citations to link specific data nodes on the UI:
  - Cases: use type="case", url="/fir?id=CASE_ID"
  - Suspects: use type="accused", url="/accused?id=SUSPECT_ID"
  - Hotspots: use type="hotspot", url="/hotspots?id=ZONE_ID"
  - Transactions: use type="transaction", url="/financial-crimes?txn=TXN_ID"
- Return ONLY a JSON object matching this schema:
{
  "response": "Detailed markdown explanation of the answer, including real statistics if retrieved",
  "citations": [
    {
      "type": "case" | "accused" | "hotspot" | "transaction",
      "label": "Brief label e.g., 'FIR KSP/2026/04431' or 'Accused Manjunath'",
      "url": "Associated path as defined in rules",
      "status": "Short status indicator e.g. 'Open', '78% Risk', 'Flagged'"
    }
  ],
  "reasoningPath": [
    "Step 1: Analyzed user question",
    "Step 2: Executed SQL query: SELECT ...",
    "Step 3: Compiled database records..."
  ]
}
`;

/**
 * Call Groq Chat Completions API
 */
async function callGroqAPI(messages, model = 'llama-3.1-8b-instant', jsonMode = true) {
  const payload = {
    model,
    messages,
    temperature: 0.1
  };
  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const res = await fetch(GROQ_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || '{}';
}

/**
 * Run optical character extraction (OCR) via Catalyst Zia Services
 */
async function runZiaOcr(base64Image) {
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;
  const buffer = Buffer.from(cleanBase64, 'base64');
  
  const tempDir = path.join(__dirname, 'temp_ocr');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempFilePath = path.join(tempDir, `ocr_${Date.now()}.jpg`);
  fs.writeFileSync(tempFilePath, buffer);
  
  try {
    const app = getCatalystApp();
    const zia = app.zia();
    const stream = fs.createReadStream(tempFilePath);
    const result = await zia.extractOpticalCharacters(stream);
    return result.text || '[OCR returned empty text]';
  } catch (err) {
    console.error('Zia OCR execution failed:', err);
    throw err;
  } finally {
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (_) {}
  }
}

/**
 * Multimodal Image analysis using Llama-3.2-Vision (local fallback)
 */
async function analyzeImageWithVision(base64Image, query) {
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image 
    : `data:image/jpeg;base64,${base64Image}`;

  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: `You are the KSP forensic vision assistant. Analyze this uploaded crime evidence image (e.g. CCTV grab, receipt scan, suspect photo) and answer this question: ${query}` },
        { type: 'image_url', image_url: { url: cleanBase64 } }
      ]
    }
  ];

  try {
    return await callGroqAPI(messages, 'llama-3.2-11b-vision-preview', false);
  } catch (err) {
    console.error('Vision analysis error:', err);
    return `[Failed to run Llama Vision scanner: ${err.message}]`;
  }
}

/**
 * Dual agent call: Uses Catalyst QuickML if configuration exists, otherwise falls back to Groq Llama
 */
async function callAgentAPI(messages, systemPrompt, jsonMode = true) {
  const app = getCatalystApp();
  const endpointKey = process.env.QUICKML_ENDPOINT_KEY;

  if (app && endpointKey) {
    try {
      const quickml = app.quick_ml();
      const result = await quickml.predict(endpointKey, {
        systemPrompt,
        messages,
        jsonMode
      });
      return typeof result === 'string' ? result : JSON.stringify(result);
    } catch (err) {
      console.error('QuickML call failed. Falling back to Groq API.', err);
    }
  }

  // Fallback: merge system prompt into messages for Groq API
  const mergedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];
  return await callGroqAPI(mergedMessages, 'llama-3.1-8b-instant', jsonMode);
}

export async function compileQuery(query, language = 'english', file = null) {
  const logs = [];
  logs.push(`Initiating agentic RAG query pipeline (Language: ${language})`);

  let finalQueryText = query;
  let visionSummary = null;

  // 1. Process Multimodal uploads if present
  if (file) {
    logs.push(`Attached file detected: "${file.name}" (Mime: ${file.type})`);
    if (file.type.startsWith('image/')) {
      if (getCatalystApp()) {
        logs.push(`Calling Catalyst Zia Services OCR to scan evidence image...`);
        try {
          visionSummary = await runZiaOcr(file.base64);
          logs.push(`Zia OCR scan complete.`);
          finalQueryText = `[User attached evidence photo. Zia OCR scanned text findings: ${visionSummary}]\nUser Question: ${query}`;
        } catch (err) {
          logs.push(`Zia OCR failed: ${err.message}. Falling back to Groq Vision...`);
          visionSummary = await analyzeImageWithVision(file.base64, query);
          finalQueryText = `[User attached evidence photo. Visual Analysis findings: ${visionSummary}]\nUser Question: ${query}`;
        }
      } else {
        logs.push(`Calling Groq Llama-3.2-Vision to scan image nodes...`);
        visionSummary = await analyzeImageWithVision(file.base64, query);
        logs.push(`Vision analysis complete.`);
        finalQueryText = `[User attached evidence photo. Visual Analysis findings: ${visionSummary}]\nUser Question: ${query}`;
      }
    } else {
      // Decode document text file
      try {
        let rawText = '';
        if (file.base64.includes('base64,')) {
          rawText = Buffer.from(file.base64.split('base64,')[1], 'base64').toString('utf8');
        } else {
          rawText = Buffer.from(file.base64, 'base64').toString('utf8');
        }
        logs.push(`Extracted text from uploaded document: "${file.name}"`);
        finalQueryText = `[User attached document named "${file.name}". Document content:\n${rawText.substring(0, 2000)}]\nUser Question: ${query}`;
      } catch (docErr) {
        logs.push(`Failed to parse text document: ${docErr.message}`);
      }
    }
  }

  // 2. Step 1: Text-to-SQL Agent Translation
  logs.push('Executing SQL Generation Agent...');
  let sqlResponse;
  try {
    const messages = [
      { role: 'user', content: `Analyze this prompt and write a SQLite query: "${finalQueryText}"` }
    ];
    const rawJson = await callAgentAPI(messages, SQL_AGENT_PROMPT);
    sqlResponse = JSON.parse(rawJson);
    logs.push(`SQL Generated: "${sqlResponse.sql}" (Reasoning: ${sqlResponse.reasoning})`);
  } catch (err) {
    console.error('SQL generation failed:', err);
    logs.push(`SQL generation failed: ${err.message}. Falling back to default query.`);
    sqlResponse = { sql: 'SELECT * FROM firs LIMIT 5', reasoning: 'Fallback' };
  }

  // 3. Step 2: Query Execution / Data Retrieval
  let dbRows = [];
  let sqlToExecute = sqlResponse.sql || 'SELECT 1';

  // Auto-correct spelling mismatch from Bangalore -> Bengaluru
  if (sqlToExecute.toLowerCase().includes('bangalore')) {
    logs.push(`Detected 'Bangalore' spelling in generated SQL query. Auto-correcting to 'Bengaluru' for database compatibility.`);
    sqlToExecute = sqlToExecute.replace(/Bangalore/ig, 'Bengaluru');
  }

  logs.push(`Executing SQL query against SQLite database...`);
  try {
    dbRows = await sqliteChatDb.executeSQL(sqlToExecute);
    logs.push(`Database retrieved ${dbRows.length} matching rows.`);
  } catch (err) {
    console.error('Database execution failed:', err);
    logs.push(`Database execution failed: ${err.message}. Falling back to default list.`);
    try {
      dbRows = await sqliteChatDb.executeSQL('SELECT * FROM firs LIMIT 3');
    } catch (_) {}
  }

  // 4. Step 3: Response Drafting via LLM
  logs.push('Compiling final report with RAG database context...');
  let finalResponseJson = { response: '', citations: [], reasoningPath: [] };
  try {
    const contextText = JSON.stringify(dbRows, null, 2);
    const userPromptContent = `
User Query: ${finalQueryText}
Language Preference: ${language}
SQL Executed: ${sqlResponse.sql}
Retrieved Database Rows (Context):
\`\`\`json
${contextText}
\`\`\`
`;
    const messages = [
      { role: 'user', content: userPromptContent }
    ];
    const rawReportJson = await callAgentAPI(messages, FINAL_RESPONSE_PROMPT);
    finalResponseJson = JSON.parse(rawReportJson);
  } catch (err) {
    console.error('Report compilation failed:', err);
    finalResponseJson = {
      response: `I compiled the records but failed to format the response. Found ${dbRows.length} items.`,
      citations: [],
      reasoningPath: []
    };
  }

  // Merge reasoning logs
  const mergedReasoning = [
    ...logs,
    ...(finalResponseJson.reasoningPath || [])
  ];

  return {
    response: finalResponseJson.response,
    citations: finalResponseJson.citations || [],
    reasoningPath: mergedReasoning
  };
}
