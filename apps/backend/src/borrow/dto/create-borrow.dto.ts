import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBorrowDto {
  @ApiProperty() @IsString() itemId: string;
  @ApiProperty() @IsString() @MinLength(3) purpose: string;
  @ApiProperty({ description: 'ISO 8601 date' }) @IsString() dueAt: string;
}
