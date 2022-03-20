import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment, User } from '@prisma/client';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/AddCommentDto';
import { UpdateCommentDto } from './dto/UpdateCommentDto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId')
  async addComment(
    @Body() addCommentDto: AddCommentDto,
    @Param('postId') postId: string,
    @AuthUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.addComment(
      Number(postId),
      addCommentDto,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string): Promise<Comment> {
    return this.commentService.deleteComment(commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.updateComment(commentId, updateCommentDto);
  }
}
