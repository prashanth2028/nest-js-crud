import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connectDB, dbConfig } from 'DB-config/db-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    // MongooseModule.forRoot(dbConfig,connectDB()),
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
