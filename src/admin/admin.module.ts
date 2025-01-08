import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './models/adminModel';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AdminService, JwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
