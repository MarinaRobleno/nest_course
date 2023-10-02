import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all restaurants => GET /restaurants
  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 2;

    const currentPage = Number(query.page) || 1;

    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? { name: { $regex: query.keyword, $options: 'i' } }
      : {};

    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
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
