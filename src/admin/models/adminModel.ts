import { Schema } from "mongoose";

export const AdminSchema = new Schema({
    name: String,
    email: String,
    password: String
});

export interface AdminDTO {
    readonly name: string;
    readonly email: string;
    readonly password: string;
}