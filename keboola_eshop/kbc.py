from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import requests


@dataclass(frozen=True)
class KbcConfig:
    url: str
    token: str


class KbcError(RuntimeError):
    pass


def load_kbc_config() -> KbcConfig:
    url = (os.environ.get("KBC_URL") or "").strip().rstrip("/")
    token = (os.environ.get("KBC_TOKEN") or "").strip()

    if not url:
        raise KbcError("Missing environment variable: KBC_URL")
    if not token:
        raise KbcError("Missing environment variable: KBC_TOKEN")

    return KbcConfig(url=url, token=token)


def _headers(cfg: KbcConfig) -> dict[str, str]:
    return {
        "X-StorageApi-Token": cfg.token,
        "Accept": "application/json",
        "User-Agent": "keboola-eshop-local/0.1.0",
    }


def kbc_get(cfg: KbcConfig, path: str, *, params: dict[str, Any] | None = None) -> Any:
    path = path if path.startswith("/") else f"/{path}"
    url = f"{cfg.url}{path}"

    try:
        resp = requests.get(url, headers=_headers(cfg), params=params, timeout=30)
    except requests.RequestException as e:
        raise KbcError(f"Keboola request failed: {e}") from e

    if resp.status_code >= 400:
        body_preview = resp.text[:500]
        raise KbcError(f"Keboola API error {resp.status_code} for {path}: {body_preview}")

    if not resp.content:
        return None

    try:
        return resp.json()
    except ValueError as e:
        raise KbcError(f"Non-JSON response from Keboola for {path}") from e


def list_buckets(cfg: KbcConfig) -> Any:
    return kbc_get(cfg, "/v2/storage/buckets")


def list_tables(cfg: KbcConfig) -> Any:
    return kbc_get(cfg, "/v2/storage/tables")

