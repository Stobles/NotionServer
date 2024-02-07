import { ApiProperty } from '@nestjs/swagger';

export class GetSessionInfoDto {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  lat: number;
}
