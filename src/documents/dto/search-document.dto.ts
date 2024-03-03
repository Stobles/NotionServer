import { ApiProperty } from '@nestjs/swagger';

class SortType {
  @ApiProperty({
    required: false,
    default: 'title',
  })
  field?: string;

  @ApiProperty({
    required: false,
    default: 'asc',
  })
  type?: 'asc' | 'desc';
}

class FilterType {
  @ApiProperty({
    required: false,
    default: false,
  })
  isArchived?: boolean;
}

export class SearchParams {
  @ApiProperty({
    type: FilterType,
    required: false,
  })
  filters?: FilterType;

  @ApiProperty({
    default: '',
  })
  query: string;

  @ApiProperty({
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    type: SortType,
    required: false,
  })
  sort?: SortType;
}
