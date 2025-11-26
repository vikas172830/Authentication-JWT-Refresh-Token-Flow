import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Article } from '../articles/article.model';

@Table
export class User extends Model {
  @Column
  declare email: string;

  @Column
  declare password: string;

  @HasMany(() => Article)
  declare articles: Article[];
}
