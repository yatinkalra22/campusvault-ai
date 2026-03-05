import { Module } from '@nestjs/common';
import { BorrowController } from './borrow.controller.js';
import { BorrowService } from './borrow.service.js';
import { NovaActAgent } from './nova-act.agent.js';

@Module({
  controllers: [BorrowController],
  providers: [BorrowService, NovaActAgent],
  exports: [BorrowService],
})
export class BorrowModule {}
