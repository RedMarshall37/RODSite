import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { JwtService } from '@nestjs/jwt';
import { UserMessage } from '../models/UserMessage.model';
import { DeveloperAnswerService } from './developer-answer.service';
import { DeveloperAnswerController } from './developer-answer.controller';
import { DeveloperAnswer } from '../models/developer-answer.model';

@Module({
  imports: [SequelizeModule.forFeature([UserMessage, User, DeveloperAnswer])],
  controllers: [DeveloperAnswerController],
  providers: [DeveloperAnswerService, JwtService],
  exports: [DeveloperAnswerService],
})
export class DeveloperAnswerModule {}
