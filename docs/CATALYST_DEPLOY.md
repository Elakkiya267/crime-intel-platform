# Zoho Catalyst Deployment & Integration Guide

This guide outlines how to deploy the Karnataka State Police (KSP) Crime Intelligence & Investigation Platform to **Zoho Catalyst** and configure the required Catalyst Services.

By utilizing the hybrid adapter layer built into the backend, the application remains 100% testable locally (using SQLite, MongoDB, and Groq APIs) but will automatically route operations to **Zoho Catalyst Services** when deployed in the cloud.

---

## 1. Capabilities Mapping Table

| Feature / Capability | Implementation in this Platform | Required Catalyst Service |
| :--- | :--- | :--- |
| **Serverless backend / logic** | Express server in `server/` | **Catalyst AppSail** (Managed Runtime) |
| **Frontend / SPA / static site** | React built to `client/dist/` | **Catalyst Web Client Hosting** |
| **Relational Database** | IPC/District stats (`ka_ipc_crimes`, `district_crimes`) | **Catalyst Data Store** (ZCQL queries) |
| **NoSQL / Document Store** | FIRs, Accused, Hotspots, Transactions, Audit Logs | **Catalyst Data Store** (ZCQL / JSON serialization) |
| **User auth / signup / login** | Email/Password login endpoints | **Catalyst Data Store / Auth** |
| **Text LLMs / RAG / Chatbot** | SQLite text-to-SQL & report compiler | **Catalyst QuickML (LLM Serving, RAG)** |
| **OCR / Forensic Vision** | Evidence image uploads scanning | **Catalyst Zia Services (OCR)** |
| **File / Evidence Storage** | Blob uploads (CCTV, receipts) | **Catalyst Stratus** (Object/blob storage) |

---

## 2. Onboarding & Local Initialization

Follow these steps to connect your local environment to the newly created Catalyst project:

### Step 1: Install Catalyst CLI
Install the CLI globally on your system:
```bash
npm install -g zcatalyst-cli
```

### Step 2: Login to Zoho Catalyst
Log in to your Zoho account via the CLI:
```bash
catalyst login
```
*(Select the correct domain, e.g., `.in` for India or `.com` for US depending on where your project was created).*

### Step 3: Initialize the Project Space
From the root of this repository, link the codebase to your Catalyst project space:
```bash
catalyst init
```
1. Select your Catalyst project named **datathon**.
2. For components, check **Client** and **AppSail**.
3. For Client directory, specify `client/dist`.
4. For AppSail service, select Node.js runtime and specify `server`.

The CLI will verify the configuration files (`catalyst.json` and `server/app-config.json`).

---

## 3. Database Schema Setup (Data Store)

Since you have created a clean project, you must set up the tables in the **Catalyst Data Store Console** (`Zoho Catalyst Console > Database > Data Store`). 

Create the following tables and their matching columns:

### 1. `users` (Authentication & Profile)
*   `email` (VarChar, Unique, Required)
*   `password` (VarChar, Required)
*   `name` (VarChar, Required)
*   `role` (VarChar, Required)

### 2. `firs` (Case Files)
*   `id` (VarChar, Primary Key)
*   `title` (VarChar)
*   `description` (Text)
*   `type` (VarChar)
*   `status` (VarChar)
*   `severity` (VarChar)
*   `date` (VarChar)
*   `time` (VarChar)
*   `location` (VarChar)
*   `district` (VarChar)
*   `policeStation` (VarChar)
*   `modusOperandi` (Text)
*   `accusedIds` (Text - Serialized JSON Array)
*   `victimIds` (Text - Serialized JSON Array)
*   `witnessIds` (Text - Serialized JSON Array)
*   `evidenceIds` (Text - Serialized JSON Array)

### 3. `accused` (Suspect Profiles)
*   `id` (VarChar, Primary Key)
*   `name` (VarChar)
*   `age` (Integer)
*   `gender` (VarChar)
*   `education` (VarChar)
*   `occupation` (VarChar)
*   `socioEconomic` (VarChar)
*   `district` (VarChar)
*   `address` (Text)
*   `modusOperandi` (Text)
*   `riskScore` (Integer)
*   `riskLevel` (VarChar)
*   `priorArrests` (Integer)
*   `criminalHistory` (Text - Serialized JSON Array)
*   `bankAccounts` (Text - Serialized JSON Array)
*   `networkTies` (Text - Serialized JSON Array)

### 4. `hotspots` (Crime Hotspots)
*   `id` (VarChar, Primary Key)
*   `district` (VarChar)
*   `area` (VarChar)
*   `lat` (Double)
*   `lng` (Double)
*   `density` (Integer)
*   `riskLevel` (VarChar)
*   `primaryType` (VarChar)
*   `recommendation` (Text)

### 5. `transactions` (Financial Crime Ledger)
*   `id` (VarChar, Primary Key)
*   `sourceAccount` (VarChar)
*   `destAccount` (VarChar)
*   `amount` (Double)
*   `date` (VarChar)
*   `type` (VarChar)
*   `status` (VarChar)
*   `flagged` (Integer: 0 or 1)
*   `notes` (Text)

### 6. `audit_logs` (Security Trail)
*   `timestamp` (VarChar)
*   `user` (VarChar)
*   `role` (VarChar)
*   `action` (Text)
*   `ip` (VarChar)

---

## 4. AI Services Configuration

### A. Catalyst Zia Services (OCR & Vision Scanner)
The evidence file scanner uses **Zia Services (Optical Character Recognition)**.
*   **Configuration:** No manual setup is needed! Zia's OCR is pre-activated for all Catalyst projects.
*   **Behavior:** When an image (e.g., CCTV grab, vehicle receipt) is uploaded in the AI Copilot Chat, the server writes it temporarily, extracts the textual data via `app.zia().extractOpticalCharacters()`, and appends findings to the RAG query.

### B. Catalyst QuickML Model Pipeline (LLM & RAG Chat)
The Text-to-SQL engine and report compiling capabilities can be routed to a **QuickML Model Pipeline**:
1. Train/create a model or pipeline inside `Catalyst Console > AI Services > QuickML`.
2. Deploy the pipeline to obtain an **Endpoint URL/Key**.
3. Set the environment variable `QUICKML_ENDPOINT_KEY` in the AppSail console:
   * **Console Path:** `AppSail > ksp-crime-intel-server > Environment Variables`
   * **Key:** `QUICKML_ENDPOINT_KEY`
   * **Value:** `<your-published-endpoint-key>`

---

## 5. Deployment Commands

Follow these steps to deploy the application:

### Step 1: Compile the Frontend Client
Run the Vite typescript and react compiler to generate `client/dist/`:
```bash
cd client
npm install
npm run build
```
*(Vite automatically moves the `client-package.json` static manifest from `client/public/` to `client/dist/client-package.json` during this step).*

### Step 2: Deploy to Zoho Catalyst
Navigate back to the project root directory and deploy all services:
```bash
cd ..
catalyst deploy
```
This single command uploads the built React SPA to **Web Client Hosting** and runs the Node.js Express server on **AppSail**. The console will return the live deployment URLs.
