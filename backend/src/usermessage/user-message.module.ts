import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { JwtService } from '@nestjs/jwt';
import { UserMessage } from '../models/UserMessage.model';
import { UserMessageController } from './user-message.controller';
import { UserMessageService } from './user-message.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserMessage,
      User /*, UserRoles, Role, UserEvents, Team,UserTeams]*/,
    ]),
  ],
  controllers: [UserMessageController],
  providers: [UserMessageService, JwtService],
  exports: [UserMessageService],
})
export class UserMessageModule {}
