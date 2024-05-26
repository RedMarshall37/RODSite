import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../models/users.model';
import { UserMessage } from './UserMessage.model';

interface DeveloperAnswerCreationAttrs {
  Text: string;
  UserID: number;
  UserMessageID: number;
}

@Table({
  tableName: 'DeveloperAnswer',
  createdAt: 'DateTime',
  updatedAt: false,
} as any)
export class DeveloperAnswer extends Model<
  DeveloperAnswer,
  DeveloperAnswerCreationAttrs
> {
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

  @ForeignKey(() => UserMessage)
  UserMessageID: number;

  @ApiProperty({
    example: 'Немало',
    description: 'Ответ на вопрос пользователя',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  Text: string;

  @ApiProperty({
    example: '2024-05-16T14:25:39.580Z',
    description: 'Дата, в которую ответ был написан',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  DateTime: Date;
}
