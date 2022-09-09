import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @Public()
  getAllBlogs() {
    return this.blogsService.getAllBlogs();
  }

  @Get(':slug')
  @Public()
  getBlog(@Param('slug') slug: string) {
    return this.blogsService.readBlog(slug);
  }
}
