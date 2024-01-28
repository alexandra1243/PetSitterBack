import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;
}