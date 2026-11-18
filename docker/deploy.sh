#!/usr/bin/env sh
# Pull the latest images and restart. Run on the VPS; the GitHub deploy workflow calls it over SSH.
set -eu
cd "$(dirname "$0")/.."
git pull --ff-only
COMPOSE="docker compose -f docker/compose.yml --env-file .env"
$COMPOSE pull
$COMPOSE up -d --remove-orphans
$COMPOSE ps
docker image prune -f >/dev/null
