import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  declare email: string;

  @Column
  declare password: string;
}
