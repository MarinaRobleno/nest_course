import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      }); // In this case I believe I could directly pass user, but I guess we do it this way to hash the password before saving it
      const token = await APIFeatures.assignJWTToken(
        newUser._id,
        this.jwtService,
      );
      return { token };
    } catch (err) {
      // handle duplicate email error
      if (err.code === 11000) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await APIFeatures.assignJWTToken(user._id, this.jwtService);
    return { token };
  }
}
