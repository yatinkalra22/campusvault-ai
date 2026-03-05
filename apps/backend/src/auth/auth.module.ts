import { Module } from '@nestjs/common';
import { CognitoAuthGuard } from './cognito.guard.js';
import { RolesGuard } from './roles.guard.js';

@Module({
  providers: [CognitoAuthGuard, RolesGuard],
  exports: [CognitoAuthGuard, RolesGuard],
})
export class AuthModule {}
