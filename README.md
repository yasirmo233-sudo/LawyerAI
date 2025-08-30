Psalm Lawyer Assistant — Developer Setup

Developer-first, light-theme frontend for a jurisdiction-aware legal AI. Runs locally with Next.js and talks to any OpenAI-style backend (chat, files, transcription).

This README is for developers. It covers local setup, environment, scripts, and common fixes.

Requirements

Node.js 18+

Package manager: pnpm (preferred) or npm/yarn

A terminal (PowerShell, CMD, or bash)

First-Time Setup

On Windows PowerShell, if scripts are blocked, run once:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

1) Install dependencies

pnpm (recommended)

corepack enable
corepack prepare pnpm@latest --activate
pnpm install


or npm

npm install

2) Configure environment

Create a file named .env.local in the project root:

# Base URL of your backend API (OpenAI-style). Leave empty to use mock responses in dev.
NEXT_PUBLIC_API_BASE_URL=

# Show admin settings in non-prod builds only.
NEXT_PUBLIC_ENABLE_ADMIN=true

# Optional: SHA-256 hex of your passphrase for admin unlock in non-prod.
NEXT_PUBLIC_ADMIN_PASSHASH=

Run Locally

Dev server (hot reload)

pnpm dev
# or: npm run dev
# open http://localhost:3000


Production build

pnpm build
pnpm start
# or: npm run build && npm start

Scripts
pnpm dev         # start dev server
pnpm build       # production build
pnpm start       # run built app
pnpm lint        # lint
pnpm typecheck   # TypeScript checks


(Use npm run ... if using npm.)

Project Structure (high level)
app/                  # App Router pages (/ and /app)
components/           # UI (ChatCanvas, Sidebar, Composer, etc.)
hooks/                # custom React hooks
lib/
  client.ts           # API client (chat stream, upload, transcription, health)
  presets.ts          # legal presets (system + prefill)
  template.ts         # {{variable}} substitution
  store/              # Zustand stores (chats, composer, settings)
public/               # static assets
styles/               # Tailwind config/styles
types/                # shared TypeScript types

Backend Expectations (for real data)

GET /health → { ok: true }

POST /v1/chat/completions → SSE or JSON response; accepts messages, model, temperature, max_tokens, optional jurisdiction, attachments

POST /v1/files (multipart) → returns { id, name, mime, size }

POST /v1/audio/transcriptions (multipart file) → returns { text }

Leave NEXT_PUBLIC_API_BASE_URL empty to use safe mock responses in dev.

Common Tasks

Edit presets: lib/presets.ts (both system and prefill)

Jurisdiction defaults: check jurisdiction selector/store and ensure it’s passed into chat calls

Hide admin in prod: set NEXT_PUBLIC_ENABLE_ADMIN=false in production environments

Troubleshooting

next not recognized / dev script fails

Install deps: pnpm install (or npm install)

If still missing: npm install next react react-dom

PowerShell blocks npm scripts

Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force

Port in use

PORT=3001 pnpm dev (adjust port as needed)

SSE not streaming

Confirm backend sends text/event-stream and CORS allows the frontend origin

Uploads failing

Backend must accept multipart and allow your origin via CORS

Disclaimer

This software is an AI assistant and does not provide legal advice or create a solicitor-client relationship. Use responsibly.
