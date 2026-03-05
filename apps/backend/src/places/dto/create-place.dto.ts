import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() building?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() floor?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() roomNumber?: string;
}
