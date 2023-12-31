import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsOptional,
  IsEmpty,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateRestaurantDto {
  // here every field must be optional
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsOptional()
  readonly email: string;

  @IsPhoneNumber('US')
  @IsOptional()
  readonly phoneNo: number;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsEnum(Category, { message: 'Must be a valid category' })
  @IsOptional()
  readonly category: Category;

  readonly images?: object[];

  @IsEmpty({ message: 'You cannot provide the user Id' })
  readonly user?: User;
}
