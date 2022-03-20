import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AddBookDto } from './dto/add-book.dto';
import { Book, User } from '@prisma/client';
import { UpdateBookDto } from './dto/update-book.dto';
@Injectable()
export class BookService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async searchBooksByValue(value: string, start?: string): Promise<any> {
    const result = await lastValueFrom(
      this.httpService.get(
        this.configService.get('NAVER_SEARCH_API') +
          `query=${decodeURI(encodeURI(value))}` +
          `&start=${start ?? 1}`,
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
  async getBooks(sortBy: string, user: User): Promise<Book[]> {
    switch (sortBy) {
      case 'willRead':
        return await this.prismaService.book.findMany({
          where: {
            willRead: true,
            userId: user.userId,
          },
        });
      case 'hasRead':
        return await this.prismaService.book.findMany({
          where: {
            hasRead: true,
            userId: user.userId,
          },
        });
      default:
        return await this.prismaService.book.findMany({
          where: {
            userId: user.userId,
          },
        });
    }
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

  async deleteBook(id: string) {
    return await this.prismaService.book.delete({
      where: {
        id,
      },
    });
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    return await this.prismaService.book.update({
      data: {
        ...updateBookDto,
      },
      where: {
        id,
      },
    });
  }
}
