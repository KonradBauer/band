#!/bin/bash
set -e

VPS_USER="root"
VPS_HOST="157.173.96.140"
REMOTE_DIR="/armagedon"

echo "==> Kopiowanie plików na VPS..."
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.tsbuildinfo' \
  --exclude='test-results' \
  --exclude='playwright-report' \
  --exclude='.env' \
  . "$VPS_USER@$VPS_HOST:$REMOTE_DIR"

echo "==> Kopiowanie .env na VPS..."
scp .env "$VPS_USER@$VPS_HOST:$REMOTE_DIR/.env"

echo "==> Budowanie i uruchamianie kontenerów..."
ssh "$VPS_USER@$VPS_HOST" "cd $REMOTE_DIR && docker compose up -d --build"

echo ""
echo "Gotowe! Aplikacja dziala pod: http://$VPS_HOST:3000"
