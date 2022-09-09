import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Profile, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(private readonly prismaService: PrismaService) { }

  async getOrUpdateProfileSettings(
    userId: string,
    totalPropertyAmount?: number,
    maximumRisk?: number,
  ) {
    try {
      let profileSettings: Profile;
      if (!totalPropertyAmount && !maximumRisk) {
        profileSettings = await this.prismaService.profile.findUnique({
          where: {
            userId,
          },
        });
      } else {
        profileSettings = await this.prismaService.profile.upsert({
          where: {
            userId,
          },
          create: {
            totalPropertyAmount,
            maximumRisk,
            userId,
          },
          update: {
            totalPropertyAmount,
            maximumRisk,
          },
        });
      }

      if (!profileSettings) throw new InternalServerErrorException();
      return {
        totalPropertyAmount: profileSettings.totalPropertyAmount,
        maximumRisk: profileSettings.maximumRisk,
      };
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async getUsers(userId: string, isAdmin: boolean, page: number = 0, size: number = 10): Promise<User[]> {
    let where = isAdmin ? {} : {
      leaderId: userId,
    }
    return await this.prismaService.user.findMany({
      where: {
        ...where,
        NOT: {
          id: userId
        }
      },
      skip: page,
      take: size
    });
  }
}
