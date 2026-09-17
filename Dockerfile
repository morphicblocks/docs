# syntax=docker/dockerfile:1

# ── Build ─────────────────────────────────────────────────────────────
# Astro bakes every PUBLIC_* value into the static output at build time, so
# `.env` has to be readable in this stage (see .dockerignore). It never
# reaches the served image: the stage below copies only the built `dist/`.
#
# Pinned to the bun minor line the lockfile was generated with, so
# `--frozen-lockfile` stays valid. Alpine is safe here even though Starlight
# pulls in sharp: the lockfile records its linux-musl builds alongside the
# rest.
FROM oven/bun:1.3-alpine AS build

# For hosts that reach the internet through an outbound proxy. Empty by
# default, so the build also works on a machine without one.
ARG HTTP_PROXY=""
ARG HTTPS_PROXY=""
ARG NO_PROXY=""

WORKDIR /app

# Dependencies first: editing the docs does not invalidate the install layer.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ── Serve ─────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
