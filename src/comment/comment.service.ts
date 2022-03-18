import { HttpException, Injectable } from '@nestjs/common';
import { Comment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddCommentDto } from './dto/AddCommentDto';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async addComment(
    postId: string,
    addCommentDto: AddCommentDto,
    user: User,
  ): Promise<Comment> {
    return await this.prismaService.comment.create({
      data: {
        userId: user.userId,
        postId,
        ...addCommentDto,
      },
    });
  }

  async deleteComment(commentId: string): Promise<Comment> {
    const isValid = this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (isValid) {
      return this.prismaService.comment.delete({
        where: {
          id: commentId,
        },
      });
    }

    throw new HttpException('부적절한 접근', 404);
  }
}
