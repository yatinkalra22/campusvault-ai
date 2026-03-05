import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DynamoModule } from './dynamo/dynamo.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PlacesModule } from './places/places.module.js';
import { ShelvesModule } from './shelves/shelves.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DynamoModule,
    AuthModule,
    PlacesModule,
    ShelvesModule,
  ],
})
export class AppModule {}
