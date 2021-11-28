import { ApiProperty } from '@nestjs/swagger';

export class Pagination<Aggregate>
{
    @ApiProperty({
        type       : Number,
        description: 'Total records of the query ',
        example    : 100
    })
    total: number;

    @ApiProperty({
        type       : Number,
        description: 'Total records applying constraints',
        example    : 75
    })
    count: number;

    @ApiProperty({
        type       : [Object],
        description: 'Rows obtained from the query',
        example    : [{ id: 1, name: 'John', surname: 'Doe' }, { id: 2, name: 'Mike', surname: 'Tall' }]
    })
    rows: Aggregate[];
}