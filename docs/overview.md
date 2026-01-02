# BeatWell API — Overview & Walkthrough

This document provides a comprehensive overview of the BeatWell API: the libraries used, database design, development tools, and a step-by-step walkthrough to get you running locally and exploring the endpoints.

## Libraries Used

- **Elysia**: Lightweight Bun web framework powering routes and plugins. See [src/app.ts](../src/app.ts) and [src/lib/route.ts](../src/lib/route.ts).
- **@elysiajs/openapi**: Generates OpenAPI documentation available at `/docs`. See [src/plugins/open-api.ts](../src/plugins/open-api.ts).
- **@elysiajs/cors**: CORS handling with allowlist from `TRUSTED_ORIGINS`. See [src/plugins/cors.ts](../src/plugins/cors.ts).
- **@bogeychan/elysia-logger** + **pino**: HTTP logging via Pino; pretty logs in development. See [src/plugins/logger.ts](../src/plugins/logger.ts).
- **better-auth**: Authentication with email/password and token-based sessions; Drizzle adapter for Postgres. See [src/lib/auth.ts](../src/lib/auth.ts) and feature routes [src/features/auth](../src/features/auth).
- **Drizzle ORM**: Type-safe SQL for Postgres and migration tooling (`drizzle-kit`). See [src/lib/db](../src/lib/db) and [drizzle.config.ts](../drizzle.config.ts).
- **pg**: Node Postgres client used by Drizzle. See [src/lib/db/client.ts](../src/lib/db/client.ts).
- **Zod**: Validation for env and request bodies. See [src/env.ts](../src/env.ts) and feature `schema.ts` files.
- **TensorFlow.js (Core, Layers, WASM)**: AI models for CHD prediction and chatbot, running with WASM backend for performance. See [src/lib/tensorflow.ts](../src/lib/tensorflow.ts), [src/services/prediction.service.ts](../src/services/prediction.service.ts), and [src/services/chatbot.service.ts](../src/services/chatbot.service.ts).
- **natural**: NLP utilities (tokenizer, stemming) for the chatbot. See [src/services/chatbot.service.ts](../src/services/chatbot.service.ts).
- **cuid2**: ID generation for entities. See [src/lib/db/schema/schema.ts](../src/lib/db/schema/schema.ts).

Dev-only:

- **drizzle-kit**, **eslint**, **prettier**, **pino-pretty**, **dotenv**, **typescript-eslint**, **bun-types**.

## Database

- **Engine**: Postgres (Docker Compose service `postgres`). See [docker-compose.yaml](../docker-compose.yaml).
- **ORM**: Drizzle ORM with schema in [src/lib/db/schema](../src/lib/db/schema).
- **Connection**: Via `pg` pool and Drizzle client. See [src/lib/db/client.ts](../src/lib/db/client.ts).
- **Migrations**: Managed by `drizzle-kit` and stored under [drizzle/](../drizzle). Configure with [drizzle.config.ts](../drizzle.config.ts).
- **Seeding**: Seed scripts insert activities, healthy foods, and trivias: [seed/index.ts](../seed/index.ts), using JSON in [seed/data](../seed/data).

### Schema Overview

Key tables (see [src/lib/db/schema/schema.ts](../src/lib/db/schema/schema.ts) and [src/lib/db/schema/auth-schema.ts](../src/lib/db/schema/auth-schema.ts)):

- `user`, `session`, `account`, `verification`, `jwks` — managed by BetterAuth.
- `activities` — lifestyle activities content.
- `healthy_foods` — curated healthy food entries.
- `trivias` — health trivia entries.
- `histories` — user prediction history records.
- `health_profiles` — placeholder for future health profile details.

## Tools & Workflows

- **Bun**: Runtime and test runner.
  - Dev server: `bun run dev`
  - Unit tests: `bun test:unit`
  - E2E tests: `bun test:e2e`
- **Docker Compose**: Local Postgres.
  - Start: `docker compose up -d`
  - Stop: `docker compose down`
