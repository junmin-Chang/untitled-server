import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { AddBookDto } from './dto/add-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':value')
  async getBooksByValue(@Param('value') value: string): Promise<any> {
    return await this.bookService.getBooksByValue(value);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async addBook(@Body() body: AddBookDto, @AuthUser() user: User) {
    return await this.bookService.addBook(body, user);
  }
}
