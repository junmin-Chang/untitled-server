import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddPostDto } from './dto/add-post.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async getPosts(): Promise<Post[]> {
    return await this.prismaService.post.findMany();
  }
  async addPost(addPostDto: AddPostDto, user: User): Promise<Post> {
    return await this.prismaService.post.create({
      data: {
        ...addPostDto,
        userId: user.userId,
      },
    });
  }
}
