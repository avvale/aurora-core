import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UuidValueObject } from '../../../domain/value-objects/uuid.value-object';
import { Pagination } from '../../../domain/shared/pagination';
import { QueryStatement } from '../../../domain/persistence/sql-statement/sql-statement';
import { AggregateBase } from '../../../domain/shared/aggregate-base';
import { TimestampValueObject } from '../../../domain/value-objects/timestamp.value-object';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require('clean-deep');

@Injectable()
export abstract class MockRepository<Aggregate extends AggregateBase>
{
    public readonly repository: any;
    public readonly aggregateName: string;
    public collectionSource: Aggregate[];
    public deletedAtInstance: TimestampValueObject;

    get collectionResponse(): any[]
    {
        // to match objects, the http output excludes undefined values
        return this.collectionSource.map(item => cleanDeep(item.toDTO(), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false
        }));
    }

    async paginate(query: QueryStatement, constraint: QueryStatement): Promise<Pagination<Aggregate>>
    {
        const offset  = query.offset ? query.offset : 0;
        const limit   = query.limit ? query.limit : this.collectionSource.length;

        return {
            total: this.collectionSource.length,
            count: this.collectionSource.length,
            rows : this.collectionSource.slice(offset, limit)
        };
    }

    async create(aggregate: Aggregate): Promise<void>
    {
        if (this.collectionSource.find(item => item.id.value === aggregate.id.value)) throw new ConflictException(`Error to create ${this.aggregateName}, the id ${aggregate.id.value} already exist in database`);

        // create deletedAt null
        aggregate.deletedAt = this.deletedAtInstance;

        this.collectionSource.push(aggregate);
    }

    async insert(author: Aggregate[]): Promise<void>
    {
        /**/
    }

    async find(queryStatement: QueryStatement): Promise<Aggregate>
    {
        const aggregate = this.collectionSource.find(item => item.id.value === queryStatement.where.id);

        if (!aggregate) throw new NotFoundException(`${this.aggregateName} not found`);

        return aggregate;
    }

    async findById(id: UuidValueObject): Promise<Aggregate>
    {
        const aggregate = this.collectionSource.find(author => author.id.value === id.value);

        if (!aggregate) throw new NotFoundException(`${this.aggregateName} not found`);

        return aggregate;
    }

    async get(queryStatement: QueryStatement): Promise<Aggregate[]>
    {
        return this.collectionSource;
    }

    async update(aggregate: Aggregate): Promise<void>
    {
        // check that aggregate exist
        await this.findById(aggregate.id);

        this.collectionSource.map(item =>
        {
            if (item.id.value === aggregate.id.value) return aggregate;
            return item;
        });
    }

    async deleteById(id: UuidValueObject): Promise<void>
    {
        // check that aggregate exist
        await this.findById(id);

        this.collectionSource.filter(aggregate => aggregate.id.value !== id.value);
    }

    async delete(queryStatement: QueryStatement): Promise<void>
    {
        if (!Array.isArray(queryStatement) || queryStatement.length === 0) throw new BadRequestException('To delete multiple records, you must define a query statement');
    }

    async count(queryStatement: QueryStatement): Promise<number>
    {
        return this.collectionSource.length;
    }
}
