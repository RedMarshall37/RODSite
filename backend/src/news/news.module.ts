// news.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from '../models/news.model';
import { NewsView } from '../models/news-view.model';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/services/upload.service';

@Module({
  imports: [SequelizeModule.forFeature([News, NewsView])],
  controllers: [NewsController],
  providers: [NewsService, JwtService, UploadService],
})
export class NewsModule {}
