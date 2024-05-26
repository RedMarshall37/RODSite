import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UserMessageModule } from './usermessage/user-message.module';
import { UserMessage } from './models/UserMessage.model';
import { DeveloperAnswer } from './models/developer-answer.model';
import { DeveloperAnswerModule } from './developeranswer/developer-answer.module';
import { HttpModule } from '@nestjs/axios';
import { News } from './models/news.model';
import { NewsView } from './models/news-view.model';
import { NewsModule } from './news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'), // Путь к папке с изображениями
      serveRoot: '/images', // Маршрут, по которому будет доступ к изображениям
      renderPath: null // Убедитесь, что корневой путь не обрабатывается как SPA
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres', // Указываем диалект базы данных (например, PostgreSQL)
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, UserMessage, DeveloperAnswer, News, NewsView], // Перечисляем модели
      autoLoadModels: true,
    }),
    HttpModule,
    UsersModule,
    AuthModule,
    UserMessageModule,
    DeveloperAnswerModule,
    NewsModule
  ],
  
  controllers: [AppController],
})
export class AppModule {}
