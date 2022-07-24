import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from '@users-dtos';
import { UserModel } from '@users-models';
import { encrypt } from '@utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly model: Model<UserModel>,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = await new this.model(createUserDto);
    return await user.save();
  }

  public async findOne(email: string): Promise<UserModel> {
    const user = await this.model.findOne({ email }).exec();
    return user;
  }

  public async authenticate(
    authenticateDto: CreateUserDto,
  ): Promise<UserModel> {
    const user = await this.findOne(authenticateDto.email);

    if (user) {
      const passwordEncrypted = await encrypt(
        `${authenticateDto.password}${this.configService.get('secretKey')}`,
      );

      if (passwordEncrypted.toString() === user.password.toString()) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
