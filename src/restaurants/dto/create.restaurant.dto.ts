import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsNotEmpty() // Means that this field cannot be empty
  @IsString() // Means that this field must be a string
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  // Always pass in the options as the second argument
  @IsEmail({}, { message: 'Must be a valid email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber('US')
  readonly phoneNo: number;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Must be a valid category' })
  readonly category: Category;

  readonly images?: object[];
}
