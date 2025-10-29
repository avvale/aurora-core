/* eslint-disable max-len */
import { AuditingRunner, ICriteria, IRepository, QueryStatement } from '../../../domain/persistence';
import { AggregateBase, IMapper, Pagination } from '../../../domain/shared';
import { CQMetadata, HookResponse, LiteralObject } from '../../../domain/types';
import { UuidValueObject } from '../../../domain/value-objects';
import { setSequelizeIncrementFunction } from '../../persistence';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Model } from 'sequelize-typescript';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require('clean-deep');

export abstract class SequelizeRepository<Aggregate extends AggregateBase, ModelClass> implements IRepository<Aggregate>
{
    public readonly repository: any;
    public readonly criteria: ICriteria;
    public readonly aggregateName: string;
    public readonly mapper: IMapper;
    public readonly auditingRunner: AuditingRunner;

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
        // we clone constraint to break the reference and to be able to delete attributes later on
        const hookCountResponse = this.countStatementPaginateHook({ ...constraint }, cQMetadata);

        // remove attributes to count all records, otherwise we will get a SQL error
        delete hookCountResponse.queryStatement.attributes;

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
            // exclude mapping models to aggregates, return models directly
            rows: cQMetadata.excludeMapModelToAggregate ?
                rows :
                <Aggregate[]>this.mapper.mapModelsToAggregates(rows, cQMetadata), // map values to create value objects
        };
    }

    // hook when pagination count is done
    countStatementPaginateHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    // hook when compose pagination statement
    composeStatementPaginateHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

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

        const model = await this.repository.findOne(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        if (!model) throw new NotFoundException(`${this.aggregateName} not found`);

        // exclude mapping models to aggregates, return models directly
        if (cQMetadata.excludeMapModelToAggregate) return model;

        // map value to create value objects
        return <Aggregate>this.mapper.mapModelToAggregate(model, cQMetadata);
    }

    // hook when compose find statement
    composeStatementFindHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    async findById(
        id: UuidValueObject | undefined,
        {
            constraint = {},
            cQMetadata = undefined,
            findArguments = undefined,
        }: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            findArguments?: LiteralObject;
        } = {},
    ): Promise<Aggregate>
    {
        // manage hook, merge timezone columns with cQMetadata to overwrite timezone columns, if are defined un cQMetadata
        const hookResponse = this.composeStatementFindByIdHook(
            this.criteria.mergeQueryConstraintStatement(
                {
                    where: id
                        ? { id: id.value }
                        : findArguments, // if id is a composite key, pass find arguments, example: { key1: value1, key2: value2, ...}
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

        // exclude mapping models to aggregates, return models directly
        if (cQMetadata.excludeMapModelToAggregate) return model;

        return <Aggregate>this.mapper.mapModelToAggregate(model, cQMetadata);
    }

    // hook when compose find by id statement
    composeStatementFindByIdHook(
        queryStatement: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

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

        const models = await this.repository.findAll(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        // exclude mapping models to aggregates, return models directly
        if (cQMetadata.excludeMapModelToAggregate) return models;

        // map values to create value objects
        return <Aggregate[]>this.mapper.mapModelsToAggregates(models, cQMetadata);
    }

    // hook when compose get statement
    composeStatementGetHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    // done rawSQL statement
    async rawSQL(
        {
            rawSQL = undefined,
            cQMetadata = undefined,
        }: {
            rawSQL?: string;
            cQMetadata?: CQMetadata;
        } = {},
    ): Promise<Aggregate[]>
    {
        const models = await this.repository.sequelize.query(
            this.composeStatementRawSQLHook(rawSQL, cQMetadata),
            {
                ...cQMetadata?.repositoryOptions,
                type: QueryTypes.SELECT, // can't be overwrite this value, always will be SELECTs for raw sql
            },
        );

        // exclude mapping models to aggregates, return models directly
        if (cQMetadata.excludeMapModelToAggregate) return models;

        // with rawSQL always return array of models
        return <Aggregate[]>this.mapper.mapModelsToAggregates(models, cQMetadata);
    }

    // hook when raw sql is done
    composeStatementRawSQLHook(
        rawSQL: string,
        cQMetadata?: CQMetadata,
    ): string { return rawSQL; }

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

        const nRecords = await this.repository.count(
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        return nRecords;
    }

    // hook to add count
    composeStatementCountHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    // max records
    async max(
        column,
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
        const hookResponse = this.composeStatementMaxHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const nMaxRecord = await this.repository.max(
            column,
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        return nMaxRecord;
    }

    // hook to add max
    composeStatementMaxHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    // min records
    async min(
        column,
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
        const hookResponse = this.composeStatementMinHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const nMinRecord = await this.repository.min(
            column,
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        return nMinRecord;
    }

    // hook to add max
    composeStatementMinHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

    // sum records
    async sum(
        column,
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
        const hookResponse = this.composeStatementSumHook(
            this.criteria.mergeQueryConstraintStatement(
                queryStatement,
                constraint,
            ),
            cQMetadata,
        );

        const nMinRecord = await this.repository.sum(
            column,
            // pass queryStatement and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(hookResponse.queryStatement, hookResponse.cQMetadata),
            cQMetadata?.repositoryOptions,
        );

        return nMinRecord;
    }

    // hook to add sum
    composeStatementSumHook(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): HookResponse { return { queryStatement, cQMetadata }; }

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
            // set auditingRunner to implement DI in model
            if (createOptions?.auditing) createOptions.auditing.auditingRunner = this.auditingRunner;

            const model = await this.repository
                .create(
                    dataFactory(aggregate),
                    createOptions,
                );

            this.createdAggregateHook(aggregate, model, createOptions);
        }
        catch (error)
        {
            throw new ConflictException(error.message);
        }
    }

    // hook called after create aggregate
    async createdAggregateHook(
        aggregate: Aggregate,
        model: Model<ModelClass>,
        createOptions: LiteralObject,
    ): Promise<void> { /**/ }

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

        // set auditingRunner to implement DI in model
        if (insertOptions?.auditing) insertOptions.auditing.auditingRunner = this.auditingRunner;

        await this.repository.bulkCreate(
            aggregates.map(item => dataFactory(item)),
            insertOptions,
        );

        this.insertedAggregateHook(aggregates, insertOptions);
    }

    // hook called after insert aggregates
    async insertedAggregateHook(
        aggregates: Aggregate[],
        insertOptions: LiteralObject,
    ):Promise<void> { /**/ }

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
        const payload = cleanDeep(dataFactory(aggregate), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false,
        });

        // set auditingRunner to implement DI in model
        if (updateByIdOptions?.auditing) updateByIdOptions.auditing.auditingRunner = this.auditingRunner;

        const model = await modelInDB.update(payload, updateByIdOptions);

        this.updatedByIdAggregateHook(aggregate, model, updateByIdOptions);
    }

    // hook called after update by id aggregate
    async updatedByIdAggregateHook(
        aggregate: Aggregate,
        model: Model<ModelClass>,
        updateByIdOptions: LiteralObject,
    ): Promise<void> { /**/ }

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
        ) throw new BadRequestException('To increment multiple records, you must define a where statement else use allRows: true, property in updateOptions');

        // clean undefined fields, to avoid update undefined fields
        const payload = cleanDeep(dataFactory(aggregate), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false,
        });

        // set auditingRunner to implement DI in model
        if (updateOptions?.auditing) updateOptions.auditing.auditingRunner = this.auditingRunner;

        // execute update statement
        const model = await this.repository.update(
            payload,
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

        this.updatedAggregateHook(aggregate, model, updateOptions);
    }

    // hook called after update by id aggregate
    async updatedAggregateHook(
        aggregate: Aggregate,
        model: Model<ModelClass>,
        updateOptions: LiteralObject,
    ): Promise<void> { /**/ }

    async updateAndIncrement(
        aggregate: Aggregate,
        {
            updateAndIncrementOptions = undefined,
            queryStatement = {},
            constraint = {},
            cQMetadata = undefined,
            dataFactory = (aggregate: Aggregate) => aggregate.toRepository(),
        }: {
            updateAndIncrementOptions?: LiteralObject;
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
            updateAndIncrementOptions?.allRows
        ) throw new BadRequestException('To update and increment multiple records, you must define a where statement else use allRows: true, property in updateAndIncrementOptions');

        // clean undefined fields, to avoid update undefined fields
        const payload = cleanDeep(dataFactory(aggregate), {
            nullValues  : false,
            emptyStrings: false,
            emptyObjects: false,
            emptyArrays : false,
        });

        // set auditingRunner to implement DI in model
        if (updateAndIncrementOptions?.auditing) updateAndIncrementOptions.auditing.auditingRunner = this.auditingRunner;

        // execute update statement
        const model = await this.repository.update(
            setSequelizeIncrementFunction(payload),
            // pass query, constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            {
                ...this.criteria.implements(
                    this.criteria.mergeQueryConstraintStatement(
                        queryStatement,
                        constraint,
                    ),
                    cQMetadata,
                ),
                ...updateAndIncrementOptions,
            },
        );

        this.updateAndIncrementAggregateHook(aggregate, model, updateAndIncrementOptions);
    }

    // hook called after increment aggregate
    async updateAndIncrementAggregateHook(
        aggregate: Aggregate,
        model: Model<ModelClass>,
        updateAndIncrementOptions: LiteralObject,
    ): Promise<void> { /**/ }

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
        // set auditingRunner to implement DI in model
        if (upsertOptions?.auditing) upsertOptions.auditing.auditingRunner = this.auditingRunner;

        // execute update statement
        await this.repository
            .upsert(
                dataFactory(aggregate),
                upsertOptions,
            );

        this.upsertedAggregateHook(aggregate, upsertOptions);
    }

    // hook called after upsert aggregates
    async upsertedAggregateHook(
        aggregates: Aggregate,
        upsertOptions: LiteralObject,
    ):Promise<void> { /**/ }

    async deleteById(
        id: UuidValueObject | undefined,
        {
            deleteOptions = undefined,
            constraint = {},
            cQMetadata = undefined,
            findArguments = undefined,
        }: {
            deleteOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            findArguments?: LiteralObject;
        } = {},
    ): Promise<void>
    {
        // check that aggregate exist
        const model = await this.repository.findOne(
            // pass constraint and cQMetadata to criteria, where will use cQMetadata for manage dates or other data
            this.criteria.implements(
                this.criteria.mergeQueryConstraintStatement(
                    {
                        where: id
                            ? { id: id.value }
                            : findArguments, // if id is a composite key, pass find arguments, example: { key1: value1, key2: value2, ...}
                    },
                    constraint,
                ),
                cQMetadata,
            ),
        );

        if (!model) throw new NotFoundException(`${this.aggregateName} not found`);

        // set auditingRunner to implement DI in model
        if (deleteOptions?.auditing) deleteOptions.auditing.auditingRunner = this.auditingRunner;

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

        // set auditingRunner to implement DI in model
        if (deleteOptions?.auditing) deleteOptions.auditing.auditingRunner = this.auditingRunner;

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