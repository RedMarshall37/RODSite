import { InjectModel } from '@nestjs/sequelize';
import { UserMessage } from '../models/UserMessage.model';
import { createMessageDto } from './dto/create-message.dto';
import { Users } from '../auth/user-auth/users.decorator';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../models/users.model';
import { DeveloperAnswer } from '../models/developer-answer.model';

export class UserMessageService {
  constructor(
    @InjectModel(UserMessage) private userMessageRepository: typeof UserMessage,
  ) {}

  async getAllUserMessages(): Promise<UserMessage[]> {
    const users = await this.userMessageRepository.findAll({
      include: { all: true },
    });
    return users;
  }

  async createUserMessages(dto: createMessageDto, user: any) {
    const text = dto.Text;
    dto.UserID = user.id;
    console.log({ ...dto, Text: text });
    const message = await this.userMessageRepository.create({
      ...dto,
      Text: text,
    });
    return message;
  }

  async deleteMessage(id: string) {
    const deleted = await this.userMessageRepository.destroy({
      where: { ID: id },
    });
    return { destroyedRows: deleted };
  }

  async getUserMessagesWithDeveloperAnswers() {
    const userMessagesWithAnswers = await UserMessage.findAll({
      include: [
        {
          model: DeveloperAnswer,
          required: true,
        },
      ],
    });

    return userMessagesWithAnswers;
  }
}
