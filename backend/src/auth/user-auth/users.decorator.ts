import { createParamDecorator, SetMetadata } from '@nestjs/common';

export const USER_KEY = 'UserGuard';
export const Users = () => SetMetadata(USER_KEY, true);

export const AuthUser = createParamDecorator((data, req) => {
  const request = req.switchToHttp().getRequest();
  return request.user;
});
