import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service.js';
import { v4 as uuidv4 } from 'uuid';
import { CreateShelfDto } from './dto/create-shelf.dto.js';

@Injectable()
export class ShelvesService {
  private readonly table = process.env.DYNAMODB_SHELVES_TABLE!;

  constructor(private readonly dynamo: DynamoService) {}

  async findByPlace(placeId: string) {
    const shelves = await this.dynamo.query(
      this.table,
      'placeId-index',
      '#placeId = :placeId',
      { ':placeId': placeId },
      { '#placeId': 'placeId' },
    );
    return shelves.filter((s) => !s.isDeleted);
  }

  async findOne(id: string) {
    const shelf = await this.dynamo.get(this.table, { id });
    if (!shelf || shelf.isDeleted) throw new NotFoundException(`Shelf ${id} not found`);
    return shelf;
  }

  async create(dto: CreateShelfDto, userId: string) {
    const shelf = {
      id: uuidv4(),
      ...dto,
      itemCount: 0,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    return this.dynamo.put(this.table, shelf);
  }

  async update(id: string, dto: Partial<CreateShelfDto>) {
    await this.findOne(id);
    return this.dynamo.update(this.table, { id }, {
      ...dto,
      updatedAt: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.dynamo.update(this.table, { id }, {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });
  }
}
