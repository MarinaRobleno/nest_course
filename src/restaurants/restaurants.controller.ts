import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create.restaurant.dto';
import { UpdateRestaurantDto } from './dto/update.restaurant.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// this is the route, which would be /restaurants
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // Get all restaurants => GET /restaurants
  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  // Create a restaurant => POST /restaurants
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async createRestaurant(
    @Body() // HERE we import the dto
    restaurant: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  // Get a restaurant by id => GET /restaurants/:id
  @Get(':id')
  async getRestaurant(
    @Param('id') // HERE we import the param
    id: string,
  ): Promise<Restaurant> {
    return this.restaurantsService.findByID(id);
  }

  // Update a restaurant => PUT /restaurants/:id
  @Put(':id')
  @UseGuards(AuthGuard())
  async updateRestaurant(
    @Param('id') // HERE we import the param
    id: string,
    @Body() // HERE we import the dto
    restaurant: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const rest = await this.restaurantsService.findByID(id);

    // Limit the edition of the restaurant to the owner
    if (rest.user.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to update this restaurant',
      );
    }

    return this.restaurantsService.update(id, restaurant);
  }

  // Delete a restaurant => DELETE /restaurants/:id
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteRestaurant(
    @Param('id') // HERE we import the param
    id: string,
  ): Promise<{ deleted: Boolean }> {
    await this.restaurantsService.findByID(id);

    const restaurant = this.restaurantsService.delete(id);

    if (restaurant) {
      return { deleted: true };
    }
  }
}
