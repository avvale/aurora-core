import { QueryStatement } from './sql-statement/sql-statement';
import { ValueObject } from '../value-objects/value-object';
import { CQMetadata, ObjectLiteral } from '../aurora.types';
import { Pagination } from '../shared/pagination';

export interface IRepository<Aggregate>
{
    repository: any;

    // paginate records
    paginate(queryStatement: QueryStatement, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<Pagination<Aggregate>>;

    // create a single record
    create(item: Aggregate, dataFactory?: (aggregate: Aggregate) => ObjectLiteral): Promise<void>;

    // create a single or multiple records
    insert(items: Aggregate[], options: ObjectLiteral, dataFactory?: (aggregate: Aggregate) => ObjectLiteral): Promise<void>;

    // find a single record
    find(queryStatement?: QueryStatement, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<Aggregate | null>;

    // find a single record by id
    findById(id: ValueObject<string>, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<Aggregate | null>;

    // get multiple records
    get(queryStatement?: QueryStatement, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<Aggregate[]>;

    // update record
    update(item: Aggregate, constraint?: QueryStatement, cQMetadata?: CQMetadata, dataFactory?: (aggregate: Aggregate) => ObjectLiteral): Promise<void>;

    // delete record by id
    deleteById(id: ValueObject<string>, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<void>;

    // delete record
    delete(queryStatement?: QueryStatement, constraint?: QueryStatement, cQMetadata?: CQMetadata): Promise<void>;
}