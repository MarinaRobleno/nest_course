import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
})
@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  @Prop({ select: false }) // This means that whenever we catch the user, the password will not be included
  password: string;

  @Prop({
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
