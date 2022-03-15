import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Book, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('')
  async getBooks(@AuthUser() user: User): Promise<Book[]> {
    return this.bookService.getBooks(user);
  }

  @Get(':value')
  async getBooksByValue(@Param('value') value: string): Promise<any> {
    return await this.bookService.getBooksByValue(value);
  }

  @Post('')
  async addBook(@Body() body: AddBookDto, @AuthUser() user: User) {
    return await this.bookService.addBook(body, user);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return await this.bookService.deleteBook(id);
  }

  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.updateBook(id, updateBookDto);
  }
}
