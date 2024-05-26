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
import { AuthUser, Users } from '../auth/user-auth/users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../models/users.model';
import { Admin } from '../auth/roles-auth/roles.decorator';
import { DeveloperAnswerService } from './developer-answer.service';
import { createAnswerDto } from './dto/create-answer.dto';

@ApiTags('Пользователи')
@Controller('developeranswers')
@Injectable()
export class DeveloperAnswerController {
  constructor(private developerAnswerService: DeveloperAnswerService) {}

  @ApiOperation({ summary: 'Добавление ответа' })
  @Post('/add')
  @Admin()
  async createDeveloperAnswer(
    @Body() dto: createAnswerDto,
    @AuthUser() user: any,
  ) {
    console.log(dto);
    const message = await this.developerAnswerService.create(dto, user);
    return message;
  }

  @ApiOperation({ summary: 'Удаление ответа' })
  @Delete('/:id')
  @Admin()
  async deleteDeveloperAnswer(@Param('id') id: string) {
    const message = await this.developerAnswerService.remove(id);
    return message;
  }
}
