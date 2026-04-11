$VPS_USER = "root"
$VPS_HOST = "157.173.96.140"
$REMOTE_DIR = "/armagedon"

Write-Host "==> Tworzenie folderu na VPS..."
ssh "$VPS_USER@$VPS_HOST" "mkdir -p $REMOTE_DIR"

Write-Host "==> Kopiowanie plikow na VPS..."
scp -r `
  src `
  public `
  package.json `
  pnpm-lock.yaml `
  next.config.mjs `
  postcss.config.mjs `
  tsconfig.json `
  Dockerfile `
  docker-compose.yml `
  .dockerignore `
  .npmrc `
  "$VPS_USER@${VPS_HOST}:$REMOTE_DIR/"

Write-Host "==> Kopiowanie .env na VPS..."
scp .env "$VPS_USER@${VPS_HOST}:$REMOTE_DIR/.env"

Write-Host "==> Budowanie i uruchamianie kontenerow..."
ssh "$VPS_USER@$VPS_HOST" "cd $REMOTE_DIR && docker compose up -d --build"

Write-Host ""
Write-Host "Gotowe! Aplikacja dziala pod: http://${VPS_HOST}:3000"
