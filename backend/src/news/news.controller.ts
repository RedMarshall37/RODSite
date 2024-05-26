// src/news/news.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { News } from '../models/news.model';
import { Admin } from 'src/auth/roles-auth/roles.decorator';
import { UsersGuard } from 'src/auth/user-auth/users.guard';
import { AuthUser, Users } from 'src/auth/user-auth/users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SkipAuth } from 'src/auth/jwt-auth/skip-auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { Response } from 'express';
import { join, extname } from 'path';
import { diskStorage } from 'multer';
import { Multer } from 'multer'; // Добавляем импорт Multer

@ApiTags('Новости')
@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Создание новости' })
  @ApiResponse({ status: 201, type: News })
  @Admin()
  @Post('/add')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: join(process.cwd(), 'images'), // Путь для сохранения файлов
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${name}-${randomName}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        dto.ImageName = file.filename;
        console.log(file.filename);
      }
      return await this.newsService.createNews(dto);
    } catch (error) {
      console.error('Ошибка при создании новости:', error);
      throw error;
    }
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Получение всех новостей' })
  @ApiResponse({ status: 200, type: [News] })
  @Get()
  getAll() {
    return this.newsService.getAllNews();
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Получение новости по ID' })
  @ApiResponse({ status: 200, type: News })
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.newsService.getNewsById(id);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Получение изображения новости' })
  @ApiResponse({ status: 200, type: News })
  @Get('/image/:imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    res.sendFile(join(process.cwd(), 'uploads', imageName));
  }

  @ApiOperation({ summary: 'Обновление новости' })
  @ApiResponse({ status: 200, type: News })
  @Admin()
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: join(process.cwd(), 'images'), // Путь для сохранения файлов
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${name}-${randomName}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async update(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        dto.ImageName = file.filename;
        console.log(file.filename);
      }
      return await this.newsService.updateNews(id, dto);
    } catch (error) {
      console.error('Ошибка при обновлении новости:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Удаление новости' })
  @ApiResponse({ status: 200 })
  @Admin()
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }

  @ApiOperation({ summary: 'Просмотр новости' })
  @ApiResponse({ status: 200 })
  @Post('/view/:id')
  addView(@AuthUser() user, @Param('id') newsId: string) {
    const newsIdAsNumber = parseInt(newsId); // Преобразование в число
    return this.newsService.addNewsView(user.id, newsIdAsNumber);
  }
}
