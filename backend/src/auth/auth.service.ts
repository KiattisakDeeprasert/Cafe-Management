import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh.jwt-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password); // compares hashed password
    if (!isPasswordValid) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: { username: string; password: string }) {
    console.log('Login attempt for username:', loginDto.username); // Log the username
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      console.log('Invalid credentials'); // Log if user is not found or password is incorrect
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    console.log('User validated:', user); // Log the user details
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async resetPassword(
    username: string,
    email: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email !== email) {
      throw new BadRequestException('Email does not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Use user.id instead of user._id
    await this.userService.updatePassword(user._id, hashedPassword);

    return { message: 'Password successfully reset' };
  }
}
