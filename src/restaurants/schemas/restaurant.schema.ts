import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  // enum allow us to define a bunch of constants that can be used to describe a value
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINING = 'Fine Dining',
}

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
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
