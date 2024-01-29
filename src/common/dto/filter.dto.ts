import { IsOptional, IsString, IsNumber, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  sortOrder?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value && parseInt(value))
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value && parseInt(value))
  limit?: number;
}