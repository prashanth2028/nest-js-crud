import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDTO } from './models/adminModel';
import { Admin, UpdateAdmin } from 'src/interfaces/admin/admin.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<AdminDTO>,
  ) {}

  async createAdmin(admin: Admin) {
    const adminCreate = await this.adminModel.create(admin);
    return adminCreate;
  }

  async isExistAdmin(email: string) {
    const admin = await this.adminModel.findOne({ email });
    return admin;
  }

  async getAdmin (id: string) {
    const admin = await this.adminModel.findById(id);
    return admin;
  }

  async updateAdmin (id: string, admin: UpdateAdmin) {
    const adminUpdate = await this.adminModel.findByIdAndUpdate(id, admin, { new: true });
    return adminUpdate;
  }

  async deleteAdmin (id: string) {
    const adminDelete = await this.adminModel.findByIdAndDelete(id);
    return adminDelete;
  }
  
}
