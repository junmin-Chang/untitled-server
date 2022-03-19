import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostModel, User } from '@prisma/client';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { AddPostDto } from './dto/add-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get('')
  async getPosts(@Query('isbn') isbn: string): Promise<PostModel[]> {
    return await this.postService.getPosts(isbn);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async addPost(
    @Body() addPostDto: AddPostDto,
    @AuthUser() user: User,
  ): Promise<PostModel> {
    return await this.postService.addPost(addPostDto, user);
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostModel> {
    return await this.postService.getPost(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/myPosts')
  async getMyPosts(@AuthUser() user: User): Promise<PostModel[]> {
    return await this.postService.getMyPosts(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:userId')
  async getUserPosts(@Param('userId') userId: string): Promise<PostModel[]> {
    return await this.postService.getUserPosts(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<PostModel> {
    return await this.postService.deletePost(id, user);
  }
}
