import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { createUserDto } from './dto/createUser.dto';
import { Article } from '../articles/article.model';
import { CreateArticleDto } from './dto/createArticle.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly users: typeof User,
    @InjectModel(Article) private readonly articles: typeof Article,
  ) { }

  create(dto: createUserDto) {
    return this.users.create(dto as any);
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  findAll() {
    return this.users.findAll({ include: [Article] });
  }

  async createArticleForUser(userId: number, dto: CreateArticleDto) {
    const user = await this.users.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.articles.create({ ...dto, userId });
  }

  getArticlesByUser(userId: number) {
    return this.articles.findAll({ where: { userId } });
  }

  getAllArticles() {
    return this.articles.findAll({ include: [User] });
  }
}
