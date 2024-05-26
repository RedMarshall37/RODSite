import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../auth/jwt-auth/skip-auth.decorator';
import { createUserDto } from './dto/create-user.dto';
import { User } from '../models/users.model';
import { UsersService } from './users.service';
import { UsersGuard } from '../auth/user-auth/users.guard';
import { Users } from '../auth/user-auth/users.decorator';
import { Admin } from 'src/auth/roles-auth/roles.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Получение пользователя по значению' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: '1',
    type: 'string',
  })
  getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Users()
  @Get('/profile/:id')
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: '1',
    type: 'string',
  })
  getProfile(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Users()
  @Put('/:id')
  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiResponse({ status: 200, type: User })
  updateProfile(@Param('id') id: string, @Body() dto: createUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Admin()
  @Put('isBanned/:id')
  @ApiOperation({ summary: 'Установить или убрать статус забаненного' })
  async updateIsBanned(@Param('id') id: string, @Body('isBanned') isBanned: boolean) {
    return this.userService.updateUserBannedStatus(id, isBanned);
  }

  @Admin()
  @Put('isAdmin/:id')
  @ApiOperation({ summary: 'Установить или убрать статус администратора' })
  async updateIsAdmin(@Param('id') id: string, @Body('isAdmin') isAdmin: boolean) {
    return this.userService.updateUserAdminStatus(id, isAdmin);
  }
}
