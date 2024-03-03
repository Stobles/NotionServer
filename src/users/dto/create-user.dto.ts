import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'random_string',
    required: false,
  })
  hash?: string;

  @ApiProperty({
    example: 'random_string',
    required: false,
  })
  salt?: string;
}
