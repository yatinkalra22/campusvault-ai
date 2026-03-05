import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service.js';
import { NovaService } from '../nova/nova.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { v4 as uuidv4 } from 'uuid';
import { CreateBorrowDto } from './dto/create-borrow.dto.js';

@Injectable()
export class BorrowService {
  private readonly table = process.env.DYNAMODB_BORROWS_TABLE!;
  private readonly itemsTable = process.env.DYNAMODB_ITEMS_TABLE!;

  constructor(
    private readonly dynamo: DynamoService,
    private readonly nova: NovaService,
    private readonly notifications: NotificationsService,
  ) {}

  async createRequest(dto: CreateBorrowDto, requestedBy: string) {
    const item = await this.dynamo.get(this.itemsTable, { id: dto.itemId });
    if (!item) throw new BadRequestException('Item not found');
    if (item.status !== 'available') {
      throw new BadRequestException(`Item is currently ${item.status}`);
    }

    const request = {
      id: uuidv4(),
      ...dto,
      itemName: item.name,
      requestedBy,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      remindersSent: 0,
      isOverdue: false,
    };

    await this.dynamo.put(this.table, request);
    await this.notifications.notifyBorrowRequest(request, item);
    return request;
  }

  async approve(borrowId: string, approverId: string) {
    const borrow = await this.getBorrow(borrowId);

    await this.dynamo.update(this.table, { id: borrowId }, {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date().toISOString(),
    });

    await this.dynamo.update(this.itemsTable, { id: borrow.itemId }, {
      status: 'borrowed',
      currentBorrowId: borrowId,
    });

    await this.notifications.notifyBorrowApproved(borrow);
    return { success: true };
  }

  async reject(borrowId: string, approverId: string, reason?: string) {
    const borrow = await this.getBorrow(borrowId);

    await this.dynamo.update(this.table, { id: borrowId }, {
      status: 'rejected',
      rejectedBy: approverId,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    await this.notifications.notifyBorrowRejected(borrow, reason);
    return { success: true };
  }

  async returnItem(borrowId: string, returnedBy: string, condition?: string) {
    const borrow = await this.getBorrow(borrowId);

    await this.dynamo.update(this.table, { id: borrowId }, {
      status: 'returned',
      returnedAt: new Date().toISOString(),
      returnedBy,
      returnCondition: condition ?? 'good',
    });

    await this.dynamo.update(this.itemsTable, { id: borrow.itemId }, {
      status: 'available',
      currentBorrowId: null,
    });

    return { success: true };
  }

  async getMyBorrows(userId: string) {
    return this.dynamo.query(
      this.table,
      'requestedBy-index',
      '#requestedBy = :userId',
      { ':userId': userId },
      { '#requestedBy': 'requestedBy' },
    );
  }

  async getPending() {
    return this.dynamo.scan(
      this.table,
      '#status = :pending',
      { ':pending': 'pending' },
      { '#status': 'status' },
    );
  }

  async getBorrowsByItem(itemId: string) {
    return this.dynamo.query(
      this.table,
      'itemId-index',
      '#itemId = :itemId',
      { ':itemId': itemId },
      { '#itemId': 'itemId' },
    );
  }

  /** Called by Nova Act agent on schedule to process overdue items */
  async processOverdueReminders() {
    const now = new Date();
    const allActive = await this.dynamo.scan(
      this.table,
      '#status = :approved',
      { ':approved': 'approved' },
      { '#status': 'status' },
    );

    for (const borrow of allActive) {
      const dueDate = new Date(borrow.dueAt);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysOverdue >= 0) {
        const item = await this.dynamo.get(this.itemsTable, { id: borrow.itemId });
        const message = await this.nova.generateReminderMessage({
          borrowerName: borrow.requestedByName ?? 'Student',
          itemName: item?.name ?? 'item',
          daysOverdue,
        });

        await this.notifications.sendOverdueEmail(borrow, message, daysOverdue);

        await this.dynamo.update(this.table, { id: borrow.id }, {
          remindersSent: (borrow.remindersSent ?? 0) + 1,
          lastReminderAt: new Date().toISOString(),
        });

        if (daysOverdue >= 3) {
          await this.dynamo.update(this.itemsTable, { id: borrow.itemId }, { status: 'overdue' });
          await this.dynamo.update(this.table, { id: borrow.id }, { isOverdue: true });
          await this.notifications.notifyAdminOverdue(borrow, item, daysOverdue);
        }
      }
    }
  }

  private async getBorrow(id: string) {
    const borrow = await this.dynamo.get(this.table, { id });
    if (!borrow) throw new NotFoundException(`Borrow request ${id} not found`);
    return borrow;
  }
}
