import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';
import { DeveloperAnswer } from './developer-answer.model';

interface UserMessageCreationAttrs {
  Text: string;
  UserID: number;
}

@Table({
  tableName: 'UserMessage',
  createdAt: 'DateTime',
  updatedAt: false,
} as any)
export class UserMessage extends Model<UserMessage, UserMessageCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  ID: number;

  @ForeignKey(() => User)
  UserID: number;

  @ApiProperty({
    example: 'Сколько будет стоить ваша игра?',
    description: 'Вопрос пользователя',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  Text: string;

  @ApiProperty({
    example: '2024-05-16T14:25:39.580Z',
    description: 'Дата, в которую вопрос был задан',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  DateTime: Date;

  @HasMany(() => DeveloperAnswer)
  developerAnswers: DeveloperAnswer[];
}
