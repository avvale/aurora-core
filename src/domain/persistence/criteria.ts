import { QueryStatement } from './sql-statement/sql-statement';
import { CQMetadata } from './../aurora.types';

export abstract class ICriteria
{
    abstract implements(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): QueryStatement

    abstract mergeQueryConstraintStatement(
        query: QueryStatement,
        constraint: QueryStatement,
    ): QueryStatement
}