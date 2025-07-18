import { Op } from 'sequelize';
import { Utils } from '../../../domain/shared/utils';
import { merge, isEmpty } from 'lodash';
import { setSequelizeFunctions } from './functions/set-sequelize-functions.function';
import { CQMetadata } from '../../../domain/types';
import { ICriteria, Operator, QueryStatement } from '../../../domain/persistence';

export class SequelizeCriteria implements ICriteria
{
    implements(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): QueryStatement
    {
        // get all keys from Operator enum
        const availableOperators = [];
        for (const operator in Operator)
        {
            if (!isNaN(Number(operator))) break;
            availableOperators.push(operator);
        }

        // replace key string by sequelize symbols
        queryStatement = Utils.deepMapKeysOperators(
            queryStatement,
            key => key.startsWith('[') &&
            key.endsWith(']') &&
            availableOperators.includes(key.slice(1,-1))
                ? Op[key.slice(1,-1)]
                : key,
        );

        // set sequelize functions to query statement
        queryStatement = setSequelizeFunctions(queryStatement, cQMetadata);

        return queryStatement;
    }

    mergeQueryConstraintStatement(
        queryStatement: QueryStatement,
        constraint: QueryStatement,
    ): QueryStatement
    {
        // merge query and constraint, merge on variables references, clone objects to a
        const finalQueryStatement = merge({}, queryStatement, constraint);

        // only overwrite where statement if both query and constraint have where
        if (!isEmpty(queryStatement.where) && !isEmpty(constraint.where))
        {
            finalQueryStatement.where = {
                [Operator.and]: [queryStatement.where, constraint.where],
            };
        }

        return finalQueryStatement;
    }
}