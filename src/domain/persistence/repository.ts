import { QueryStatement } from './sql-statement/sql-statement';
import { ValueObject } from '../value-objects/value-object';
import { CQMetadata, LiteralObject } from '../aurora.types';
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

    // get records with rawSQL
    rawSQL?(
        options?: {
            rawSQL?: string;
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
            createOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            finderQueryStatement: (aggregate: Aggregate) => QueryStatement;
        }
    ): Promise<void>;

    // create a single or multiple records
    insert(
        items: Aggregate[],
        options?: {
            insertOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        }
    ): Promise<void>;

    // update record by id
    updateById(
        item: Aggregate,
        options?: {
            updateByIdOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            findArguments?: LiteralObject;
        }
    ): Promise<void>;

    // update record
    update(
        item: Aggregate,
        options?: {
            updateOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        }
    ): Promise<void>;

    // insert or update key identification elements already existing in the table
    upsert(
        item: Aggregate,
        options?: {
            upsertOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        }
    ): Promise<void>;

    // delete record by id
    deleteById(
        id: ValueObject<string>,
        options?: {
            deleteOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;

    // delete record
    delete(
        options?: {
            deleteOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;
}