import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UserProfileSettingsDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  totalPropertyAmount: number;
  @IsNumber({ maxDecimalPlaces: 1 })
  maximumRisk: number;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsNotEmpty()
  email: string;
}