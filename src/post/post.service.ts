import { HttpException, Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma.service';
import { AddPostDto } from './dto/add-post.dto';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private bookService: BookService,
  ) {}

  async getPosts(isbn: string): Promise<Post[]> {
    if (!isbn)
      return await this.prismaService.post.findMany({
        include: {
          comment: true,
        },
      });
    return await this.prismaService.post.findMany({
      include: {
        comment: true,
      },
      where: {
        bookIsbn: isbn,
      },
    });
  }
  async addPost(addPostDto: AddPostDto, user: User): Promise<Post> {
    const result = await this.bookService.searchBooksByValue(
      addPostDto.bookIsbn,
    );
    return await this.prismaService.post.create({
      data: {
        ...addPostDto,
        userId: user.userId,
        thumbnail: result[0].image,
      },
    });
  }
  async getPost(id: string): Promise<Post> {
    return await this.prismaService.post.findUnique({
      where: {
        id,
      },
      include: {
        comment: true,
      },
    });
  }

  async deletePost(id: string, user: User): Promise<Post> {
    const isValid = this.prismaService.post.findFirst({
      where: {
        userId: user.userId,
        id,
      },
    });
    console.log('isValid', isValid);
    if (isValid) {
      return await this.prismaService.post.delete({
        where: {
          id,
        },
      });
    }
    throw new HttpException('잘못된 접근입니다', 404);
  }
}
