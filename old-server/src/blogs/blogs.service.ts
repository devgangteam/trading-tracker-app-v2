import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CaseStudy } from './types';

const fsPromises = fs.promises;

@Injectable()
export class BlogsService {
  private readonly logger: Logger = new Logger(BlogsService.name);
  private readonly blogDir = path.join(__dirname, 'learnings');

  async getAllBlogs(): Promise<CaseStudy[]> {
    try {
      this.logger.log(this.blogDir);
      if (!fs.existsSync(this.blogDir)) {
        fs.mkdirSync(this.blogDir);
      }
      const files = await fsPromises.readdir(this.blogDir);
      return await Promise.all(
        files.map(async (file) => {
          const slug = path.parse(file).name;
          const blog = await this.readBlog(slug);

          return {
            slug: slug,
            title: blog.title.replace('# ', ''),
          };
        }),
      );
    } catch (error) {
      this.logger.error('Unable to scan directory: ' + error);
    }
  }

  async readBlog(slug: string): Promise<CaseStudy> {
    try {
      const file = await fsPromises.readFile(
        path.join(this.blogDir, `${slug}.md`),
      );

      const content = file.toString();
      return {
        slug: slug,
        title: content.split('\n').shift(),
        mdContent: content,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
