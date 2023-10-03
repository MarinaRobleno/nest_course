import { Controller, Body, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Get all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  // Register a new user
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  // Login a user
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
