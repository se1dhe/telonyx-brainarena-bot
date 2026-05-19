# Changelog

## 2026-05-19

- Pulled latest monorepo updates from `origin/main`.
- Refactored the Telegram Mini App Home screen into feature components without changing the Roman Temple UI.
- Added typed frontend contracts for current mock/API shapes.
- Added Telegram WebApp runtime wrapper and `TelegramProvider` with safe browser fallback.
- Added frontend API client skeleton for `GET /api/public/config`.
- Added `apps/webapp/package-lock.json` so webapp installs can use `npm ci`.
- Configured Railway project resources for the target split: `brainarena-webapp`, `brainarena-api`, `brainarena-bot`, PostgreSQL, and Redis.
- Added `apps/webapp/railway.json` for app-scoped Railway deploys and allowed the new Railway preview host in Vite.
- Added MVP chapter/course API mock endpoints: `GET /api/courses`, `GET /api/courses/{courseSlug}/chapters`, and `GET /api/chapters/{chapterSlug}/map`.
- Fixed `apps/webapp/Dockerfile` so Railway can deploy the webapp from `apps/webapp` as the service root.
- Copied `vite.config.ts` into the webapp runtime image so `vite preview` keeps Railway `allowedHosts`.
- Removed the obsolete Railway service `brainarena-web` after `brainarena-webapp` became the canonical web service.
- Removed the stale root Railway config that forced Java services through `npm run build`.
- Configured `brainarena-api` and `brainarena-bot` Railway services to deploy with `RAILWAY_DOCKERFILE_PATH`.
- Verified the live API health endpoint and public config endpoint on Railway.
- Added configurable API CORS for the Railway webapp domain.
- Added a minimal Telegram long-polling bot runner with `/start` and a Mini App launch button.
- Connected the webapp chapter map to the live API with a local fallback for offline/dev mode.
- Deployed the updated webapp and verified the live mobile viewport in browser automation.
- Added `POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start` for the first playable chapter node.
- Added a Telegram-style quiz stage panel with answer feedback and local star preview.
- Added a Railway runtime API fallback for the webapp so production calls the live backend even when Vite build-time env is absent.
