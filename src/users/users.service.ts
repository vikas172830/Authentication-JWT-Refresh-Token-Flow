import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { createUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly users: typeof User) {}

  create(dto: createUserDto) {
    return this.users.create(dto as any);
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  updateRefreshToken(userId: number, refreshToken: string) {
    return this.users.update(
      { refreshToken: refreshToken },
      { where: { id: userId } },
    );
  }
}
