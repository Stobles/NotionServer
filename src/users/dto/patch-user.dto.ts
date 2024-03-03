import { ApiProperty } from '@nestjs/swagger';

export class PatchUserDto {
  @ApiProperty()
  username?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  hashedRt?: string;

  @ApiProperty()
  isVerified?: boolean;
}
