import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUser, User } from 'src/interfaces/user/user.interface';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation/object-id-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  /*
    Routes:
    GET /users
    GET /users/:id
    POST /users
    PATCH /users/:id
    DELETE /users/:id
  */

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('role') role?: 'intern' | 'student' | 'professor',
  ) {
    try {
      const users = await this.usersService.findAll(role);
      if (!users || users.length === 0) {
        throw new HttpException('No users found', 400);
      }

      return {data: users};
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', 400);
      }
      return {
        data: user,
      };
    } catch (error) {
      throw new HttpException('Internal server error', 400);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() user: User) {
    try {
      const newUser = await this.usersService.create(user);

      return {
        message: 'Users created successfully',
        success: true,
        data: newUser,
      };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() userUpdate: updateUser,
  ) {
    try {
      const updateUser = await this.usersService.update(id, userUpdate);

      return {
        message: 'Users updated successfully',
        success: true,
        data: updateUser,
      };
    } catch (error) {
      throw new HttpException('internal server error', 500);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    try {
      const userDelete = await this.usersService.delete(id);

      return {
        message: 'Users deleted successfully',
        success: true,
        data: userDelete,
      };
    } catch (error) {
      throw new HttpException('internal server error', 500);
    }
  }
}
