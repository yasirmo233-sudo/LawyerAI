Psalm Lawyer Assistant

Developer-first, light-theme frontend for a jurisdiction-aware legal AI.

Disclaimer: This software is an AI assistant and does not provide legal advice or create a solicitor–client relationship.

Table of Contents

Overview

Requirements

Quick Start (Local Dev)

Environment

Scripts

Project Structure

Backend Expectations

Common Tasks

Troubleshooting

License

Overview

Psalm Lawyer Assistant is a modern Next.js frontend that connects to any OpenAI-style backend for:

Chat with streaming replies (ChatGPT-like UX)

Document uploads (PDF/DOCX/TXT/PNG) and citation rendering

Voice → text transcription for quick prompt capture
It ships with jurisdiction-aware prompts and legal presets that start a new chat and pre-fill the composer for structured workflows.

Requirements

Node.js 18+

Package manager: pnpm (preferred) or npm/yarn

A terminal (PowerShell, CMD, or bash)

Windows/PowerShell tip: if scripts are blocked, run once:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

Quick Start (Local Dev)
# 1) install dependencies
# pnpm (recommended)
corepack enable
corepack prepare pnpm@latest --activate
pnpm install

# OR npm
npm install

# 2) create local env file (see "Environment")
# macOS/Linux:
cp .env.local.example .env.local  # if present, else create manually
# Windows (PowerShell):
Copy-Item .env.local.example .env.local -ErrorAction SilentlyContinue

# 3) run the dev server
pnpm dev
# or: npm run dev

# 4) open the app
# http://localhost:3000


Production build (locally):

pnpm build && pnpm start
# or: npm run build && npm start

Environment

Create a file named .env.local in the project root:

# Base URL of your backend API (OpenAI-style).
# Leave empty in dev to use safe mock responses.
NEXT_PUBLIC_API_BASE_URL=

# Show the admin settings UI in non-prod builds only.
NEXT_PUBLIC_ENABLE_ADMIN=true

# Optional: SHA-256 hex of a passphrase for admin unlock in non-prod.
NEXT_PUBLIC_ADMIN_PASSHASH=


Mock mode:
If NEXT_PUBLIC_API_BASE_URL is empty, the app streams mock responses so you can test the UI without a backend.

Admin UI:
Set NEXT_PUBLIC_ENABLE_ADMIN=false in production builds. Admin is for tweaking endpoint/model/params during development.

Scripts
pnpm dev         # start dev server (hot reload)
pnpm build       # production build
pnpm start       # run the built app
pnpm lint        # lint
pnpm typecheck   # TypeScript checks


(Use npm run ... if you prefer npm.)

Project Structure
app/                  # App Router pages (/ and /app)
components/           # UI components (ChatCanvas, Sidebar, Composer, RightPanel, etc.)
hooks/                # React hooks
lib/
  client.ts           # API client (chat stream, upload, transcription, health)
  presets.ts          # Legal presets (system + prefill)
  template.ts         # {{variable}} substitution
  store/              # Zustand stores (chats, composer, settings)
public/               # Static assets
styles/               # Tailwind config/styles
types/                # Shared TypeScript types

Backend Expectations

Your backend should expose OpenAI-style endpoints:

GET /health → { ok: true }

POST /v1/chat/completions
Body includes model, messages, temperature, max_tokens, and optional jurisdiction, attachments.
Should support SSE token streaming.

POST /v1/files (multipart) → returns { id, name, mime, size }

POST /v1/audio/transcriptions (multipart file) → returns { text }

Enable CORS for your frontend origin(s). Never embed secrets in the frontend.

Common Tasks

Edit legal presets: lib/presets.ts (update both system and prefill)

Jurisdiction defaults: adjust selector/store and pass value into chat calls

Hide admin in prod: set NEXT_PUBLIC_ENABLE_ADMIN=false in production

Troubleshooting

next not recognized / dev script fails

Install dependencies: pnpm install (or npm install)

If still missing: npm install next react react-dom

PowerShell blocks npm scripts

Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force

Port already in use

PORT=3001 pnpm dev (or set another port)

Streaming not working

Backend must send text/event-stream and allow your origin via CORS

Uploads failing

Backend must accept multipart form data and permit your origin via CORS

License

TBD
