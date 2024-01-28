import { Body, Controller, Post, Get, Req, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '@users/user.schema';
import { AuthenticationDto } from '@authentication/dto/authentication.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  @Post()
  @ApiOperation({ summary: 'User login' })
  async authentication(@Body() authenticationDto: AuthenticationDto): Promise<any> {
    const user = await this.userModel.findOne({ email: authenticationDto.email });

    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(authenticationDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.API_SECRET_KEY, { expiresIn: '30d' });

    return { token: accessToken };
  }

  @Get('verify-token')
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Req() req): Promise<any> {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new BadRequestException('Token is missing');
      }
  
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.API_SECRET_KEY);
      const user = await this.userModel.findOne({ _id: decoded.userId });
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumber,
        type: user.type,
        id: user._id
      }

      return { message: 'Token is valid', user: userData };
    } catch (error) {
      throw new BadRequestException('Token is invalid');
    }
  }

  @Post('logout')
  async logout(@Req() req): Promise<any> {
    const token = req.headers.authorization;

    if (!token) {
      throw new BadRequestException('Token is missing');
    }

    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.API_SECRET_KEY);

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new BadRequestException('Token is invalid');
    }
  }
}