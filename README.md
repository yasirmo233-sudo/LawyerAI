# Psalm Lawyer Assistant

Developer-first, light-theme frontend for a jurisdiction-aware legal AI. Built with Next.js and designed to talk to any OpenAI-style backend (chat, file upload, transcription).

> **Note:** This README is for developers. It covers local setup, scripts, environment, and expectations for the backend API.

---

## Requirements

* Node.js **18+**
* A package manager: **pnpm** (preferred), or npm/yarn
* (Optional) An API endpoint that speaks OpenAI-style chat + file + transcription

---

## Quick Start (Local Dev)

```bash
# 1) install deps
pnpm install
# or: npm install

# 2) set local environment
cp .env.local.example .env.local  # if you have an example file
# otherwise create .env.local (see "Environment" section below)

# 3) run dev server
pnpm dev
# or: npm run dev

# 4) open the app
# http://localhost:3000
```

---

## Environment

Create a `.env.local` in the project root:

```bash
# Base URL of your backend API (OpenAI-style). Leave empty to use mock responses.
NEXT_PUBLIC_API_BASE_URL=

# Hide admin UI in production; enable only in local or preview builds.
NEXT_PUBLIC_ENABLE_ADMIN=true

# Optional: SHA-256 hex of a passphrase for unlocking admin in non-prod.
NEXT_PUBLIC_ADMIN_PASSHASH=
```

**Mock mode:**
If `NEXT_PUBLIC_API_BASE_URL` is empty, the app streams safe mock responses so you can test UI flows without a backend.

**Admin UI:**
Keep `NEXT_PUBLIC_ENABLE_ADMIN=false` in production. Admin allows configuring endpoint, model, and params for testing.

---

## Scripts

```bash
pnpm dev           # run Next.js dev server
pnpm build         # production build
pnpm start         # run the built app
pnpm lint          # lint
pnpm typecheck     # TypeScript check
```

(Use `npm run ...` if you prefer npm.)

---

## Project Structure

```
app/                  # App Router pages (/ and /app)
components/           # UI components (ChatCanvas, Sidebar, Composer, etc.)
hooks/                # React hooks
lib/
  client.ts           # API client (chat stream, file upload, transcription, health)
  presets.ts          # Legal presets (system + prefill)
  template.ts         # {{variable}} substitution
  store/              # Zustand stores (chats, composer, settings)
public/               # static assets
styles/               # global styles / Tailwind
types/                # shared TypeScript types
```

---

## Backend Expectations (for real data)

Your backend should expose endpoints compatible with an OpenAI-style interface:

* `GET /health` → `{ ok: true }`
* `POST /v1/chat/completions`
  Body includes `model`, `messages`, `temperature`, `max_tokens`, optional `jurisdiction` and `attachments`.
  Supports **SSE** token streaming.
* `POST /v1/files` (multipart) → returns `{ id, name, mime, size }`
* `POST /v1/audio/transcriptions` (multipart `file`) → returns `{ text }`

Enable CORS for your frontend origin(s). Do not embed secrets in the frontend; issue tokens server-side if needed.

---

## Common Tasks

* **Change presets**: edit `lib/presets.ts` (both `system` and `prefill`).
* **Jurisdiction defaults**: see your jurisdiction store or selector component; pass value into chat calls.
* **Admin gating**: hide or show via `NEXT_PUBLIC_ENABLE_ADMIN`.

---

## Troubleshooting

* **Port already in use**: stop the other process or run `PORT=3001 pnpm dev`.
* **Streaming not working**: confirm server sends SSE and CORS allows `text/event-stream`.
* **Uploads blocked**: verify backend accepts multipart, CORS, and size limits.
* **Windows shell quirks**: use PowerShell-friendly commands for file ops.

---

## License

Add your license file and notices here.

---

**Disclaimer:** This software is an AI assistant and does not provide legal advice or create a solicitor-client relationship.
