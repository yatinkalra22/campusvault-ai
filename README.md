# CampusVault AI

**AI-powered university asset management platform built with Amazon Nova.**

Snap. Place. Find. -- Photograph any item, AI identifies it, assign it to a location, search anytime, borrow with approval, return tracked.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Expo (React Native + Web), TypeScript, Zustand, Expo Router |
| Backend | NestJS, TypeScript, AWS SDK v3 |
| Database | Amazon DynamoDB |
| Storage | Amazon S3 (presigned URLs) |
| Auth | Amazon Cognito (JWT, role-based) |
| AI | Amazon Bedrock -- Nova Pro, Nova Lite, Nova Sonic, Nova Embeddings, Nova Act |
| Notifications | Amazon SES + WebSocket (socket.io) |

## Repo Structure

```
campusvault-ai/
  apps/
    backend/          # NestJS API (port 3001)
    mobile/           # Expo app (iOS + Android + Web)
  packages/
    shared/           # Shared TypeScript types
  docs/               # Documentation
  assets/
    branding/         # White-label branding config
```

## Quick Start

```bash
npm install

# Backend
cp apps/backend/.env.example apps/backend/.env
npm run backend:dev

# Frontend (new terminal)
cp apps/mobile/.env.example apps/mobile/.env
npm run mobile:web
```

See [docs/setup.md](docs/setup.md) for full AWS setup instructions.

## Documentation

- [Architecture](docs/architecture.md) -- System design, AWS services, security
- [Features](docs/features.md) -- Complete feature list with permission matrix
- [Data Model](docs/data-model.md) -- DynamoDB tables, types, access patterns
- [API Routes](docs/api-routes.md) -- All REST endpoints
- [Setup Guide](docs/setup.md) -- Prerequisites, AWS config, local dev

## Nova AI Integration

| Nova Service | Feature |
|---|---|
| Nova Pro (Multimodal) | Snap-to-Add: camera photo > item name, brand, category, tags |
| Nova 2 Lite | Natural language search: "find projectors in Lab 3" |
| Nova 2 Sonic | Voice search: speak to search inventory |
| Nova Act | Agentic borrow lifecycle: reminders, escalation, auto-close |
| Nova Embeddings | Semantic search: "camera" finds "DSLR", "Canon EOS" |

## Branding

White-label ready. Default brand: **Indiana Tech**. Modify `assets/branding/config.ts` to rebrand for any campus.

## License

MIT