- **Drizzle Kit**:
  - Generate migrations: `bun run db:generate`
  - Apply migrations: `bun run db:migrate`
  - Studio: `bun run db:studio`
- **Lint & Format**:
  - Lint: `bun run lint`
  - Fix: `bun run lint:fix`
  - Format: `bun run format`
- **OpenAPI Docs**: Visit `/docs` in the running server.

## Walkthrough

### 1) Provision Database

Start Postgres:

```bash
docker compose up -d
```

This provisions a `postgres` container with dev and test databases (see `POSTGRES_MULTIPLE_DATABASES` in [docker-compose.yaml](../docker-compose.yaml)). Data persists in `./pgdata`.

### 2) Environment Setup

Create `.env.local` at the repo root (see [src/env.ts](../src/env.ts) for required variables):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/beatwell_dev
PORT=3000
LOG_LEVEL=info
TRUSTED_ORIGINS=http://localhost:5173

# Serve models & assets via a simple static server (example below)
PREDICTION_MODEL_URL=http://localhost:8080/ai-model/prediction/model.json
CHATBOT_MODEL_URL=http://localhost:8080/ai-model/chatbot/model.json
CHATBOT_INTENTS_URL=http://localhost:8080/ai-model/chatbot/intents.json
CHATBOT_CLASSES_URL=http://localhost:8080/ai-model/chatbot/classes.json
CHATBOT_WORDS_URL=http://localhost:8080/ai-model/chatbot/words.json
```

To host AI assets locally, serve the `ai-model/` directory. One simple approach:

```bash
# from the repo root
python3 -m http.server 8080
# or any static server you prefer
```

### 3) Migrations & Seed

Apply migrations and seed data:

```bash
bun run db:migrate
bun run db:seed
```

### 4) Run the API

Start the dev server:

```bash
bun run dev
```

Check health:

```bash
curl http://localhost:3000/
# {"status":"ok","backend":"tensorflow-wasm"}
```

Open documentation: <http://localhost:3000/docs>

### 5) Auth Flow (Quick Test)

Register:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

Login (capture `token` from response):

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

Logout:

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H 'Authorization: Bearer <TOKEN>'
```

### 6) CHD Prediction

Input schema and route in [src/features/prediction](../src/features/prediction). Example request:

```bash
curl -X POST http://localhost:3000/prediction \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "sex": 1,
    "age": 50,
    "cigsPerday": 0,
    "BPMeds": 0,
    "prevalentStroke": 0,
    "prevalentHyp": 0,
    "diabetes": 0,
    "totChol": 200,
    "sysBP": 120,
    "diaBP": 80,
    "heartRate": 72,
    "glucose": 90,
    "height": 1.70,
    "weight": 70
  }'
```

The response includes `risk` as a percentage and records the result in `histories` (see [src/services/history.service.ts](../src/services/history.service.ts)).

### 7) Chatbot

Ask a question:

```bash
curl -X POST http://localhost:3000/chat \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"question":"Apa itu diet seimbang?"}'
```

### 8) Content Endpoints

Explore Activities, Foods, Histories, Trivias, Users in the OpenAPI docs and the feature docs:

- [docs/activity.md](./activity.md)
- [docs/food.md](./food.md)
- [docs/history.md](./history.md)
- [docs/trivia.md](./trivia.md)
- [docs/user.md](./user.md)
- [docs/auth.md](./auth.md)

## Deployment Notes

- Vercel integrates via [api/index.ts](../api/index.ts) and [vercel.json](../vercel.json). The OpenAPI docs remain available at `/docs`.
- Ensure AI model JSONs are hosted at accessible HTTPS URLs in production.

## Troubleshooting

- Missing env variables: The server validates env at startup (see [src/env.ts](../src/env.ts)). Check error messages for the exact key.
- AI assets not loading: Confirm your URLs resolve and serve valid JSON model manifests (TensorFlow.js format) and JSON files for intents/classes/words.
- Database connectivity: Verify `DATABASE_URL` and that the Postgres container is healthy (`docker compose ps`).
