import { Body, Controller, Post, Get, Delete, Put, Param, UseInterceptors, Query, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';

import * as bcrypt from 'bcrypt';

import { NotFoundInterceptor } from '@common/interceptors/not-found.interceptor';

import { UserDto } from '@users/dto/user.dto';
import { User, UserDocument } from '@users/user.schema';
import { EditUserDto } from '@users/dto/user-edit.dto';
import { FilterDto } from '@common/dto/filter.dto';

import { UserService } from '@users/user.service';

import { EMAIL_REGEX } from '@common/constants/regex.constants';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersService: UserService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() userDto: UserDto): Promise<any> {
    if (!EMAIL_REGEX.test(userDto.email)) {
      throw new BadRequestException('Email is not valid.');
    }

    if (userDto.password.length <= 5) {
      throw new BadRequestException('Password must be at least 6 characters long.');
    }

    const user = await this.userModel.findOne({ email: userDto.email });
   
    if (user) {
      // throw new BadRequestException('This email already exists.');
      throw new BadRequestException('Your chosen e-mail address is already registered.');
    }

    const saltRounds = 10;
    const cryptedPassword = await bcrypt.hash(userDto.password, saltRounds);
    userDto.password = cryptedPassword;

    return await this.usersService.create(userDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiImplicitQueries([
    // { name: 'sort', description: 'Sort users', required: false },
    // { name: 'sortOrder', description: 'Sort users by order ASC or DESC', required: false },
    { name: 'search', description: 'Search by key or value', required: false, type: 'string' },
    { name: 'page', description: 'Current page', required: false },
    { name: 'limit', description: 'Number of items per page', required: false },
  ])
  async getAll(@Query() filterDto: FilterDto): Promise<User[]> {
    return this.usersService.getAll(filterDto);
  }
  
  @Get('/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @UseInterceptors(NotFoundInterceptor)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  async delete(@Param('id') id: string): Promise<void> {
    //TODO Should make the user inactive for 30 days, then delete his account if he doesn't logged in this period.
    await this.userModel.deleteOne({ _id: id });
  }
  
  @Put('/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @UseInterceptors(NotFoundInterceptor)
  async update(@Param('id') id: string, @Body() userDto: EditUserDto): Promise<User> {
    if (userDto.password) {
      const saltRounds = 10;
      bcrypt.hash(userDto.password, saltRounds);  
    }

    return this.usersService.update(id, userDto);
  }
}