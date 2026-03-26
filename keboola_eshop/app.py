from __future__ import annotations

import os

from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .kbc import KbcError, list_buckets, list_tables, load_kbc_config


# Be explicit about .env discovery; stack-based discovery can fail in some contexts.
load_dotenv(find_dotenv(usecwd=True))

app = FastAPI(title="keboola-eshop")


@app.exception_handler(KbcError)
def _kbc_error_handler(_request, exc: KbcError):
    return JSONResponse(status_code=500, content={"error": str(exc)})


@app.api_route("/", methods=["GET", "POST"])
def root():
    # Keboola Data Apps sends POST / on startup; accept it locally too.
    return {
        "name": "keboola-eshop",
        "status": "ok",
        "kbc_url": os.environ.get("KBC_URL"),
        "has_kbc_token": bool(os.environ.get("KBC_TOKEN")),
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/buckets")
def buckets():
    cfg = load_kbc_config()
    return {"buckets": list_buckets(cfg)}


@app.get("/api/tables")
def tables():
    cfg = load_kbc_config()
    return {"tables": list_tables(cfg)}

