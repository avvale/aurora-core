import { QueryStatement } from './sql-statement/sql-statement';
import { ValueObject } from '../value-objects/value-object';
import { CQMetadata, ObjectLiteral } from '../aurora.types';
import { Pagination } from '../shared/pagination';

export interface IRepository<Aggregate>
{
    repository: any;

    // paginate records
    paginate(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<Pagination<Aggregate>>;

    // find a single record
    find(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<Aggregate | null>;

    // find a single record by id
    findById(
        id: ValueObject<string>,
        options?: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<Aggregate | null>;

    // get multiple records
    get(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<Aggregate[]>;

    // count records
    count(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<number>;

    // ******************
    // ** side effects **
    // ******************

    // create a single record
    create(
        item: Aggregate,
        options?: {
            dataFactory?: (aggregate: Aggregate) => ObjectLiteral;
            finderQueryStatement: (aggregate: Aggregate) => QueryStatement;
        }
    ): Promise<void>;

    // create a single or multiple records
    insert(
        items: Aggregate[],
        options?: {
            insertOptions?: ObjectLiteral;
            dataFactory?: (aggregate: Aggregate) => ObjectLiteral;
        }
    ): Promise<void>;

    // update record
    update(
        item: Aggregate,
        options?: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => ObjectLiteral;
            findArguments?: ObjectLiteral;
        }
    ): Promise<void>;

    // delete record by id
    deleteById(
        id: ValueObject<string>,
        options?: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;

    // delete record
    delete(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;
}