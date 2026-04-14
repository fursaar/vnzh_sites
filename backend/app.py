import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, g, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "leads.db"

app = Flask(__name__)


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


def init_db() -> None:
    db = sqlite3.connect(DB_PATH)
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            telegram TEXT,
            situation TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    db.commit()
    db.close()


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response


@app.teardown_appcontext
def close_db(_exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


@app.route("/api/leads", methods=["POST", "OPTIONS"])
def create_lead():
    if request.method == "OPTIONS":
        return ("", 204)

    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Invalid JSON payload"}), 404

    required = ["name", "phone", "situation"]
    missing = [field for field in required if not str(payload.get(field, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 404

    try:
        db = get_db()
        now = datetime.now(timezone.utc).isoformat()
        cursor = db.execute(
            """
            INSERT INTO leads (site, name, phone, telegram, situation, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                str(payload.get("site", "unknown")).strip(),
                payload["name"].strip(),
                payload["phone"].strip(),
                str(payload.get("telegram", "")).strip(),
                payload["situation"].strip(),
                now,
            ),
        )
        db.commit()
    except Exception:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"status": "ok", "id": cursor.lastrowid}), 200


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
