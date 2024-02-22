import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchByTitleParams {
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  limit: number;
}

export class SearchByParentParams {
  @ApiProperty()
  parentId: string;
}
