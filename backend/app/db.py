"""SQLite storage for signed-in users and their synced practice sessions.

Anonymous users never touch the database; their history lives in the
browser's localStorage.
"""
from __future__ import annotations

import json
import sqlite3
import time
from contextlib import contextmanager
from typing import Iterator

from app.config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    picture TEXT,
    created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
    user_id TEXT NOT NULL,
    id TEXT NOT NULL,
    kind TEXT NOT NULL,
    score REAL,
    created_at REAL NOT NULL,
    data TEXT NOT NULL,
    PRIMARY KEY (user_id, id)
);
"""


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(settings.db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA)


def upsert_user(uid: str, email: str, name: str, picture: str) -> dict:
    with connect() as conn:
        conn.execute(
            """INSERT INTO users (id, email, name, picture, created_at)
               VALUES (?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET email=excluded.email,
                 name=excluded.name, picture=excluded.picture""",
            (uid, email, name, picture, time.time()),
        )
    return {"id": uid, "email": email, "name": name, "picture": picture}


def get_user(uid: str) -> dict | None:
    with connect() as conn:
        row = conn.execute("SELECT id, email, name, picture FROM users WHERE id=?", (uid,)).fetchone()
    return dict(row) if row else None


def upsert_sessions(uid: str, sessions: list[dict]) -> None:
    with connect() as conn:
        conn.executemany(
            """INSERT INTO sessions (user_id, id, kind, score, created_at, data)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(user_id, id) DO UPDATE SET kind=excluded.kind,
                 score=excluded.score, created_at=excluded.created_at, data=excluded.data""",
            [
                (uid, s["id"], s["kind"], s.get("score"), s["created_at"], json.dumps(s))
                for s in sessions
            ],
        )


def list_sessions(uid: str) -> list[dict]:
    with connect() as conn:
        rows = conn.execute(
            "SELECT data FROM sessions WHERE user_id=? ORDER BY created_at", (uid,)
        ).fetchall()
    return [json.loads(r["data"]) for r in rows]


def delete_sessions(uid: str) -> None:
    with connect() as conn:
        conn.execute("DELETE FROM sessions WHERE user_id=?", (uid,))
