import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CanBeUndefined } from 'src/common/utils/canBeUndefined';

export class DocumentDto {
  @ApiProperty({
    example: '2',
  })
  id: string;

  @ApiProperty({
    example: 'Document title',
  })
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @ApiProperty({
    example: 'some_content',
  })
  @CanBeUndefined()
  content?: string;

  @ApiProperty({
    example: 'link_to_image',
  })
  @IsString()
  @CanBeUndefined()
  coverImage?: string;

  @ApiProperty({
    example: 'link_to_icon',
  })
  @IsString()
  @CanBeUndefined()
  icon?: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  @CanBeUndefined()
  parentId?: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isPublished?: boolean;

  @ApiProperty({
    isArray: true,
    type: DocumentDto,
  })
  @IsString()
  @CanBeUndefined()
  childrens?: DocumentDto[];

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @CanBeUndefined()
  isArchived?: boolean;

  @ApiProperty({
    example: '2024-02-05',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-05-05',
    type: Date,
  })
  updatedAt?: Date;

  @ApiProperty({
    example: '1',
  })
  userId: string;
}
