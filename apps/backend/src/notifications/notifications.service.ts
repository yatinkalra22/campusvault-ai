import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly ses = new SESClient({ region: process.env.AWS_REGION });
  private readonly fromEmail = process.env.SES_FROM_EMAIL ?? 'noreply@campusvault.dev';

  async notifyBorrowRequest(borrow: Record<string, any>, item: Record<string, any>) {
    this.logger.log(`Borrow request: ${borrow.requestedBy} wants ${item.name}`);
    // WebSocket notification handled by gateway; email below
    await this.sendEmail(
      'admin@campusvault.dev', // In production, resolve faculty email
      `New Borrow Request: ${item.name}`,
      `A borrow request has been submitted for "${item.name}" by user ${borrow.requestedBy}.\nPurpose: ${borrow.purpose}\nDue: ${borrow.dueAt}`,
    ).catch((err) => this.logger.warn('Email failed:', err.message));
  }

  async notifyBorrowApproved(borrow: Record<string, any>) {
    this.logger.log(`Borrow approved: ${borrow.id}`);
    // In production, resolve borrower email from users table
  }

  async notifyBorrowRejected(borrow: Record<string, any>, reason?: string) {
    this.logger.log(`Borrow rejected: ${borrow.id}, reason: ${reason}`);
  }

  async sendOverdueEmail(borrow: Record<string, any>, message: string, daysOverdue: number) {
    this.logger.log(`Overdue reminder (${daysOverdue}d): borrow ${borrow.id}`);
    await this.sendEmail(
      'borrower@campusvault.dev', // Resolve from users table
      `Overdue: Please return "${borrow.itemName ?? 'item'}"`,
      message,
    ).catch((err) => this.logger.warn('Overdue email failed:', err.message));
  }

  async notifyAdminOverdue(
    borrow: Record<string, any>,
    item: Record<string, any> | null,
    daysOverdue: number,
  ) {
    this.logger.log(`Admin alert: ${item?.name} is ${daysOverdue} days overdue`);
  }

  private async sendEmail(to: string, subject: string, body: string) {
    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    });
    return this.ses.send(command);
  }
}
