import { ConflictException, NotFoundException, BadRequestException, LiteralObject } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { QueryStatement } from '../../../domain/persistence/sql-statement/sql-statement';
import { CQMetadata, HookResponse } from '../../../domain/aurora.types';
import { IRepository } from '../../../domain/persistence/repository';
import { ICriteria } from '../../../domain/persistence/criteria';
import { IMapper } from '../../../domain/shared/mapper';
import { UuidValueObject } from '../../../domain/value-objects/uuid.value-object';
import { AggregateBase } from '../../../domain/shared/aggregate-base';
import { Pagination } from '../../../domain/shared/pagination';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require('clean-deep');

export abstract class SequelizeRepository<Aggregate extends AggregateBase, ModelClass> implements IRepository<Aggregate>
{
    public readonly repository: any;
    public readonly criteria: ICriteria;
    public readonly aggregateName: string;
    public readonly mapper: IMapper;

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
        // manage hook count paginate, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookCountResponse = this.countStatementPaginateHook(constraint, cQMetadata);

        // get count total records from sql service library
        const total = await this.repository.count(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookCountResponse.queryStatement, hookCountResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        // manage hook compose paginate, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookComposeResponse = this.composeStatementPaginateHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        // get records
        const { count, rows } = await this.repository.findAndCountAll(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookComposeResponse.queryStatement, hookComposeResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        return {
            total,
            count,
            rows: <Aggregate[]>this.mapper.mapModelsToAggregates(rows, cQMetadata), // map values to create value objects
        };
    }

    // hook to add findOptions
    countStatementPaginateHook(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

    // hook to add findOptions
    composeStatementPaginateHook(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

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
        // manage hook, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookResponse = this.composeStatementFindHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const model = queryStatement.rawSQL ?
            await this.repository.sequelize.query(
                queryStatement.rawSQL,
                {
                    ...cQMetadata?.repositoryOptions,
                    type: QueryTypes.SELECT,
                },
            )
            :
            await this.repository.findOne(
                // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
                this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
                cQMetadata?.repositoryOptions,
            );

        if (!model) throw new NotFoundException(`${this.aggregateName} not found`);

        // map value to create value objects
        return <Aggregate>this.mapper.mapModelToAggregate(model, cQMetadata);
    }

    // hook to add findOptions
    composeStatementFindHook(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

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
        // manage hook, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookResponse = this.composeStatementFindByIdHook(
            this.criteria.mergeQueryConstraintStatement(
                {
                    where: {
                        id: id.value,
                    },
                },
                constraint,
            ),
            cQMetadata,
        );

        // value is already mapped
        const model = await this.repository.findOne(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        if (!model) throw new NotFoundException(`${this.aggregateName} with id: ${id.value}, not found`);

        return <Aggregate>this.mapper.mapModelToAggregate(model, cQMetadata);
    }

    // hook to add findOptions
    composeStatementFindByIdHook(queryStatement: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

    // get multiple records
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
        // manage hook, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookResponse = this.composeStatementGetHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const models = queryStatement.rawSQL ?
            await this.repository.sequelize.query(
                queryStatement.rawSQL,
                {
                    ...cQMetadata?.repositoryOptions,
                    type: QueryTypes.SELECT,
                },
            )
            :
            await this.repository.findAll(
                // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
                this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
                cQMetadata?.repositoryOptions,
            );

        // map values to create value objects
        return <Aggregate[]>this.mapper.mapModelsToAggregates(models, cQMetadata);
    }

    // hook to add findOptions
    composeStatementGetHook(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

    // count records
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
        // manage hook, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookResponse = this.composeStatementCountHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const nRecords = queryStatement.rawSQL ?
            await this.repository.sequelize.query(
                queryStatement.rawSQL,
                {
                    ...cQMetadata?.repositoryOptions,
                    type: QueryTypes.SELECT,
                },
            )
            :
            await this.repository.count(
                // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
                this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
                cQMetadata?.repositoryOptions,
            );

        return nRecords;
    }

    // hook to add count
    composeStatementCountHook(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): HookResponse { return { queryStatement, cQMetadata }; }

    // ******************
    // ** side effects **
    // ******************

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async create(
        aggregate: Aggregate,
        {
            createOptions = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
            // arguments to find object and check if object is duplicated
            finderQueryStatement = (aggregate: Aggregate) => ({ where: { id: aggregate['id']['value'] }}),
        }: {
            createOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            finderQueryStatement?: (aggregate: Aggregate) => QueryStatement;
        } = {},
    ): Promise<void>
    {
        // check if exist object in database, if allow save aggregate with the same uuid, update this aggregate in database instead of create it
        const modelInDB = await this.repository.findOne(finderQueryStatement(aggregate));

        if (modelInDB) throw new ConflictException(`Error to create ${this.aggregateName}, the id ${aggregate['id']['value']} already exist in database`);

        try
        {
            const model = await this.repository
                .create(
                    dataFactory(aggregate),
                    createOptions,
                );

            this.createdAggregateHook(aggregate, model);
        }
        catch (error)
        {
            throw new ConflictException(error.message);
        }
    }

    // hook called after create aggregate
    async createdAggregateHook(aggregate: Aggregate, model: Model<ModelClass>): Promise<void> { /**/ }

    async insert(
        aggregates: Aggregate[],
        {
            insertOptions = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
        }: {
            insertOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        } = {},
    ): Promise<void>
    {
        /********
         *  user insertOptions to add properties like updateOnDuplicate
         *  {
         *      repositoryOptions: {
         *          updateOnDuplicate: [
         *              'name', // fields than can be updated
         *              ...
         *          ],
         *      },
         *  }
         */

        await this.repository.bulkCreate(
            aggregates.map(item => dataFactory(item)),
            insertOptions,
        );

        this.insertedAggregateHook(aggregates);
    }

    // hook called after insert aggregates
    async insertedAggregateHook(aggregates: Aggregate[]):Promise<void> { /**/ }

    async updateById(
        aggregate: Aggregate,
        {
            updateByIdOptions = undefined,
            constraint = {},
            cQMetadata = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
            // arguments to find object to update, with i18n we use langId and id relationship with parent entity
            findArguments = { id: aggregate['id']['value'] },
        }: {
            updateByIdOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
            findArguments?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        // check that model exist
        const modelInDB = await this.repository.findOne(
            // pass constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(
                this.criteria.mergeQueryConstraintStatement(
                    {
                        where: findArguments,
                    },
                    constraint,
                ),
                cQMetadata,
            ),
        );

        if (!modelInDB) throw new NotFoundException(`${this.aggregateName} not found`);

        // clean undefined fields, to avoid update undefined fields
        const LiteralObject = cleanDeep(dataFactory(aggregate), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false,
        });

        const model = await modelInDB.update(LiteralObject, updateByIdOptions);

        this.updatedByIdAggregateHook(aggregate, model);
    }

    // hook called after update by id aggregate
    async updatedByIdAggregateHook(aggregate: Aggregate, model: Model<ModelClass>): Promise<void> { /**/ }

    async update(
        aggregate: Aggregate,
        {
            updateOptions = undefined,
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
        }: {
            updateOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        } = {},
    ): Promise<void>
    {
        // check allRows variable to allow update all rows
        if (
            !queryStatement ||
            !queryStatement.where ||
            updateOptions?.allRows
        ) throw new BadRequestException('To update multiple records, you must define a where statement');

        // clean undefined fields, to avoid update undefined fields
        const LiteralObject = cleanDeep(dataFactory(aggregate), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false,
        });

        // execute update statement
        const model = await this.repository.update(
            LiteralObject,
            // pass query, constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            {
                ...this.criteria.implements(
                    this.criteria.mergeQueryConstraintStatement(
                        queryStatement,
                        constraint,
                    ),
                    cQMetadata,
                ),
                ...updateOptions,
            },
        );

