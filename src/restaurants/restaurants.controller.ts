import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create.restaurant.dto';
import { UpdateRestaurantDto } from './dto/update.restaurant.dto';

// this is the route, which would be /restaurants
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // Get all restaurants => GET /restaurants
  @Get()
  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  // Create a restaurant => POST /restaurants
  @Post()
  async createRestaurant(
    @Body() // HERE we import the dto
    restaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
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
  async updateRestaurant(
    @Param('id') // HERE we import the param
    id: string,
    @Body() // HERE we import the dto
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.findByID(id);

    return this.restaurantsService.update(id, restaurant);
  }

  // Delete a restaurant => DELETE /restaurants/:id
  @Delete(':id')
  async deleteRestaurant(
    @Param('id') // HERE we import the param
    id: string,
  ): Promise<Restaurant> {
    await this.restaurantsService.findByID(id);

    return this.restaurantsService.delete(id);
  }
}
