import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/cognito.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { BorrowService } from './borrow.service.js';
import { CreateBorrowDto } from './dto/create-borrow.dto.js';

@ApiTags('borrow')
@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body() dto: CreateBorrowDto, @Request() req: any) {
    return this.borrowService.createRequest(dto, req.user.sub);
  }

  @Get('my')
  getMyBorrows(@Request() req: any) {
    return this.borrowService.getMyBorrows(req.user.sub);
  }

  @Get('pending')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  getPending() {
    return this.borrowService.getPending();
  }

  @Get('item/:itemId')
  getBorrowsByItem(@Param('itemId') itemId: string) {
    return this.borrowService.getBorrowsByItem(itemId);
  }

  @Put(':id/approve')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  approve(@Param('id') id: string, @Request() req: any) {
    return this.borrowService.approve(id, req.user.sub);
  }

  @Put(':id/reject')
  @Roles('faculty', 'admin')
  @UseGuards(RolesGuard)
  reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) {
    return this.borrowService.reject(id, req.user.sub, reason);
  }

  @Put(':id/return')
  returnItem(
    @Param('id') id: string,
    @Body('condition') condition: string,
    @Request() req: any,
  ) {
    return this.borrowService.returnItem(id, req.user.sub, condition);
  }
}
