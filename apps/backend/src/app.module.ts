import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DynamoModule } from './dynamo/dynamo.module.js';
import { AuthModule } from './auth/auth.module.js';
import { NovaModule } from './nova/nova.module.js';
import { PlacesModule } from './places/places.module.js';
import { ShelvesModule } from './shelves/shelves.module.js';
import { ItemsModule } from './items/items.module.js';
import { BorrowModule } from './borrow/borrow.module.js';
import { SearchModule } from './search/search.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DynamoModule,
    AuthModule,
    NovaModule,
    NotificationsModule,
    PlacesModule,
    ShelvesModule,
    ItemsModule,
    BorrowModule,
    SearchModule,
  ],
})
export class AppModule {}
