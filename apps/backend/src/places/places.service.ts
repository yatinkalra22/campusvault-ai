import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service.js';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlaceDto } from './dto/create-place.dto.js';

@Injectable()
export class PlacesService {
  private readonly table = process.env.DYNAMODB_PLACES_TABLE!;

  constructor(private readonly dynamo: DynamoService) {}

  async findAll() {
    const places = await this.dynamo.scan(this.table);
    return places.filter((p) => !p.isDeleted);
  }

  async findOne(id: string) {
    const place = await this.dynamo.get(this.table, { id });
    if (!place || place.isDeleted) throw new NotFoundException(`Place ${id} not found`);
    return place;
  }

  async create(dto: CreatePlaceDto, userId: string) {
    const place = {
      id: uuidv4(),
      ...dto,
      itemCount: 0,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    return this.dynamo.put(this.table, place);
  }

  async update(id: string, dto: Partial<CreatePlaceDto>, userId: string) {
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
