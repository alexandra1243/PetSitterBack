import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from '@users/user.controller';
import { UserService } from '@users/user.service';
import { User, UserSchema } from '@users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }