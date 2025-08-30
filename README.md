# Psalm Lawyer Assistant

> Developer-first, light-theme frontend for a **jurisdiction-aware legal AI**.
> **Disclaimer:** This software is an AI assistant and does **not** provide legal advice or create a solicitor–client relationship.

---

## Contents

* [Overview](#overview)
* [Requirements](#requirements)
* [Quick Start](#quick-start)
* [Environment](#environment)
* [Scripts](#scripts)
* [Project Structure](#project-structure)
* [Backend Expectations](#backend-expectations)
* [Common Tasks](#common-tasks)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## Overview

Psalm Lawyer Assistant is a modern Next.js app that talks to an OpenAI-style backend. It provides:

* **ChatGPT-style chat** (streaming, Stop/Regenerate, auto-title, edit & resend)
* **Legal presets** that start a new chat and **pre-fill** the composer
* **Document uploads** (PDF/DOCX/TXT/PNG) with citation pills when available
* **Voice → text** transcription for rapid prompt capture
* **Admin-only settings** gated by environment flags

Built for a clean, **light theme** with accessible UI and keyboard shortcuts.

---

## Requirements

* Node.js **18+**
* Package manager: **pnpm** (preferred) or npm/yarn
* Terminal: PowerShell, CMD, or bash

> **Windows tip (PowerShell):** if scripts are blocked, run once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

---

## Quick Start

```bash
# 1) install dependencies
# pnpm (recommended)
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
# OR npm
npm install

# 2) create a local env file (see "Environment")
#   .env.local

# 3) run the dev server
pnpm dev
# OR
npm run dev

# 4) open the app
# http://localhost:3000
```

**Production build (locally):**

```bash
pnpm build && pnpm start
# OR
npm run build && npm start
```

---

## Environment

Create **`.env.local`** in the project root:

```dotenv
# Base URL of your backend API (OpenAI-style).
# Leave empty in dev to use mock responses.
NEXT_PUBLIC_API_BASE_URL=

# Show admin settings in non-prod builds. Disable in production.
NEXT_PUBLIC_ENABLE_ADMIN=true

# Optional: SHA-256 hex of a passphrase for admin unlock in non-prod.
NEXT_PUBLIC_ADMIN_PASSHASH=
```

**Mock mode:** leaving `NEXT_PUBLIC_API_BASE_URL` empty enables safe mock responses so the UI is usable without a backend.

---

## Scripts

| Script      | Purpose                   |
| ----------- | ------------------------- |
| `dev`       | Start Next.js in dev mode |
| `build`     | Production build          |
| `start`     | Run the built app         |
| `lint`      | ESLint                    |
| `typecheck` | TypeScript checks         |

Examples:

```bash
pnpm dev
pnpm build && pnpm start
pnpm lint && pnpm typecheck
# or: npm run <script>
```

---

## Project Structure

```
app/                  # App Router pages (/ and /app)
components/           # UI (ChatCanvas, Sidebar, Composer, RightPanel, etc.)
hooks/                # Custom React hooks
lib/
  client.ts           # API client (chat stream, upload, transcription, health)
  presets.ts          # Legal presets (system + prefill)
  template.ts         # {{variable}} substitution
  store/              # Zustand stores (chats, composer, settings)
public/               # Static assets
styles/               # Tailwind styles/config
types/                # Shared TypeScript types
```

---

## Backend Expectations

Provide an OpenAI-style API with:

* `GET /health` → `{ ok: true }`
* `POST /v1/chat/completions`
  Accepts `model`, `messages`, `temperature`, `max_tokens`, optional `jurisdiction`, `attachments`.
  Supports **SSE** token streaming.
* `POST /v1/files` (multipart) → `{ id, name, mime, size }`
* `POST /v1/audio/transcriptions` (multipart `file`) → `{ text }`

Enable CORS for the frontend origin(s). Never embed secrets in the frontend.

---

## Common Tasks

* **Edit legal presets:** `lib/presets.ts` (update both `system` and `prefill`)
* **Jurisdiction defaults:** update the selector/store and pass value into chat calls
* **Hide admin in prod:** set `NEXT_PUBLIC_ENABLE_ADMIN=false` before deploying

---

## Troubleshooting

* **`next` not recognized / dev script fails**
  Install deps: `pnpm install` (or `npm install`).
  If still missing: `npm install next react react-dom`.

* **PowerShell blocks npm scripts**
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force`

* **Port already in use**
  `PORT=3001 pnpm dev` (or choose another port)

* **Streaming not working**
  Backend must send `text/event-stream` and allow your origin via CORS.

* **Uploads failing**
  Backend must accept multipart form data and permit your origin via CORS.

---

## License

TBD
