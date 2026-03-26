## keboola-eshop — getting started

This folder (`keboola-eshop/`) is a standalone project with its own git repository.

### What to open in Cursor

- If you open **this folder** (`keboola-eshop/`) in Cursor, the project skill is available because it lives in `.cursor/skills/…`.

### Skill: dataapp-deployment

Use this skill when deploying a web app to **Keboola Data Apps** (Docker, Nginx on 8888, Supervisord, `setup.sh`, `dataApp.secrets` env vars, SSE/WebSockets, and common deployment/debug scenarios).

Key triggers:
- Deploying to Keboola Data Apps
- Creating `keboola-config/` (Nginx + Supervisord)
- Debugging `Cannot POST /`, missing env var 500s, or buffered streaming

Where it lives in this project:

- `.cursor/skills/dataapp-deployment/SKILL.md`
- `.cursor/skills/dataapp-deployment/reference.md`

