import { IsString, IsOptional, IsArray, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ItemCategory {
  ELECTRONICS = 'electronics',
  AV_EQUIPMENT = 'av_equipment',
  FURNITURE = 'furniture',
  LAB_EQUIPMENT = 'lab_equipment',
  TOOLS = 'tools',
  BOOKS = 'books',
  SPORTING = 'sporting',
  CLOTHING = 'clothing',
  OTHER = 'other',
}

export class CreateItemDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() brandName?: string;
  @ApiProperty({ enum: ItemCategory }) @IsEnum(ItemCategory) category: ItemCategory;
  @ApiProperty({ required: false }) @IsArray() @IsOptional() tags?: string[];
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty() @IsString() placeId: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() shelfId?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() section?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() notes?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() serialNumber?: string;
  @ApiProperty({ required: false }) @IsArray() @IsOptional() imageKeys?: string[];
}
