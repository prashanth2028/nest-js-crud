import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './models/userModel';
import { updateUser,User } from 'src/interfaces/user/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  async findAll(role?: 'intern' | 'student' | 'professor'): Promise<User[]> {
    if (role) {
      return this.userModel.find({ role }).exec();
    }
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async create(user:User): Promise<User> {
    return this.userModel.create(user);
  }

  async update(
    id: string,
    userUpdate: updateUser,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, userUpdate, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
