## keboola-eshop — getting started

This folder (`keboola-eshop/`) is a standalone project **inside** the git repo at `/Users/michaelazajacova/keboola-projects/`.

### What to open in Cursor

- If you open **this folder** (`keboola-eshop/`) in Cursor, the project skill is available because it lives in `keboola-eshop/.cursor/skills/…`.
- If you open the **repo root** (`keboola-projects/`) in Cursor, the repo-wide skill is available from `.cursor/skills/…`.

### Skill: dataapp-deployment

Use this skill when deploying a web app to **Keboola Data Apps** (Docker, Nginx on 8888, Supervisord, `setup.sh`, `dataApp.secrets` env vars, SSE/WebSockets, and common deployment/debug scenarios).

Key triggers:
- Deploying to Keboola Data Apps
- Creating `keboola-config/` (Nginx + Supervisord)
- Debugging `Cannot POST /`, missing env var 500s, or buffered streaming

Where it lives in this project:

- `keboola-eshop/.cursor/skills/dataapp-deployment/SKILL.md`
- `keboola-eshop/.cursor/skills/dataapp-deployment/reference.md`

