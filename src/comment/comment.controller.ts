import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment, User } from '@prisma/client';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/AddCommentDto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId')
  async addComment(
    @Body() addCommentDto: AddCommentDto,
    @Param('postId') postId,
    @AuthUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.addComment(postId, addCommentDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string): Promise<Comment> {
    return this.commentService.deleteComment(commentId);
  }
}
