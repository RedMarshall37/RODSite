import { DeveloperAnswer } from '../models/developer-answer.model';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../auth/user-auth/users.decorator';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../models/users.model';
import { createAnswerDto } from './dto/create-answer.dto';
export class DeveloperAnswerService {
  constructor(
    @InjectModel(DeveloperAnswer)
    private developerAnswerRepository: typeof DeveloperAnswer,
  ) {}

  async create(dto: createAnswerDto, user: any) {
    const text = dto.Text;
    console.log(user);
    dto.UserID = user.id;
    const message = await this.developerAnswerRepository.create(
      { ...dto, Text: text },
      user,
    );
    return message;
  }
  async remove(id: string) {
    const deleted = await this.developerAnswerRepository.destroy({
      where: { ID: id },
    });
    return { destroyedRows: deleted };
  }
}
