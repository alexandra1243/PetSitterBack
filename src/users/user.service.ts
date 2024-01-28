import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './user.schema';
import { EditUserDto } from './dto/user-edit.dto';
import { FilterDto } from '@common/dto/filter.dto';

import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@common/constants/pagination.constants';
import { ALLOWED_LOCALE } from '@common/constants/locale.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  
  async create(userDto: UserDto): Promise<User> {
    return new this.userModel(userDto).save();
  }

  async getAll(filterDto: FilterDto): Promise<User[]> {
    const { search, page = DEFAULT_PAGE, limit = DEFAULT_ITEMS_PER_PAGE } = filterDto;
    const regex = search && new RegExp(search, 'i');
    const offset = (page - 1) * limit;

    const filter = {
      $and: [
        search ? {
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { phoneNumber: { $regex: regex } },
            { email: { $regex: regex } },
          ]
        } : {}
      ]
    };

    return await this.userModel.find(filter).skip(offset).limit(limit).collation(ALLOWED_LOCALE.DE_AT);
  }

  async update(id: string, userDto: EditUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, userDto);
  }
}