#!/usr/bin/env bash
# Собирает docs/ для MkDocs из реального контента репозитория (single source of truth
# в domains/, standards/, implementations/, README.md — сюда только копия для сборки).
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf docs site
mkdir -p docs
cp -r domains docs/domains
cp -r standards docs/standards
cp -r implementations docs/implementations
cp README.md docs/README.md

mkdocs build
