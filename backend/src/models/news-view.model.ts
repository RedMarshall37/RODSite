import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './users.model';
import { News } from './news.model';

@Table({ tableName: 'NewsViews', createdAt: false, updatedAt: false })
export class NewsView extends Model<NewsView> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => News)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  newsId: number;
}