import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: '1',
  })
  userId: string;

  @ApiProperty({
    example: '2',
  })
  documentId: string;
}