        this.updatedAggregateHook(aggregate, model);
    }

    // hook called after update by id aggregate
    async updatedAggregateHook(aggregate: Aggregate, model: Model<ModelClass>): Promise<void> { /**/ }

    async upsert(
        aggregate: Aggregate,
        {
            upsertOptions = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
        }: {
            upsertOptions?: LiteralObject;
            dataFactory?: (aggregate: Aggregate) => LiteralObject;
        } = {},
    ): Promise<void>
    {
        // execute update statement
        await this.repository
            .upsert(
                dataFactory(aggregate),
                upsertOptions,
            );

        this.upsertedAggregateHook(aggregate);
    }

    // hook called after upsert aggregates
    async upsertedAggregateHook(aggregates: Aggregate):Promise<void> { /**/ }

    async deleteById(
        id: UuidValueObject,
        {
            deleteOptions = undefined,
            constraint = {},
            cQMetadata = undefined,
        }: {
            deleteOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<void>
    {
        // check that aggregate exist
        const model = await this.repository.findOne(
            // pass constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(
                this.criteria.mergeQueryConstraintStatement(
                    {
                        where: {
                            id: id.value,
                        },
                    },
                    constraint,
                ),
                cQMetadata,
            ),
        );

        if (!model) throw new NotFoundException(`${this.aggregateName} not found`);

        await model.destroy(deleteOptions);
    }

    async delete(
        {
            deleteOptions = undefined,
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
        }: {
            deleteOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<void>
    {
        // check allRows variable to allow delete all rows
        if (
            !queryStatement ||
            !queryStatement.where ||
            deleteOptions?.allRows
        ) throw new BadRequestException('To delete multiple records, you must define a where statement');

        // check that aggregate exist
        await this.repository.destroy(
            // pass query, constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            {
                ...this.criteria.implements(
                    this.criteria.mergeQueryConstraintStatement(
                        queryStatement,
                        constraint,
                    ),
                    cQMetadata,
                ),
                ...deleteOptions,
            },
        );
    }
}