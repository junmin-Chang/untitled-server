import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma.service';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [BookModule],
  providers: [PostService, PrismaService],
  controllers: [PostController],
})
export class PostModule {}
