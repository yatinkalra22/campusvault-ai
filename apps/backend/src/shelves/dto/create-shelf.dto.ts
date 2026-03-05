import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShelfDto {
  @ApiProperty() @IsString() placeId: string;
  @ApiProperty() @IsString() @MinLength(1) name: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() section?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
}
