import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, 
  versionKey: false, 
})
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: 'intern' })
  role: 'intern' | 'student' | 'professor';
}

export const UserSchema = SchemaFactory.createForClass(User);
