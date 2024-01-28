import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationController } from '@authentication/authentication.controller';
import { User, UserSchema } from '@users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AuthenticationController],
  providers: []
})
export class AuthenticationModule { }