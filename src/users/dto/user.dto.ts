import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '' })
  phoneNumber?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 1 })
  type?: number;
}