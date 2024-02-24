import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty({
    example: '1',
  })
  userId: string;

  @ApiProperty({
    example: '1',
  })
  documentId: string;
}
