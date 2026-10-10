#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/dyu2x/remix1.git"

if [ ! -f .env ]; then
  echo "Missing .env. Run: cp .env.example .env, then edit .env with strong passwords."
  exit 1
fi

if [ ! -d app/.git ]; then
  if [ -e app ] && [ "$(find app -mindepth 1 -maxdepth 1 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "The app/ directory exists and is not an empty git checkout. Move it aside and retry."
    exit 1
  fi
  rm -rf app
  git clone "$REPO_URL" app
fi

# This deployment Dockerfile is kept separate from the repository's normal Dockerfile.
cat > app/Dockerfile.mesina <<'DOCKERFILE'
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
DOCKERFILE

echo "Building and starting Remix app + MariaDB..."
docker compose up -d --build
echo
echo "Services:"
docker compose ps
echo
echo "Open http://YOUR_UBUNTU_SERVER_IP:${APP_PORT:-3000}"
echo "Admin path, if implemented by the repository: http://YOUR_UBUNTU_SERVER_IP:${APP_PORT:-3000}/connect/admin"
