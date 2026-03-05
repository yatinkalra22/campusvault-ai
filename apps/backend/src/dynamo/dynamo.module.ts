import { Global, Module } from '@nestjs/common';
import { DynamoService } from './dynamo.service.js';

@Global()
@Module({
  providers: [DynamoService],
  exports: [DynamoService],
})
export class DynamoModule {}
