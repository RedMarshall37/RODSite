import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class BannedUserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      // Нет заголовка авторизации, пропускаем пользователя
      return true;
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      // Нет токена, пропускаем пользователя
      return true;
    }

    try {
      const user = this.jwtService.verify(token);
      if (user.isBanned) {
        // Пользователь забанен
        throw new UnauthorizedException('User is banned');
      }
      return true;
    } catch (error) {
      // Ошибка проверки токена, пропускаем пользователя
      return true;
    }
  }
}
