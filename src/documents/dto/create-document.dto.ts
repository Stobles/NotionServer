import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  parentId?: string | null;
}
