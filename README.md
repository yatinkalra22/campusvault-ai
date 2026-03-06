# CampusVault AI

**Snap. Place. Find. -- AI-powered university asset management built with Amazon Nova.**

Universities manage thousands of shared assets tracked in spreadsheets that are always out of date. CampusVault AI replaces that with a mobile-first platform where staff photograph any item, AI identifies it instantly, and every borrow is tracked automatically.

---

## Core Loop

```
Snap photo --> Nova identifies item --> Assign to location --> Search anytime --> Borrow with approval --> Return tracked
```

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

## Amazon Nova Integration

| Nova Service | Feature |
|---|---|
| **Nova Pro** (Multimodal) | Snap-to-Add: photo to item name, brand, category, tags in under 3 seconds |
| **Nova 2 Lite** | Natural language search: "find projectors in Lab 3" |
| **Nova 2 Sonic** | Voice search: speak to search inventory hands-free |
| **Nova Act** | Agentic borrow lifecycle: due-date reminders, overdue escalation, auto-close |
| **Nova Embeddings** | Semantic search: "camera" also finds "DSLR", "Canon EOS" |

## Features

- **Snap-to-Add** -- Photograph any item; Nova pre-fills name, brand, category, tags. No barcodes.
- **Place Hierarchy** -- Place > Shelf > Section. Every item knows exactly where it lives.
- **AI-Overridable** -- AI suggests, humans verify and override. Always in control.
- **Borrow Workflow** -- Student requests, faculty approves, Nova Act sends reminders automatically.
- **Voice Search** -- Speak to find any item. Great for faculty carrying equipment.
- **Semantic Search** -- Intent-aware, not keyword-dependent.
- **Transfer Flow** -- Reassign items to new locations with full audit trail.
- **Role-Based Access** -- Admin > Faculty > Student with granular permissions.
- **Admin Dashboard** -- Real-time stats, pending approvals queue, audit log.
- **Cross-Platform** -- One Expo codebase for iOS, Android, and web.

## Repo Structure

```
campusvault-ai/
  apps/
    backend/          # NestJS API (port 3001)
    frontend/           # Expo app (iOS + Android + Web)
  packages/
    shared/           # Shared TypeScript types
  docs/               # Documentation
  assets/
    branding/         # White-label branding config
```

## Quick Start

```bash
# Install all workspace dependencies
npm install

# Backend
cp apps/backend/.env.example apps/backend/.env
# Fill in your AWS credentials and Cognito IDs
npm run backend:dev

# Frontend (new terminal)
cp apps/frontend/.env.example apps/frontend/.env
npm run frontend:web
```

### Demo Mode

Run the frontend without a backend by setting `EXPO_PUBLIC_DEMO_MODE=true` in `apps/frontend/.env`. This uses mock data for places, items, and stats.

## Documentation

- [Architecture](docs/architecture.md) -- System design, AWS services, security model
- [Features](docs/features.md) -- Complete feature list with permission matrix
- [Data Model](docs/data-model.md) -- DynamoDB tables, schemas, access patterns
- [API Routes](docs/api-routes.md) -- All REST endpoints with request/response
- [Setup Guide](docs/setup.md) -- AWS prerequisites, Cognito, DynamoDB, S3 setup

## Branding

White-label ready. Default brand: **Indiana Tech**. Modify `assets/branding/config.ts` and `apps/frontend/src/constants/theme.ts` to rebrand for any campus.

## License

MIT
