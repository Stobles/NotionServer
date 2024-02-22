import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CanBeUndefined } from 'src/common/utils/canBeUndefined';

export class UpdateDocumentDto {
  @ApiProperty({
    example: 'Document title',
  })
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title: string;

  @ApiProperty({
    example: 'some_content',
  })
  @CanBeUndefined()
  content: string;

  @ApiProperty({
    example: 'link_to_image',
  })
  @IsString()
  @CanBeUndefined()
  coverImage: string;

  @ApiProperty({
    example: 'link_to_icon',
  })
  @IsString()
  @CanBeUndefined()
  icon: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  @CanBeUndefined()
  parentId: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isPublished: boolean;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isArchived: boolean;
}
