import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ISADMIN_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminGuard = this.reflector.getAllAndOverride<string>(ISADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAdminGuard) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const user = this.jwtService.verify(token);
    return user.isAdmin;
  }
}
