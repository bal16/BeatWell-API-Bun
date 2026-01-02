# BeatWell API (Bun + Elysia)

BeatWell is a Bun-powered API built with Elysia that provides authentication, healthy lifestyle content, AI-powered Coronary Heart Disease (CHD) risk prediction, and a simple chatbot. It uses Postgres with Drizzle ORM, ships OpenAPI docs, and is deployable to Vercel.

## Quick Start

1. Start Postgres via Docker Compose:

```bash
docker compose up -d
```

1. Create `.env.local` (see Environment below), then run migrations and seed data:

```bash
bun run db:migrate
bun run db:seed
```

1. Start the API:

```bash
bun run dev
```

1. Open the OpenAPI docs at <http://localhost:3000/docs> and try endpoints.

## Environment

Required variables (see `src/env.ts`):

- `DATABASE_URL` — Postgres connection string
- `PREDICTION_MODEL_URL` — URL to TensorFlow `model.json` (CHD)
- `CHATBOT_MODEL_URL` — URL to TensorFlow `model.json` (chatbot)
- `CHATBOT_INTENTS_URL` — URL to `intents.json`
- `CHATBOT_CLASSES_URL` — URL to `classes.json`
- `CHATBOT_WORDS_URL` — URL to `words.json`
- Optional: `PORT`, `LOG_LEVEL`, `TRUSTED_ORIGINS`

Example `.env.local` for local development:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/beatwell_dev
PORT=3000
LOG_LEVEL=info

# If you serve the ai-model folder with a simple static server (see docs)
PREDICTION_MODEL_URL=http://localhost:8080/ai-model/prediction/model.json
CHATBOT_MODEL_URL=http://localhost:8080/ai-model/chatbot/model.json
CHATBOT_INTENTS_URL=http://localhost:8080/ai-model/chatbot/intents.json
CHATBOT_CLASSES_URL=http://localhost:8080/ai-model/chatbot/classes.json
CHATBOT_WORDS_URL=http://localhost:8080/ai-model/chatbot/words.json
```

## Scripts

- `bun run dev` — start in watch mode
- `bun run db:generate` — generate Drizzle migrations
- `bun run db:migrate` — apply migrations
- `bun run db:studio` — open Drizzle studio
- `bun run db:seed` — seed activities, foods, and trivias
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run format` — Prettier
- `bun test:unit` / `bun test:e2e` — Bun test runner

## Documentation

See the full project documentation:

- Overview & Walkthrough — [docs/overview.md](docs/overview.md)
- Feature docs — [docs/](docs/) contains endpoints for Activities, Auth, Foods, Histories, Trivia, Users

## Architecture

- Web framework: Elysia (see [src/app.ts](src/app.ts))
- Plugins: CORS, OpenAPI, Pino logger, BetterAuth (see [src/plugins/](src/plugins))
- Auth: BetterAuth with Drizzle adapter (see [src/lib/auth.ts](src/lib/auth.ts))
- Database: Postgres + Drizzle ORM (see [src/lib/db/](src/lib/db))
- AI: TensorFlow.js WASM backend for prediction & chatbot (see [src/lib/tensorflow.ts](src/lib/tensorflow.ts))
- OpenAPI docs: available at `/docs` (see [src/plugins/open-api.ts](src/plugins/open-api.ts))

## Deployment

Vercel serverless function entry is [api/index.ts](api/index.ts) with rewrites configured in [vercel.json](vercel.json).

For detailed setup and a step-by-step walkthrough, read [docs/overview.md](docs/overview.md).
