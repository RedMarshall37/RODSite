import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { createUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SkipAuth } from './jwt-auth/skip-auth.decorator';
import { userLoginDto } from 'src/users/dto/user-login.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @Post('/login')
  async login(@Body() userDto: userLoginDto):  Promise<{token: string;}> {
    return this.authService.login(userDto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('/registration')
  registration(@Body() userDto: createUserDto) {
    return this.authService.registration(userDto);
  }
}
