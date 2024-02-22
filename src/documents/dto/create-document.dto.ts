import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  parentId?: string | null;
}
