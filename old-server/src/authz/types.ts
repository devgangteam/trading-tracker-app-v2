import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Request } from 'express';
import { Match } from 'src/decorators/match.decorator';

export interface RequestWithUser extends Request {
  user: SanitizedUser;
}

export interface SanitizedUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Match('password')
  retypedPassword: string;

  @IsString()
  leaderUsername: string;
}
