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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { successResponse, errorResponse } from 'utlis/response_handler';
import { Request, Response } from 'express';
import { updateUser, User } from 'src/interfaces/user/user.interface';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation/object-id-validation.pipe';

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

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('role') role?: 'intern' | 'student' | 'professor',
  ) {
    try {
      const users = await this.usersService.findAll(role);
      if (!users || users.length === 0) {
        return errorResponse(res, 400, 'No users found');
      }

      return successResponse(res, 200, 'Users found', users);
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return errorResponse(res, 400, 'No user found');
      }
      return successResponse(res, 200, 'User found', user);
    } catch (error) {
      throw new HttpException('Internal server error', 400);
    }
  }

  @Post()
  async create(@Body() user: User, @Req() req: Request, @Res() res: Response) {
    try {
      const newUser = await this.usersService.create(user);

      return successResponse(res, 200, 'User created', newUser);
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch(':id')
  async update(
    @Param('id',ObjectIdValidationPipe) id: string,
    @Body() userUpdate: updateUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const updateUser = await this.usersService.update(id, userUpdate);

      return successResponse(res, 200, 'user updated', updateUser);

    } catch (error) {
      throw new HttpException('internal server error', 500);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string , @Req() req: Request , @Res() res:Response) {
    try {
        const userDelete = await this.usersService.delete(id);

        return successResponse(res,200,'user deleted',userDelete);
        
    } catch (error) {
        throw new HttpException('internal server error', 500);
    }
  }
}
