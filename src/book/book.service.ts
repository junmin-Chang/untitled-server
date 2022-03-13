import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AddBookDto } from './dto/add-book.dto';
import { Book, User } from '@prisma/client';
@Injectable()
export class BookService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async getBooks(user: User): Promise<Book[]> {
    return await this.prismaService.book.findMany({
      where: {
        userId: user.userId,
      },
    });
  }
  async getBooksByValue(value: string): Promise<any> {
    const result = await lastValueFrom(
      this.httpService.get(
        this.configService.get('NAVER_SEARCH_API') +
          `query=${decodeURI(encodeURI(value))}`,
        {
          headers: {
            'X-Naver-Client-Id': this.configService.get('NAVER_CLIENT_ID'),
            'X-Naver-Client-Secret': this.configService.get(
              'NAVER_CLIENT_SECRET',
            ),
          },
        },
      ),
    );

    return result.data.items;
  }

  async addBook(body: AddBookDto, user: User) {
    const isExists = await this.prismaService.book.findFirst({
      where: {
        isbn: body.isbn,
        userId: user.userId,
      },
    });

    if (isExists) throw new HttpException('이미 등록된 책 입니다.', 404);

    const result = await this.prismaService.book.create({
      data: {
        ...body,
        userId: user.userId,
      },
    });
    delete result.userId;
    return result;
  }
}
