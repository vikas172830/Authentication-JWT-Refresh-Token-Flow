import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class Article extends Model {
    @Column
    declare title: string;

    @Column
    declare content: string;

    @ForeignKey(() => User)
    @Column
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}

