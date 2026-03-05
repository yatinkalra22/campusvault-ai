import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/cognito.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ShelvesService } from './shelves.service.js';
import { CreateShelfDto } from './dto/create-shelf.dto.js';

@ApiTags('shelves')
@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@Controller('shelves')
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Get()
  findByPlace(@Query('placeId') placeId: string) {
    return this.shelvesService.findByPlace(placeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shelvesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateShelfDto, @Request() req: any) {
    return this.shelvesService.create(dto, req.user.sub);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: Partial<CreateShelfDto>) {
    return this.shelvesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.shelvesService.remove(id);
  }
}
