import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create.meal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Meal } from './schemas/meal.schema';
import { UpdateMealDto } from './dto/update.meal.dto';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  // Get all meals => GET /meals
  @Get()
  async getAllMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  // Get meals by restaurant => GET /meals/:restaurant
  @Get('/restaurant/:restaurant')
  async getMealsByRestaurant(
    @Param('restaurant') restaurantId: string,
  ): Promise<Meal[]> {
    return this.mealService.findByRestaurant(restaurantId);
  }

  // Get one meal => GET /meals/:id
  @Get(':id')
  async getMeal(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findOne(id);
  }

  // Create new meal => POST /meals/:restaurant
  @Post()
  @UseGuards(AuthGuard())
  createMeal(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }

  // Update a meal => PUT /meals/:id
  @Put(':id')
  @UseGuards(AuthGuard())
  async updateMeal(
    @Param('id') // HERE we import the param
    id: string,
    @Body() // HERE we import the dto
    updateMealDto: UpdateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.update(id, updateMealDto, user);
  }

  // Delete a meal => DELETE /meals/:id
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteMeal(
    @Param('id') // HERE we import the param
    id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: Boolean }> {
    return this.mealService.delete(id, user);
  }
}
