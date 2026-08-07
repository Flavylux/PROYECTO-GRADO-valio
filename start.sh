#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
PORT="${PORT:-8000}"

if command -v python3 >/dev/null 2>&1; then
  echo "Iniciando el proyecto en http://127.0.0.1:${PORT}/"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://127.0.0.1:${PORT}/" >/dev/null 2>&1 || true
  fi
  python3 server.py
else
  echo "No se encontró Python 3 en el sistema."
  exit 1
fi
