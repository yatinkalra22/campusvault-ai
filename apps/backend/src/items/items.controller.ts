import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards, Query, Request, Res, Header,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/cognito.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ItemsService } from './items.service.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { TransferItemDto } from './dto/transfer-item.dto.js';

@ApiTags('items')
@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() filters: Record<string, string>) {
    return this.itemsService.findAll(filters);
  }

  @Get('export/csv')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="campusvault-items.csv"')
  async exportCsv(@Res() res: Response) {
    const items = await this.itemsService.findAll({});
    const headers = ['id', 'name', 'brandName', 'category', 'status', 'placeName', 'shelfName', 'condition', 'addedAt'];
    const rows = items.map((item: any) =>
      headers.map((h) => `"${String(item[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    res.send([headers.join(','), ...rows].join('\n'));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Post('analyze-image')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  analyzeImage(@Body('imageBase64') imageBase64: string) {
    return this.itemsService.analyzeImage(imageBase64);
  }

  @Post('upload-url')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  getUploadUrl(@Body('contentType') contentType: string) {
    return this.itemsService.getUploadPresignedUrl(contentType);
  }

  @Post()
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateItemDto, @Request() req: any) {
    return this.itemsService.create(dto, req.user.sub);
  }

  @Put(':id')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: Partial<CreateItemDto>, @Request() req: any) {
    return this.itemsService.update(id, dto, req.user.sub);
  }

  @Put(':id/transfer')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  transfer(@Param('id') id: string, @Body() dto: TransferItemDto, @Request() req: any) {
    return this.itemsService.transfer(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
