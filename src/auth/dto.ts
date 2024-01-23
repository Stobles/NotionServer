import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SignUpLocalBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'The password is too short',
  })
  @MaxLength(24, {
    message: 'The password is too long',
  })
  password: string;
}

export class SignInLocalBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'The password is too short',
  })
  @MaxLength(24, {
    message: 'The password is too long',
  })
  password: string;
}

export class GoogleUser {
  provider: string;
  providerId: string;
  email: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}
