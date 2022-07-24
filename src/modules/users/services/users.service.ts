import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from '@users-dtos';
import { UserModel } from '@users-models';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly model: Model<UserModel>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = await new this.model(createUserDto);
    return await user.save();
  }

  public async findOne(email: string): Promise<UserModel> {
    const user = this.model.findOne({ email }, 'email tasks').exec();
    return user;
  }
}
