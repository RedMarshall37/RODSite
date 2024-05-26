import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users.model';
import { userLoginDto } from 'src/users/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(userDto: userLoginDto) {
    const user = await this.usersService.findOne(userDto.Nickname);

    if (!user) {
      return null;
    }

    const passwordEquals = await bcrypt.compare(
      userDto.Password,
      user.dataValues.Password,
    );

    console.log(userDto.Password);
    console.log(user.dataValues.Password);
    if (passwordEquals) {
      return user;
    }

    return null;
  }

  async login(userDto: userLoginDto) {
    const user = await this.validateUser(userDto);
    if (!user) {
      throw new HttpException('ErrorInPasswordOrLogin', HttpStatus.BAD_REQUEST);
    }
    const token = await this.generateToken(user);
    return {
      token: token,
    };
  }

  async registration(userDto: createUserDto) {
    const candidateByNickname = await this.usersService.findOne(userDto.Nickname);
    if (candidateByNickname) {
      throw new HttpException('Nickname already exists', HttpStatus.BAD_REQUEST);
    }

    const candidateByEmail = await this.usersService.findByEmail(userDto.Email);
    if (candidateByEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.createUser(userDto);
    return user;
  }

  private async generateToken(user: User) {
    const userData = await this.usersService.getUserById(String(user.ID));
    const payload = { id: user.ID, isAdmin: userData.isAdmin, isBanned: userData.isBanned };
    return this.jwtService.sign(payload);
  }
}
