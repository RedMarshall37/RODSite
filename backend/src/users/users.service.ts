import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createUserDto } from './dto/create-user.dto';
import { User } from '../models/users.model';
import * as bcrypt from 'bcrypt';
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { ID: id },
      include: { all: true },
    });
    return user;
  }

  async createUser(dto: createUserDto) {
    const email = dto.Email;
    const hashPassword = await bcrypt.hash(dto.Password, 5);
    const user = await this.userRepository.create({
      ...dto,
      isAdmin: false,
      isBanned: false,
      Password: hashPassword,
      Email: email,
    });
    user.Password = hashPassword;
    return user;
  }
  async findOne(login: string) {
    return this.userRepository.findOne({
      where: { Nickname: login },
      include: { all: true },
    });
  }

  async updateUser(id: string, dto: createUserDto) {
    dto.Password = await bcrypt.hash(dto.Password, 5);
    const user = await this.userRepository.update(dto, { where: { ID: id } });
    return this.getUserById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { Email: email } });
  }
  
  async updateUserBannedStatus(id: string, isBanned: boolean) {
    await this.userRepository.update({ isBanned }, { where: { ID: id } });
    return this.getUserById(id);
  }

  async updateUserAdminStatus(id: string, isAdmin: boolean) {
    await this.userRepository.update({ isAdmin }, { where: { ID: id } });
    return this.getUserById(id);
  }
}
