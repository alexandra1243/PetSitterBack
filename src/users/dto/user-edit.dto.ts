import { PartialType } from '@nestjs/swagger';
import { UserDto } from '@users/dto/user.dto';

export class EditUserDto extends PartialType(UserDto) { }