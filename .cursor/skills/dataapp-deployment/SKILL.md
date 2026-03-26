---
name: dataapp-deployment
description: Deploys and debugs web apps on Keboola Data Apps using the keboola/data-app-python-js base image. Use when setting up keboola-config/ (Nginx + Supervisord), handling POST-to-/ startup checks, enabling SSE/WebSocket streaming through Nginx, mapping dataApp.secrets to env vars, or troubleshooting issues like Cannot POST /, 500s from missing env vars, and buffered streams.
---

# Deploying Web Apps to Keboola Data Apps

Use this skill when deploying any web app (Node.js, Python, or any language) to **Keboola Data Apps** with the `keboola/data-app-python-js` base image, or when debugging common deployment failures.

## Quick start checklist

- **Ports**: Nginx must listen on **8888**. Your app can listen on any internal port (common: 8050/3000/5000).
- **Required config files**:
  - `keboola-config/nginx/sites/*.conf` (at least one)
  - `keboola-config/supervisord/services/*.conf` (at least one; define only your app processes)
  - `keboola-config/setup.sh` (runs on startup; install dependencies here)
- **Root route must accept POST**: Keboola sends a **POST to `/`** on startup; your app must handle it.
- **Python packaging (critical)**:
  - Prefer `uv sync` (not `pip install`) in `setup.sh`
  - Prefix Python run commands with `uv run` in Supervisord
  - Ensure your Python app has a `pyproject.toml` with `[project.dependencies]`
- **Streaming**:
  - **WebSockets**: add upgrade headers in Nginx location `/`
  - **SSE/long-poll**: disable buffering (`proxy_buffering off; proxy_request_buffering off;`)
- **Secrets**: `dataApp.secrets` are exported as environment variables; ensure missing vars are added to `dataApp.secrets`.

## Deployment workflow (recommended)

1. **Confirm app start command** (what Supervisord will run). Test the same command locally.
2. **Create `keboola-config/`**:
   - Nginx `server { listen 8888; ... proxy_pass http://127.0.0.1:<app-port>; }`
   - Supervisord `[program:app] command=...`
   - `setup.sh` installs deps (`uv sync` for Python, `npm install` for Node).
3. **Make root route robust**:
   - Express: `app.all('/')`
   - Flask/FastAPI: allow `POST` on `/` (not just `GET`)
4. **Handle streaming correctly**:
   - Add WebSocket upgrade headers for Streamlit/WS apps.
   - Add a dedicated streaming location with buffering disabled for SSE.
5. **Debug using symptoms**:
   - `Cannot POST /` → root route doesn’t accept POST
   - `500` → usually missing env var (add to `dataApp.secrets`)
   - Stream arrives “all at once” → Nginx buffering (turn off)
   - Restart loop → failing `setup.sh`, wrong Supervisord path, missing `uv run`, or port mismatch

## Common patterns (copy/paste)

- **Nginx reverse proxy**: listen `8888`, proxy to `127.0.0.1:<app-port>`
- **WebSockets**: `proxy_http_version 1.1` + `Upgrade`/`Connection` headers + long `proxy_read_timeout`
- **SSE**: `proxy_buffering off; proxy_cache off; proxy_request_buffering off;`
- **Supervisord**: use absolute `/app/...` paths; log to stdout/stderr; do **not** manage Nginx via Supervisord

## Full reference

For complete details, config examples, and troubleshooting, see [reference.md](reference.md).
