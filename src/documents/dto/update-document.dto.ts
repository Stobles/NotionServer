import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CanBeUndefined } from 'src/common/utils/canBeUndefined';

export class UpdateDocumentDto {
  @ApiProperty({
    example: 'Document title',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @ApiProperty({
    example: 'some_content',
    required: false,
  })
  @CanBeUndefined()
  content?: string;

  @ApiProperty({
    example: 'link_to_image',
    required: false,
  })
  @IsString()
  @CanBeUndefined()
  coverImage?: string;

  @ApiProperty({
    example: 'link_to_icon',
    required: false,
  })
  @IsString()
  @CanBeUndefined()
  icon?: string;

  @ApiProperty({
    example: '1',
    required: false,
  })
  @IsString()
  @CanBeUndefined()
  parentId?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isPublished?: boolean;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isArchived?: boolean;
}
