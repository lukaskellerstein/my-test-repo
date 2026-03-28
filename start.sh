#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    trap - EXIT INT TERM
    echo "Shutting down..."
    [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID" 2>/dev/null
    [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null
    wait 2>/dev/null
    exit 0
}
trap cleanup EXIT INT TERM

# Install frontend dependencies if needed
if [[ ! -d "$SCRIPT_DIR/frontend/node_modules" ]]; then
    echo "Installing frontend dependencies..."
    (cd "$SCRIPT_DIR/frontend" && npm install --legacy-peer-deps)
fi

# Backend
echo "Starting backend..."
(cd "$SCRIPT_DIR/backend" && uv run uvicorn main:app --reload --port 8000) &
BACKEND_PID=$!

# Frontend
echo "Starting frontend..."
(cd "$SCRIPT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

wait
