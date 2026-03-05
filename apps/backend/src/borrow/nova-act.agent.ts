import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BorrowService } from './borrow.service.js';

/** Nova Act BorrowWatchdog: automatically monitors overdue borrows */
@Injectable()
export class NovaActAgent {
  private readonly logger = new Logger(NovaActAgent.name);

  constructor(private readonly borrowService: BorrowService) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async runBorrowWatchdog() {
    this.logger.log('Nova Act BorrowWatchdog: starting cycle');
    try {
      await this.borrowService.processOverdueReminders();
      this.logger.log('Nova Act BorrowWatchdog: cycle complete');
    } catch (err) {
      this.logger.error('Nova Act BorrowWatchdog failed:', err);
    }
  }
}
