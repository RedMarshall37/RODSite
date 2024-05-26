import { Column, DataType, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { User } from './users.model';
import { ApiProperty } from '@nestjs/swagger';
import { NewsView } from './news-view.model';

interface NewsCreationAttrs {
  title: string;
  content: string;
}

@Table({ tableName: 'News', createdAt: false, updatedAt: false })
export class News extends Model<News, NewsCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  ID: number;

  @ApiProperty({ example: 'Title of the news', description: 'Заголовок новости' })
  @Column({ type: DataType.STRING, allowNull: false })
  Header: string;

  @ApiProperty({ example: 'Content of the news', description: 'Содержание новости' })
  @Column({ type: DataType.TEXT, allowNull: false })
  Text: string;

  @ApiProperty({ example: 'pupupu.png', description: 'Картинка новости' })
  @Column({ type: DataType.STRING, allowNull: false })
  ImageName: string;

  @ApiProperty({ example: '2024-03-31T10:45:57.082Z', description: 'Дата публикации' })
  @Column({ type: DataType.DATE, allowNull: false })
  PublicationDate: Date;

  @BelongsToMany(() => User, () => NewsView)
  users: User[];
}