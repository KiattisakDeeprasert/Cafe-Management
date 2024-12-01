import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Res,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: { username: string; password: string }, @Res({ passthrough: true }) res) {
    const { username, password } = loginDto;

    // Call AuthService to validate and login user
    const { accessToken, refreshToken } = await this.authService.login({ username, password });

    // Set access token as a cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // Ensure secure if using HTTPS
    });

    // Return success response with tokens
    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { username, email, newPassword } = resetPasswordDto;

    if (!username || !email || !newPassword) {
      throw new BadRequestException(
        'Username, email, and new password are required',
      );
    }

    return await this.authService.resetPassword(username, email, newPassword);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    // Clear the access token cookie
    res.clearCookie('access_token', { httpOnly: true });
    return {
      message: 'Logout successful',
    };
  }
}