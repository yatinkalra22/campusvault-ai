# CampusVault AI - Architecture

## System Overview

AI-powered university asset management platform. Staff and students photograph physical items, AI identifies and categorizes them, assigns to locations (Place > Shelf > Section), and manages borrowing with full audit trail.

**Core loop**: `Snap photo > Nova identifies item > Assign location > Search anytime > Borrow with approval > Return tracked`

## High-Level Architecture

```
CLIENT (Expo: iOS / Android / Web)
  |
  | HTTPS / WebSocket
  v
API GATEWAY (NestJS on port 3001)
  |
  |-- Auth Module        (Cognito JWT)
  |-- Items Module       (CRUD + Nova vision)
  |-- Places Module      (Rooms, shelves, sections)
  |-- Borrow Module      (Request, approve, return + Nova Act)
  |-- Search Module      (Nova embeddings, NL search, voice)
  |-- Notifications      (SES email + WebSocket push)
  |-- Nova Service       (Centralized Bedrock calls)
  |
  v
AWS Services:
  - DynamoDB      (main DB, 5 tables)
  - S3            (item images, presigned URLs)
  - Cognito       (auth, roles: admin/faculty/student)
  - Bedrock       (Nova Pro, Nova Lite, Nova Sonic, Nova Embeddings)
  - SES           (borrow emails)
```

## AWS Services

| Service | Purpose |
|---|---|
| Amazon Nova Pro (Multimodal) | Photo > item name, brand, category, tags |
| Amazon Nova 2 Lite | NL queries, reminder generation |
| Amazon Nova 2 Sonic | Voice search transcription |
| Amazon Nova Act | Agentic borrow approval & overdue reminders |
| Nova Multimodal Embeddings | Semantic image+text search |
| DynamoDB | Items, places, shelves, borrows, users |
| S3 | Item photos (presigned URLs, never direct access) |
| Cognito | JWT auth with role-based access (admin/faculty/student) |

## Data Model

See [data-model.md](./data-model.md) for full schema.

**Tables**: campusvault-items, campusvault-places, campusvault-shelves, campusvault-borrows, campusvault-users

**Location Hierarchy**: University > Building/Floor > Place > Shelf > Section > Item

## Security

- Cognito JWT on all routes via `CognitoAuthGuard`
- Role guards: `@Roles('admin', 'faculty')` on sensitive endpoints
- S3 presigned URLs (time-limited, never expose raw keys)
- Input validation via class-validator on all DTOs
- Minimal IAM permissions per service
