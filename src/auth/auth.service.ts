import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async register(body: RegisterDto) {
    // Registration logic here
    const hash = await bcrypt.hash(body.password, 10);
    const user = await this.usersService.create({
      email: body.email,
      password: hash,
    });

    return {
      userId: user.id,
      email: user.email,
      message: 'User successfully registered',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.makeToken(user);
  }

  async refresh(dto: { refreshToken: string }) {
    const token = dto.refreshToken;

    try {
      const decoded = await this.jwt.verifyAsync(token);
      const user = await this.usersService.findByEmail(decoded.email);
      return this.makeToken(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private makeToken(user: any) {
    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwt.sign(payload, { expiresIn: '1m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
