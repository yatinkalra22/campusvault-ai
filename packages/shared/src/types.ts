// ── Enums ──

export type UserRole = 'admin' | 'faculty' | 'student';

export type ItemStatus = 'available' | 'borrowed' | 'overdue' | 'maintenance' | 'missing';

export type BorrowStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';

export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor';

export type ItemCategory =
  | 'electronics'
  | 'av_equipment'
  | 'furniture'
  | 'lab_equipment'
  | 'tools'
  | 'books'
  | 'sporting'
  | 'clothing'
  | 'other';

// ── User ──

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  activeBorrowCount: number;
  totalBorrowCount: number;
}

// ── Place ──

export interface Place {
  id: string;
  name: string;
  description?: string;
  building?: string;
  floor?: string;
  roomNumber?: string;
  itemCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

// ── Shelf ──

export interface Shelf {
  id: string;
  placeId: string;
  name: string;
  section?: string;
  description?: string;
  itemCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

// ── Item ──

export interface AIAnalysis {
  originalName: string;
  confidence: number;
  analyzedAt: string;
  wasOverridden: boolean;
}

export interface TransferRecord {
  from: { placeId: string; placeName?: string; shelfId?: string; section?: string };
  to: { placeId: string; placeName?: string; shelfId?: string; section?: string };
  movedBy: string;
  movedAt: string;
  note?: string;
}

export interface Item {
  id: string;
  name: string;
  brandName?: string;
  category: ItemCategory;
  tags: string[];
  description?: string;
  aiAnalysis?: AIAnalysis;
  placeId: string;
  placeName?: string;
  shelfId?: string;
  shelfName?: string;
  section?: string;
  status: ItemStatus;
  currentBorrowId?: string;
  imageKeys: string[];
  imageUrls?: string[]; // Populated at read-time from presigned URLs
  thumbnailKey?: string;
  serialNumber?: string;
  assetTag?: string;
  notes?: string;
  condition: ItemCondition;
  embedding?: number[];
  embeddingUpdatedAt?: string;
  transferHistory: TransferRecord[];
  addedBy: string;
  addedAt: string;
  updatedAt: string;
  updatedBy?: string;
  isDeleted: boolean;
}

// ── Borrow ──

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemName?: string;
  requestedBy: string;
  requestedByName?: string;
  purpose: string;
  requestedAt: string;
  dueAt: string;
  status: BorrowStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  returnedAt?: string;
  returnedBy?: string;
  returnCondition?: ItemCondition;
  returnNotes?: string;
  returnImageKey?: string;
  remindersSent: number;
  lastReminderAt?: string;
  isOverdue: boolean;
}

// ── Notification ──

export type NotificationType =
  | 'borrow_request'
  | 'borrow_approved'
  | 'borrow_rejected'
  | 'due_reminder'
  | 'overdue_alert'
  | 'item_returned';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedBorrowId?: string;
  isRead: boolean;
  createdAt: string;
}

// ── Nova AI ──

export interface NovaItemAnalysis {
  name: string;
  brandName: string;
  category: ItemCategory;
  tags: string[];
  confidence: number;
  description: string;
}

// ── API Responses ──

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  lastKey?: string;
  count: number;
}
