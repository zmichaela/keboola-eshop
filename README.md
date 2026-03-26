## keboola-eshop

Local development starter for a Keboola-connected web app that reads **Storage tables** via the Keboola Storage API.

### Prereqs

- Node.js 18+ (Node 20+ recommended)
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

```bash
cd /Users/michaelazajacova/keboola-eshop
npm install
```

### Run locally

```bash
npm run dev
```

### Quick API connectivity check

This prints an HTTP status and a short response preview (don’t share your token).

```bash
node - <<'JS'
import "dotenv/config";

const url = (process.env.KBC_URL || "").replace(/\/+$/, "") + "/v2/storage/buckets";
const res = await fetch(url, { headers: { "X-StorageApi-Token": process.env.KBC_TOKEN, "Accept": "application/json" } });
console.log("HTTP", res.status);
console.log((await res.text()).slice(0, 300));
JS
```

Open:
- `http://127.0.0.1:8050/` (also accepts POST)
- `http://127.0.0.1:8050/api/hello`
- `http://127.0.0.1:8050/api/health`
- `http://127.0.0.1:8050/api/buckets`
- `http://127.0.0.1:8050/api/tables`

