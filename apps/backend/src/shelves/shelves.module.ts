import { Module } from '@nestjs/common';
import { ShelvesController } from './shelves.controller.js';
import { ShelvesService } from './shelves.service.js';

@Module({
  controllers: [ShelvesController],
  providers: [ShelvesService],
  exports: [ShelvesService],
})
export class ShelvesModule {}
