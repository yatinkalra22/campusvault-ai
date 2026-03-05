import { Global, Module } from '@nestjs/common';
import { NovaService } from './nova.service.js';

@Global()
@Module({
  providers: [NovaService],
  exports: [NovaService],
})
export class NovaModule {}
