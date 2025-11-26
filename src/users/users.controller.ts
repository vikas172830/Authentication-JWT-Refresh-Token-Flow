import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('getAllUsers')
    async getAllUsers() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post(':userId/articles')
    createArticleForUser(
        @Param('userId') userId: string,
        @Body() dto: CreateArticleDto,
    ) {
        return this.usersService.createArticleForUser(Number(userId), dto);
    }

    @Get(':userId/articles')
    getArticlesByUser(@Param('userId') userId: string) {
        return this.usersService.getArticlesByUser(Number(userId));
    }

    @Get('articles')
    getAllArticles() {
        return this.usersService.getAllArticles();
    }
}
