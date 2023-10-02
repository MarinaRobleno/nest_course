import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import mongoose from 'mongoose';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all restaurants => GET /restaurants
  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find();
    return restaurants;
  }

  // Create a restaurant => POST /restaurants
  async create(restaurant: Restaurant): Promise<Restaurant> {
    const newRestaurant = await this.restaurantModel.create(restaurant);
    return newRestaurant;
  }

  // Get a single restaurant => GET /restaurants/:id
  async findByID(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  // Update a restaurant => PUT /restaurants/:id
  async update(id: string, restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a restaurant => DELETE /restaurants/:id
  async delete(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndRemove(id);
  }
}
