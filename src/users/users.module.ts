import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/userModel';

@Module({
    imports: [
        MongooseModule.forFeature([{name:'User',schema:UserSchema}])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports:[MongooseModule],
})
export class UsersModule {}
