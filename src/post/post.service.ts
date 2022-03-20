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

  async getPosts(params: {
    isbn: string;
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take, isbn } = params;
    const count = await this.prismaService.post.count();

    const result = await this.prismaService.post.findMany({
      take,
      skip,
      include: {
        comment: true,
        author: {
          select: { userName: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(isbn && { where: { bookIsbn: isbn } }),
    });
    return {
      data: [...result],
      count,
    };
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
  async getPost(id: number): Promise<Post> {
    return await this.prismaService.post.findUnique({
      where: {
        id,
      },
      include: {
        comment: {
          include: {
            author: {
              select: { userName: true },
            },
          },
        },
        author: {
          select: { userName: true },
        },
      },
    });
  }

  async deletePost(id: number, user: User): Promise<Post> {
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

  async getMyPosts(user: User): Promise<Post[]> {
    return await this.prismaService.post.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        comment: true,
        author: {
          select: { userName: true },
        },
      },
    });
  }
  async getUserPosts(userId: string): Promise<Post[]> {
    return await this.prismaService.post.findMany({
      where: {
        userId,
      },
      include: {
        comment: true,
        author: {
          select: { userName: true },
        },
      },
    });
  }
}
