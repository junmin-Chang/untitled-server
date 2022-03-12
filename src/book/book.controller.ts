import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get(':name')
  async getBooksByName(@Param('name') name: string): Promise<any> {
    return await this.bookService.getBooksByName(name);
  }
}
