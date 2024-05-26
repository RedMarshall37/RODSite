import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../auth/jwt-auth/skip-auth.decorator';
import { UserMessage } from '../models/UserMessage.model';
import { UserMessageService } from './user-message.service';
import { createMessageDto } from './dto/create-message.dto';
import { AuthUser, Users } from '../auth/user-auth/users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../models/users.model';
import { Admin } from '../auth/roles-auth/roles.decorator';

@ApiTags('Пользователи')
@Controller('usersmessages')
@Injectable()
export class UserMessageController {
  constructor(private userMessageService: UserMessageService) {}

  @Admin()
  @ApiOperation({ summary: 'Получение всех сообщений' })
  @ApiResponse({ status: 200, type: [UserMessage] })
  @Get()
  getAll(): Promise<UserMessage[]> {
    return this.userMessageService.getAllUserMessages();
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Получение всех сообщений с ответами' })
  @ApiResponse({ status: 200, type: [UserMessage] })
  @Get('/withanswers')
  getAllWithAnswers(): Promise<UserMessage[]> {
    return this.userMessageService.getUserMessagesWithDeveloperAnswers();
  }

  @ApiOperation({ summary: 'Добавление сообщения' })
  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  async login(@Body() userMessageDto: createMessageDto, @AuthUser() user: any) {
    return this.userMessageService.createUserMessages(userMessageDto, user);
  }

  @ApiOperation({ summary: 'Удаление сообщения' })
  @Delete('/:id')
  @Admin()
  async delete(@Param('id') id: string) {
    return this.userMessageService.deleteMessage(id);
  }
}
