import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { Meal } from './schemas/meal.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all meals  =>  GET  /meals
  async findAll(): Promise<Meal[]> {
    const meals = await this.mealModel.find();
    return meals;
  }

  // Get meals by restaurant  =>  GET  /meals/:restaurant
  async findByRestaurant(restaurantId: string): Promise<Meal[]> {
    const isValidId = mongoose.Types.ObjectId.isValid(restaurantId);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }

    const meals = await this.mealModel.find({ restaurant: restaurantId });

    if (!meals) {
      throw new NotFoundException('Meals not found');
    }

    return meals;
  }

  // Get one meal  =>  GET  /meals/:id
  async findOne(id: string): Promise<Meal> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }

    const meal = await this.mealModel.findById(id);

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return meal;
  }

  // Create a new meal  =>  POST  /meals/restaurant/:id
  async create(meal: Meal, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    // Saving meal ID in the restaurant menu
    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found with this ID.');
    }

    // Check ownership of the restaurant
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not add meal to this restaurant.');
    }

    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated._id as any);
    await restaurant.save();

    return mealCreated;
  }

  // Update a meal  =>  PUT  /meals/:id
  async update(id: string, meal: Meal, user: User): Promise<Meal> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }

    const mealUpdated = await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });

    if (!mealUpdated) {
      throw new NotFoundException('Meal not found');
    }

    // Check ownership of the meal
    if (mealUpdated.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not update this meal.');
    }

    return mealUpdated;
  }

  // Delete a meal  =>  DELETE  /meals/:id
  async delete(id: string, user: User): Promise<{ deleted: Boolean }> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }

    const meal = await this.mealModel.findByIdAndRemove(id);

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    // Check ownership of the meal
    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not delete this meal.');
    }

    // Find restaurants that have this meal in their menu
    const restaurants = await this.restaurantModel.find({ menu: id });

    // Remove meal from the menu of all restaurants
    for (const restaurant of restaurants) {
      // Remove the meal's ID from the menu array
      const menuIndex = restaurant.menu.indexOf(id as any);
      if (menuIndex !== -1) {
        restaurant.menu.splice(menuIndex, 1);
      }

      // Save the updated restaurant document
      await restaurant.save();
    }

    return { deleted: true };
  }
}
