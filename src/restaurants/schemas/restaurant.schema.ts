import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Meal } from '../../meal/schemas/meal.schema';

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: Number[];

  @Prop()
  formattedAddress: string;

  @Prop()
  city: string;

  @Prop()
  countryCode: string;

  @Prop()
  zipcode: string;

  @Prop()
  country: string;
}

export enum Category {
  // enum allow us to define a bunch of constants that can be used to describe a value
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINING = 'Fine Dining',
}

@Schema({
  timestamps: true,
})
@Schema()
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNo: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  // ? means optional
  // [] means array and with object type means array of objects
  images?: object[];

  @Prop({ type: Object, ref: 'Location' })
  location?: Location;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
  menu?: Meal[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
