import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserMessage } from './UserMessage.model';
import { DeveloperAnswer } from './developer-answer.model';

interface UserCreationAttrs {
  Nickname: string;
  Password: string;
  Email: string;
  isAdmin: boolean;
  isBanned: boolean;
}

@Table({
  tableName: 'Users',
  createdAt: 'RegistrationDate',
  updatedAt: false,
} as any)
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  ID: number;

  @ApiProperty({ example: 'Nickname', description: 'Ник пользователя' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  Nickname: string;

  @ApiProperty({ example: 'Email', description: 'Почта' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  Email: string;

  @ApiProperty({ example: '123456789', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: true })
  Password: string;

  @ApiProperty({
    example: 'true',
    description: 'Статус, определяющий наличие прав админинстратора',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Статус, определяющий наличие бана',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isBanned: boolean;

  @ApiProperty({
    example: '2024-05-16T14:25:39.580Z',
    description: 'Дата регистрации',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  RegistrationDate: Date;

  @ApiProperty({
    example: '2024-05-16T14:25:39.580Z',
    description: 'День рождения пользователя',
  })
  @Column({ type: DataType.DATEONLY, allowNull: true })
  Bithday: Date;

  @ApiProperty({
    example: 'ул. Громобоя, д.58, кв.4',
    description: 'Адрес пользователя',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  Address: Date;

  @ApiProperty({
    example: '0',
    description: 'Количество раз, сколько пользователь был забанен',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  amountBans: number;

  @ApiProperty({
    example: '100',
    description: 'Количество прочитанных пользователем новостей',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  NumberReadingNews: number;

  @HasMany(() => UserMessage)
  userMessages: UserMessage[];

  @HasMany(() => DeveloperAnswer)
  developerAnswers: DeveloperAnswer[];

  // @BelongsToMany(()=>Event, ()=>UserEvents)
  // events: Event[]
}
