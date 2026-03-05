// Demo mode — returns mock data when the backend is unreachable.
// Toggle via EXPO_PUBLIC_DEMO_MODE=true in .env

export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export const DEMO_PLACES = [
  { id: 'demo-place-1', name: 'Media Lab', building: 'Tech Building', floor: '2nd Floor', roomNumber: '205', itemCount: 12, isDeleted: false, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z', createdBy: 'demo' },
  { id: 'demo-place-2', name: 'Computer Lab A', building: 'Engineering Hall', floor: '1st Floor', roomNumber: '101', itemCount: 8, isDeleted: false, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z', createdBy: 'demo' },
  { id: 'demo-place-3', name: 'Storage Room', building: 'Main Building', floor: 'Basement', roomNumber: 'B-01', itemCount: 24, isDeleted: false, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z', createdBy: 'demo' },
  { id: 'demo-place-4', name: 'Faculty Lounge', building: 'Admin Building', floor: '3rd Floor', roomNumber: '302', itemCount: 5, isDeleted: false, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z', createdBy: 'demo' },
];

export const DEMO_ITEMS = [
  { id: 'demo-item-1', name: 'Canon EOS Rebel T7 DSLR Camera', brandName: 'Canon', category: 'electronics', tags: ['camera', 'dslr', 'photography'], status: 'available', placeId: 'demo-place-1', placeName: 'Media Lab', shelfName: 'Shelf B', section: 'AV Row', imageKeys: [], condition: 'good', addedAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [], aiAnalysis: { originalName: 'Canon EOS Rebel T7 DSLR Camera', confidence: 0.94, analyzedAt: '2026-03-01T10:00:00Z', wasOverridden: false } },
  { id: 'demo-item-2', name: 'Epson EB-X51 Projector', brandName: 'Epson', category: 'av_equipment', tags: ['projector', 'presentation'], status: 'available', placeId: 'demo-place-2', placeName: 'Computer Lab A', shelfName: 'Cabinet 1', imageKeys: [], condition: 'good', addedAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [] },
  { id: 'demo-item-3', name: 'Dell XPS 15 Laptop', brandName: 'Dell', category: 'electronics', tags: ['laptop', 'computer'], status: 'borrowed', placeId: 'demo-place-1', placeName: 'Media Lab', shelfName: 'Shelf A', imageKeys: [], condition: 'excellent', addedAt: '2026-03-02T08:00:00Z', updatedAt: '2026-03-04T09:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [] },
  { id: 'demo-item-4', name: 'Shure SM58 Microphone', brandName: 'Shure', category: 'av_equipment', tags: ['microphone', 'audio', 'recording'], status: 'available', placeId: 'demo-place-1', placeName: 'Media Lab', shelfName: 'Shelf C', imageKeys: [], condition: 'good', addedAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [] },
  { id: 'demo-item-5', name: 'Raspberry Pi 4 Kit', brandName: 'Raspberry Pi', category: 'electronics', tags: ['raspberry-pi', 'iot', 'microcontroller'], status: 'available', placeId: 'demo-place-3', placeName: 'Storage Room', shelfName: 'Bin 3', imageKeys: [], condition: 'good', addedAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [] },
  { id: 'demo-item-6', name: 'Arduino Uno Starter Kit', brandName: 'Arduino', category: 'lab_equipment', tags: ['arduino', 'electronics', 'prototyping'], status: 'available', placeId: 'demo-place-3', placeName: 'Storage Room', shelfName: 'Bin 3', imageKeys: [], condition: 'good', addedAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', addedBy: 'demo', isDeleted: false, transferHistory: [] },
];

export const DEMO_STATS = {
  totalItems: 49,
  activeBorrows: 8,
  overdueCount: 2,
  placesCount: 4,
};

export const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@indianatech.edu',
  name: 'Demo User',
  role: 'admin' as const,
  department: 'Computer Science',
  isActive: true,
  activeBorrowCount: 1,
  totalBorrowCount: 5,
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};
