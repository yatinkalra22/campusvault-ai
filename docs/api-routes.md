# CampusVault AI - API Routes

Base URL: `http://localhost:3001`
Swagger UI: `http://localhost:3001/api`

## Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /auth/login | Public | Cognito login |

## Items
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /items | JWT | List items (+ query filters) |
| GET | /items/:id | JWT | Item detail |
| POST | /items/analyze-image | JWT+faculty | Nova vision analysis |
| POST | /items/upload-url | JWT+faculty | S3 presigned upload URL |
| POST | /items | JWT+faculty | Create item |
| PUT | /items/:id | JWT+faculty | Update item |
| PUT | /items/:id/transfer | JWT+faculty | Transfer location |
| DELETE | /items/:id | JWT+admin | Delete item |

## Places & Shelves
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /places | JWT | List places |
| POST | /places | JWT+admin | Create place |
| GET | /places/:id | JWT | Place detail |
| GET | /places/:id/shelves | JWT | Shelves in a place |
| POST | /shelves | JWT+admin | Create shelf |

## Borrow
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /borrow | JWT | Create borrow request |
| PUT | /borrow/:id/approve | JWT+faculty | Approve |
| PUT | /borrow/:id/reject | JWT+faculty | Reject |
| PUT | /borrow/:id/return | JWT | Return item |
| GET | /borrow/my | JWT | My borrow requests |
| GET | /borrow/pending | JWT+faculty | Pending approvals |

## Search
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /search | JWT | NL text search |
| POST | /search/voice | JWT | Voice search (audio upload) |

## Admin
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /admin/stats | JWT+admin | Dashboard stats |
| GET | /admin/audit | JWT+admin | Audit log |
