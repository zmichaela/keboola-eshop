## keboola-eshop

Local development starter for a Keboola-connected web app that reads **Storage tables** via the Keboola Storage API.

### Prereqs

- Python 3.10+
- A Keboola Storage API token for your project (the token determines which project data you can access)

### Configure environment

Create `.env` (do not commit it) with:

```bash
KBC_URL=https://connection.keboola.com
KBC_TOKEN=your_storage_api_token
```

You mentioned your project dashboard is:

- `https://connection.keboola.com/admin/projects/10384/dashboard`

This app does not need the project ID explicitly; it only needs a token that has access to the project.

Optional:

```bash
KBC_DEFAULT_LIMIT=10
```

### Install deps

This project uses `pyproject.toml` so it can later deploy cleanly to Keboola Data Apps (`uv sync`).

```bash
cd /Users/michaelazajacova/keboola-projects/keboola-eshop
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e .
```

### Run locally

```bash
uvicorn keboola_eshop.app:app --reload --host 127.0.0.1 --port 8050
```

### Quick API connectivity check

This prints an HTTP status and a short response preview (don’t share your token).

```bash
python - <<'PY'
from dotenv import load_dotenv
load_dotenv(dotenv_path=".env")
import os, requests
url = os.environ["KBC_URL"].rstrip("/") + "/v2/storage/buckets"
r = requests.get(url, headers={"X-StorageApi-Token": os.environ["KBC_TOKEN"], "Accept":"application/json"}, timeout=30)
print("HTTP", r.status_code)
print(r.text[:300])
PY
```

Open:
- `http://127.0.0.1:8050/` (also accepts POST)
- `http://127.0.0.1:8050/api/health`
- `http://127.0.0.1:8050/api/buckets`
- `http://127.0.0.1:8050/api/tables`

