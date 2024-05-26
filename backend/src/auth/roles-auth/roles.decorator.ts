import { SetMetadata } from '@nestjs/common';

export const ISADMIN_KEY = 'AdminGuard';
export const Admin = () => SetMetadata(ISADMIN_KEY, true);

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles:string[]) => SetMetadata(ROLES_KEY, roles);
