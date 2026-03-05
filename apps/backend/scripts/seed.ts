/**
 * Demo data seed script.
 * Run: npx ts-node scripts/seed.ts
 * Requires AWS credentials and DynamoDB tables to exist.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { config } from 'dotenv';

config();

const raw = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const client = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

const now = new Date().toISOString();

const PLACES = [
  { id: 'place-001', name: 'Media Lab', description: 'AV equipment and recording studio', building: 'Tech Building', floor: '2nd Floor', roomNumber: '205' },
  { id: 'place-002', name: 'Computer Lab A', description: 'Student workstations and peripherals', building: 'Engineering Hall', floor: '1st Floor', roomNumber: '101' },
  { id: 'place-003', name: 'Storage Room', description: 'General equipment storage', building: 'Main Building', floor: 'Basement', roomNumber: 'B-01' },
  { id: 'place-004', name: 'Faculty Lounge', description: 'Faculty shared resources', building: 'Admin Building', floor: '3rd Floor', roomNumber: '302' },
];

const SHELVES = [
  { id: 'shelf-001', placeId: 'place-001', name: 'Shelf A', section: 'Cameras & Lenses' },
  { id: 'shelf-002', placeId: 'place-001', name: 'Shelf B', section: 'AV Equipment' },
  { id: 'shelf-003', placeId: 'place-002', name: 'Cabinet 1', section: 'Laptops' },
  { id: 'shelf-004', placeId: 'place-003', name: 'Rack A', section: 'Electronics' },
];

const ITEMS = [
  { id: 'item-001', name: 'Canon EOS Rebel T7 DSLR Camera', brandName: 'Canon', category: 'electronics', placeId: 'place-001', placeName: 'Media Lab', shelfId: 'shelf-001', shelfName: 'Shelf A', status: 'available', tags: ['camera', 'dslr', 'photography'] },
  { id: 'item-002', name: 'Epson EB-X51 Projector', brandName: 'Epson', category: 'av_equipment', placeId: 'place-002', placeName: 'Computer Lab A', status: 'available', tags: ['projector', 'presentation', 'display'] },
  { id: 'item-003', name: 'Dell XPS 15 Laptop', brandName: 'Dell', category: 'electronics', placeId: 'place-001', placeName: 'Media Lab', shelfId: 'shelf-003', shelfName: 'Cabinet 1', status: 'borrowed', tags: ['laptop', 'computer', 'portable'] },
  { id: 'item-004', name: 'Shure SM58 Microphone', brandName: 'Shure', category: 'av_equipment', placeId: 'place-001', placeName: 'Media Lab', shelfId: 'shelf-002', shelfName: 'Shelf B', status: 'available', tags: ['microphone', 'audio', 'recording'] },
  { id: 'item-005', name: 'Raspberry Pi 4 Kit', brandName: 'Raspberry Pi', category: 'electronics', placeId: 'place-003', placeName: 'Storage Room', shelfId: 'shelf-004', shelfName: 'Rack A', status: 'available', tags: ['raspberry-pi', 'iot', 'microcontroller'] },
  { id: 'item-006', name: 'Arduino Uno Starter Kit', brandName: 'Arduino', category: 'lab_equipment', placeId: 'place-003', placeName: 'Storage Room', shelfId: 'shelf-004', status: 'available', tags: ['arduino', 'electronics', 'prototyping'] },
  { id: 'item-007', name: 'Sony Alpha 4K Action Camera', brandName: 'Sony', category: 'electronics', placeId: 'place-001', placeName: 'Media Lab', shelfId: 'shelf-001', status: 'available', tags: ['camera', 'action-cam', '4k', 'video'] },
  { id: 'item-008', name: 'Samsung 50-inch Smart TV', brandName: 'Samsung', category: 'electronics', placeId: 'place-002', placeName: 'Computer Lab A', status: 'available', tags: ['tv', 'display', 'smart-tv', 'monitor'] },
];

async function seed() {
  console.log('Seeding demo data...');

  for (const place of PLACES) {
    await client.send(new PutCommand({
      TableName: process.env.DYNAMODB_PLACES_TABLE ?? 'campusvault-places',
      Item: { ...place, itemCount: ITEMS.filter(i => i.placeId === place.id).length, createdBy: 'seed', createdAt: now, updatedAt: now, isDeleted: false },
    }));
    console.log(`  Place: ${place.name}`);
  }

  for (const shelf of SHELVES) {
    await client.send(new PutCommand({
      TableName: process.env.DYNAMODB_SHELVES_TABLE ?? 'campusvault-shelves',
      Item: { ...shelf, itemCount: ITEMS.filter(i => i.shelfId === shelf.id).length, createdBy: 'seed', createdAt: now, updatedAt: now, isDeleted: false },
    }));
    console.log(`  Shelf: ${shelf.name}`);
  }

  for (const item of ITEMS) {
    await client.send(new PutCommand({
      TableName: process.env.DYNAMODB_ITEMS_TABLE ?? 'campusvault-items',
      Item: { ...item, imageKeys: [], condition: 'good', transferHistory: [], addedBy: 'seed', addedAt: now, updatedAt: now, isDeleted: false },
    }));
    console.log(`  Item: ${item.name}`);
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
