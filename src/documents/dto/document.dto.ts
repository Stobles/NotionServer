import { ApiProperty } from '@nestjs/swagger';

export class DocumentDto {
  @ApiProperty({
    example: '2',
  })
  id: string;

  @ApiProperty({
    example: 'Document title',
  })
  title: string;

  @ApiProperty({
    example: 'some_content',
  })
  content: string;

  @ApiProperty({
    example: 'link_to_image',
  })
  coverImage: string;
  @ApiProperty({
    example: 'link_to_icon',
  })
  icon: string;

  @ApiProperty({
    example: '1',
  })
  parentId: string;

  @ApiProperty({
    example: false,
  })
  isPublished: boolean;
  @ApiProperty({
    example: false,
  })
  isArchived: boolean;

  @ApiProperty({
    example: '2014-02-05',
  })
  createdAt: Date;

  @ApiProperty({
    example: '1',
  })
  userId: string;
}
