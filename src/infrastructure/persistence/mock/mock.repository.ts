import { Injectable, ConflictException, NotFoundException, BadRequestException, LiteralObject } from '@nestjs/common';
import { UuidValueObject } from '../../../domain/value-objects/uuid.value-object';
import { Pagination } from '../../../domain/shared/pagination';
import { QueryStatement } from '../../../domain/persistence/sql-statement/sql-statement';
import { IRepository } from '../../../domain/persistence/repository';
import { AggregateBase } from '../../../domain/shared/aggregate-base';
import { TimestampValueObject } from '../../../domain/value-objects/timestamp.value-object';
import { CQMetadata } from '../../../domain/aurora.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require('clean-deep');

@Injectable()
export abstract class MockRepository<Aggregate extends AggregateBase> implements IRepository<Aggregate>
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

    async paginate(
        {
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
        }: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<Pagination<Aggregate>>
    {
        const offset  = queryStatement.offset ? queryStatement.offset : 0;
        const limit   = queryStatement.limit ? queryStatement.limit : this.collectionSource.length;

        return {
            total: this.collectionSource.length,
            count: this.collectionSource.length,
            rows : this.collectionSource.slice(offset, limit),
        };
    }

    async find(
        {
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
        }: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<Aggregate>
    {
        const aggregate = this.collectionSource.find(item => item.id.value === queryStatement.where.id);

        if (!aggregate) throw new NotFoundException(`${this.aggregateName} not found`);

        return aggregate;
    }

    async findById(
        id: UuidValueObject,
        {
            constraint = {},
            cQMetadata = undefined,
        }: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<Aggregate>
    {
        const aggregate = this.collectionSource.find(author => author.id.value === id.value);

        if (!aggregate) throw new NotFoundException(`${this.aggregateName} not found`);

        return aggregate;
    }

    async get(
        {
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
        }: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<Aggregate[]>
    {
        return this.collectionSource;
    }

    async count(
        {
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
        }: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<number>
    {
        return this.collectionSource.length;
    }

    // ******************
    // ** side effects **
    // ******************

    async create(
        aggregate: Aggregate,
        {
            dataFactory = (aggregate: Aggregate) => aggregate.toDTO(),
            // arguments to find object and check if object is duplicated
            finderQueryStatement = (aggregate: Aggregate) => ({ where: { id: aggregate['id']['value'] }}),
            createOptions = undefined,
        }: {
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            finderQueryStatement?: (aggregate: Aggregate) => QueryStatement;
            createOptions?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        if (this.collectionSource.find(item => item.id.value === aggregate.id.value))
            throw new ConflictException(`Error to create ${this.aggregateName}, the id ${aggregate.id.value} already exist in database`);

        // create deletedAt null
        aggregate.deletedAt = this.deletedAtInstance;

        this.collectionSource.push(aggregate);
    }

    async insert(
        aggregates: Aggregate[],
        {
            dataFactory = (aggregate: Aggregate) => aggregate.toDTO(),
            insertOptions = undefined,
        }: {
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            insertOptions?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        /**/
    }

    async update(
        aggregate: Aggregate,
        {
            constraint = {},
            cQMetadata = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toDTO(),
            // arguments to find object to update, with i18n we use langId and id relationship with parent entity
            findArguments = { id: aggregate['id']['value'] },
            updateOptions = undefined,
        }: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            findArguments?: LiteralObject;
            updateOptions?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        // check that aggregate exist
        await this.findById(aggregate.id);

        this.collectionSource.map(item =>
        {
            if (item.id.value === aggregate.id.value) return aggregate;
            return item;
        });
    }

    async deleteById(
        id: UuidValueObject,
        {
            constraint = {},
            cQMetadata = undefined,
            deleteOptions = undefined,
        }: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            deleteOptions?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        // check that aggregate exist
        await this.findById(id);

        this.collectionSource.filter(aggregate => aggregate.id.value !== id.value);
    }

    async delete(
        {
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
            deleteOptions = undefined,
        }: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            deleteOptions?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        if (!Array.isArray(queryStatement) || queryStatement.length === 0) throw new BadRequestException('To delete multiple records, you must define a query statement');
    }
}
