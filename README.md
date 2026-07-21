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

## Deploy to Zoho Catalyst

1. Create a Catalyst AppSail/Static Hosting entry (or hosting configured for a SPA build).
2. Upload the `dist/` output.
3. Set environment variables for API base URL and auth.

See `docs/CATALYST_DEPLOY.md`.

