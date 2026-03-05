import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferItemDto {
  @ApiProperty() @IsString() placeId: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() shelfId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() section?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() note?: string;
}
