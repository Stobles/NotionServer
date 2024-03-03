import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    required: false,
  })
  userId?: string;

  @ApiProperty()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  parentId?: string;
}
