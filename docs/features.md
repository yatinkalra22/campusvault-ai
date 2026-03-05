# CampusVault AI - Features

## Core Modules

### 1. Authentication & Roles
- Email/password via Cognito
- Roles: `admin` | `faculty` | `student`
- JWT refresh, profile screen, admin user management

| Action | Student | Faculty | Admin |
|---|---|---|---|
| Browse items/places | Yes | Yes | Yes |
| Add/edit items | No | Yes | Yes |
| Borrow item | Needs approval | Self-approve | Yes |
| Approve borrows | No | Yes | Yes |
| Create/edit places | No | No | Yes |
| Delete items | No | No | Yes |

### 2. Place & Location Management
- Create places (rooms, labs, offices) with building/floor metadata
- Shelves inside places with optional section labels
- Visual place browser with item count badges

### 3. Item Management (Snap-to-Add)
- Camera flow: tap "+" > capture photo
- Nova Pro Vision: returns name, brand, category, tags, confidence
- Editable pre-fill: AI fields shown in form, user can override
- Location assignment: Place > Shelf > Section dropdown chain
- Up to 5 photos per item, stored in S3
- Transfer flow with full movement audit trail

### 4. Borrow & Return
- Student requests > faculty/admin approves > item status = Borrowed
- Nova Act agent: due date reminders, overdue escalation (D+1, D+3)
- Return flow with optional condition photo
- Full borrow history per item

### 5. Search
- Text search across name, brand, category, tags, location
- Semantic search via Nova Embeddings (intent-aware, not keyword-dependent)
- Voice search via Nova 2 Sonic (speak to search inventory)

### 6. Notifications
- In-app notification bell (WebSocket real-time)
- Email via SES: borrow request, approval, reminder, overdue, returned

### 7. Admin Dashboard
- Stats: total items, active borrows, overdue count
- Pending approvals queue
- Recent activity feed
- Audit log

## Hackathon Priority

**Must Have**: Auth, Places, Snap-to-Add, Item CRUD, Search, Borrow flow, Nova Act reminders
**Should Have**: Voice search, Semantic search, Transfer flow, Admin dashboard
**Nice to Have**: Notification preferences, Condition tracking, Analytics, Bulk import
