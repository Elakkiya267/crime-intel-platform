# KSP Crime Intelligence Platform (Datathon 2026)

This repo contains a production-ready **frontend** (React + TypeScript + Tailwind) for an AI-powered Crime Intelligence & Investigation Platform designed for **Karnataka State Police**.

> Note: Zoho Catalyst backend integration (Functions, Data Store, Signals, OCR/ML) requires Catalyst credentials and will be wired in `server/`.

## Local development

```bash
cd client
npm install
npm run dev
```

## Build

```bash
cd client
npm run build
```

## Zoho Catalyst Exclusive Deployment

This platform is configured specifically for **Zoho Catalyst** deployment (AppSail + Web Client Hosting).

- **Catalyst Project Name:** `datathon`
- **Catalyst Project ID (PID):** `54526000000013050`

### Build & Deploy Steps:

1. **Install Catalyst CLI (if not installed):**
   ```bash
   npm install -g zcatalyst-cli
   ```

2. **Login to Zoho Catalyst:**
   ```bash
   catalyst login
   ```

3. **Build the Web Client:**
   ```bash
   npm run build
   ```

4. **Deploy to Zoho Catalyst:**
   ```bash
   catalyst deploy
   ```

For detailed schema setup, QuickML configuration, and Zia OCR details, refer to [`docs/CATALYST_DEPLOY.md`](file:///c:/Users/admin/Desktop/crime-intel-platform/docs/CATALYST_DEPLOY.md).


