import { Schema } from "mongoose";
import * as bcrypt from 'bcryptjs';

export const AdminSchema = new Schema({
    name: String,
    email: String,
    password: String
});
AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });

  
export interface AdminDTO {
    readonly name: string;
    readonly email: string;
    readonly password: string;
}