import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, hashPassword } from 'src/utils/hasher.util';
import { RegisterDto, SanitizedUser } from './types';

@Injectable()
export class AuthzService {
  private readonly logger: Logger = new Logger(AuthzService.name);
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<SanitizedUser> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return null;
    }

    const isPasswordMatched = await comparePassword(pass, user.password);
    if (!isPasswordMatched) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.logger.log(user.role);
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id, email: user.email, role: user.role };
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
      payload,
    };
  }

  async extractToken(token: string) {
    return await this.jwtService.verify(token);
  }

  async register(registerDto: RegisterDto) {
    if (!Object.values(registerDto).some((value) => value))
      throw new BadRequestException('Invalid user information to register');

    const { username, password, retypedPassword, email, leaderUsername } = registerDto;

    if (password !== retypedPassword)
      throw new BadRequestException(
        'Retyped password is not the same with password',
      );

    const existedUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (existedUser) {
      throw new BadRequestException('User is already existed');
    }

    const hashedPassword = await hashPassword(password);

    let leader: User = null;
    if (leaderUsername) {
      const leader = await this.prismaService.user.findUnique({
        where: {
          username: leaderUsername
        }
      });

      if (!leader) throw new BadRequestException('Leader is not valid');

      if (leader.role === Role.MEMBER) throw new BadRequestException('This user is not a leader');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        leaderId: leader ? leader.id : null,
      },
    });

    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      payload,
    };
  }
}
