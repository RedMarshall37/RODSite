import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { News } from '../models/news.model';
import { NewsView } from '../models/news-view.model';
import { UpdateOptions } from 'sequelize';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News) private newsRepository: typeof News,
    @InjectModel(NewsView) private newsViewRepository: typeof NewsView,
  ) {}

  async createNews(dto: any) {
    return this.newsRepository.create(dto);
  }

  async getAllNews() {
    return this.newsRepository.findAll();
  }

  async getNewsById(id: string) {
    return this.newsRepository.findOne({ where: { ID: id } });
  }

  async updateNews(id: string, dto: any) {
    await this.newsRepository.update(dto, { where: { ID: id } });
    return this.getNewsById(id);
  }

  async deleteNews(id: string) {
    return this.newsRepository.destroy({ where: { ID: id } });
  }

  async addNewsView(userId: number, newsId: number) {
    return this.newsViewRepository.create({ userId, newsId });
  }
}
