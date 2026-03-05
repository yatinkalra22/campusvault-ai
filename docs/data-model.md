# CampusVault AI - Data Model

DynamoDB with separate tables per entity. PAY_PER_REQUEST billing. ISO 8601 timestamps.

## Tables Overview

| Table | PK | GSIs |
|---|---|---|
| campusvault-users | id (UUID) | email-index |
| campusvault-places | id (UUID) | - |
| campusvault-shelves | id (UUID) | placeId-index |
| campusvault-items | id (UUID) | placeId-index, status-index |
| campusvault-borrows | id (UUID) | itemId-index, requestedBy-index |

## Key Types

```typescript
type UserRole = 'admin' | 'faculty' | 'student';
type ItemStatus = 'available' | 'borrowed' | 'overdue' | 'maintenance' | 'missing';
type BorrowStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
type ItemCategory = 'electronics' | 'av_equipment' | 'furniture' | 'lab_equipment'
  | 'tools' | 'books' | 'sporting' | 'clothing' | 'other';
type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor';
```

## Access Patterns

| Pattern | Table | Index | Key |
|---|---|---|---|
| Get item by ID | items | primary | `id = :id` |
| Items in a place | items | placeId-index | `placeId = :placeId` |
| Available items | items | status-index | `status = 'available'` |
| Borrow history for item | borrows | itemId-index | `itemId = :id` |
| My borrow requests | borrows | requestedBy-index | `requestedBy = :userId` |
| Shelves in a place | shelves | placeId-index | `placeId = :placeId` |
| User by email | users | email-index | `email = :email` |

## Conventions
- Table names: `campusvault-{entity}`
- GSI names: `{attribute}-index`
- PKs: UUID v4
- Booleans: `isDeleted`, `isActive`, `isOverdue`
- Arrays: always initialize as `[]`
- Enums: lowercase with underscores

Full type definitions in `packages/shared/src/types.ts`.
