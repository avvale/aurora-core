import { ApiProperty } from '@nestjs/swagger';

export class KeysetPagination<Aggregate> {
  @ApiProperty({
    type: Number,
    description:
      'Info about the pagination, if has next page and the cursor to get the next page',
    example: { hasNext: true, nextCursor: 'cursor_value' },
  })
  pageInfo: { hasNext: boolean; nextCursor: string | null };

  @ApiProperty({
    type: Number,
    description: 'Total records of the query ',
    example: 100,
  })
  total: number;

  @ApiProperty({
    type: [Object],
    description: 'Rows obtained from the query',
    example: [
      { id: 1, name: 'John', surname: 'Doe' },
      { id: 2, name: 'Mike', surname: 'Tall' },
    ],
  })
  rows: Aggregate[];
}
