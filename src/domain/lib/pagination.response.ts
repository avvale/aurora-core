export class PaginationResponse
{
    constructor(
        public readonly total: number,
        public readonly count: number,
        public readonly rows: any[]
    ) {}
}