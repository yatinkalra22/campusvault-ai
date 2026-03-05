import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service.js';
import { NovaService } from '../nova/nova.service.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { CreateItemDto } from './dto/create-item.dto.js';
import { TransferItemDto } from './dto/transfer-item.dto.js';

@Injectable()
export class ItemsService {
  private readonly s3 = new S3Client({ region: process.env.AWS_REGION });
  private readonly table = process.env.DYNAMODB_ITEMS_TABLE!;

  constructor(
    private readonly dynamo: DynamoService,
    private readonly nova: NovaService,
  ) {}

  async findAll(filters: Record<string, string>) {
    if (filters.placeId) {
      return this.dynamo.query(
        this.table,
        'placeId-index',
        '#placeId = :placeId',
        { ':placeId': filters.placeId },
        { '#placeId': 'placeId' },
      );
    }
    if (filters.status) {
      return this.dynamo.query(
        this.table,
        'status-index',
        '#status = :status',
        { ':status': filters.status },
        { '#status': 'status' },
      );
    }
    return this.dynamo.scan(this.table);
  }

  async findOne(id: string) {
    const item = await this.dynamo.get(this.table, { id });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    // Generate presigned URLs for images
    if (item.imageKeys?.length) {
      item.imageUrls = await Promise.all(
        item.imageKeys.map((key: string) =>
          getSignedUrl(
            this.s3,
            new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }),
            { expiresIn: 3600 },
          ),
        ),
      );
    }
    return item;
  }

  async analyzeImage(imageBase64: string) {
    return this.nova.analyzeItemImage(imageBase64);
  }

  async getUploadPresignedUrl(contentType: string) {
    const key = `items/${uuidv4()}.jpg`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    return { presignedUrl, key };
  }

  async create(dto: CreateItemDto, userId: string) {
    const id = uuidv4();
    const item = {
      id,
      ...dto,
      tags: dto.tags ?? [],
      imageKeys: dto.imageKeys ?? [],
      status: 'available',
      condition: 'good',
      addedBy: userId,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transferHistory: [],
      isDeleted: false,
    };

    await this.dynamo.put(this.table, item);

    // Generate embedding for semantic search (non-blocking)
    this.generateAndStoreEmbedding(id, item).catch((err) =>
      console.error('Embedding generation failed:', err),
    );

    return item;
  }

  async update(id: string, updates: Partial<CreateItemDto>, userId: string) {
    await this.findOne(id);
    return this.dynamo.update(this.table, { id }, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });
  }

  async transfer(id: string, dto: TransferItemDto, userId: string) {
    const item = await this.findOne(id);
    const historyEntry = {
      from: { placeId: item.placeId, shelfId: item.shelfId, section: item.section },
      to: { placeId: dto.placeId, shelfId: dto.shelfId, section: dto.section },
      movedBy: userId,
      movedAt: new Date().toISOString(),
      note: dto.note,
    };

    return this.dynamo.update(this.table, { id }, {
      placeId: dto.placeId,
      shelfId: dto.shelfId,
      section: dto.section,
      transferHistory: [...(item.transferHistory ?? []), historyEntry],
      updatedAt: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.dynamo.delete(this.table, { id });
    return { success: true };
  }

  private async generateAndStoreEmbedding(id: string, item: Record<string, any>) {
    const text = [item.name, item.brandName, item.category, ...(item.tags ?? [])].filter(Boolean).join(' ');
    const embedding = await this.nova.generateEmbedding(text);
    await this.dynamo.update(this.table, { id }, {
      embedding,
      embeddingUpdatedAt: new Date().toISOString(),
    });
  }
}
