import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Admin,
  AdminLogin,
  UpdateAdmin,
} from 'src/interfaces/admin/admin.interface';
import { AdminService } from './admin.service';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation/object-id-validation.pipe';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async createAdmin(@Body() admin: Admin) {
    try {
      const isExistAdmin = await this.adminService.isExistAdmin(admin.email);

      if (isExistAdmin) {
        return { isExistAdmin };
      }

      const Admin = await this.adminService.createAdmin(admin);
      return { data: Admin };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Post('login')
  async login(@Body() admin: AdminLogin) {
    const adminLogin = await this.adminService.isExistAdmin(admin.email);
    if (!adminLogin) {
      throw new HttpException('Invalid credentials', 400);
    }
    const isPasswordValid = await bcrypt.compare(
      admin.password,
      adminLogin.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = { sub: adminLogin._id, email: adminLogin.email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { data: token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAdmin(@Param('id', ObjectIdValidationPipe) id: string) {
    try {
      const admin = await this.adminService.getAdmin(id);
      return { data: admin };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAdmin(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() admin: UpdateAdmin,
  ) {
    try {
      const adminUpdate = await this.adminService.updateAdmin(id, admin);
      return { data: adminUpdate };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteAdmin(@Param('id', ObjectIdValidationPipe) id: string) {
    try {
      const adminDelete = await this.adminService.deleteAdmin(id);
      return { data: adminDelete };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }
}
