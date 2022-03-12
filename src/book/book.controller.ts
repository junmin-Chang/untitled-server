import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':value')
  async getBooksByValue(@Param('value') value: string): Promise<any> {
    return await this.bookService.getBooksByValue(value);
  }
}
