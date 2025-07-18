import { Sequelize } from 'sequelize';
import { CQMetadata, LiteralObject, QueryStatement } from '../../../..';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

export const setSequelizeFunctions = (
    queryStatement: QueryStatement,
    cQMetadata: CQMetadata,
    options: {
        setUnaccentValues?: boolean;
        setTimestamp?: boolean;
    } = {
        setUnaccentValues: false,
        setTimestamp: false,
    },
): LiteralObject =>
{
    if (Array.isArray(queryStatement))
    {
        return queryStatement.map(val => setSequelizeFunctions(val, cQMetadata));
    }
    else if (typeof queryStatement === 'object' && queryStatement !== null)
    {
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Reflect
        // Reflect.ownKeys, retrieve keys from object, even if they are symbols
        return Reflect
            .ownKeys(queryStatement)
            .map(key => [key, queryStatement[key]])
            .reduce((newQueryStatement, [key, value]) =>
            {
                if (typeof value === 'object' && value !== null)
                {
                    if (typeof key !== 'symbol' && key.indexOf('::') > -1)
                    {
                        const [column, ...functions] = key.split('::');
                        for (const [index, fn] of functions.entries())
                        {
                            // if column start with '$' and end with '$' then remove it when use unaccent or cast, because use the Sequelize.col function.
                            const parsedColumn = column.startsWith('$') && column.endsWith('$') ? column.slice(1, -1) : column;

                            /********************************************************************************
                            *   return function instance of object, should be a array position, example:
                            *   [Op.or]: [
                            *       {
                            *           'name::unaccent': {
                            *               [iLike]: 'Hello'
                            *           }
                            *       }
                            *   ]
                            *
                            *   [Op.or]: [
                            *       Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {
                            *               [iLike]: Sequelize.fn('unaccent', 'Hello')
                            *       })
                            *   ]
                            ********************************************************************************/
                            switch (fn)
                            {
                                // return function instance of object
                                case 'unaccent':
                                    return Sequelize.where(Sequelize.fn('unaccent', Sequelize.col(parsedColumn)), setSequelizeFunctions(value, cQMetadata, { setUnaccentValues: true }));

                                case 'cast':
                                    return Sequelize.where(Sequelize.cast(Sequelize.col(parsedColumn), functions[index + 1]), setSequelizeFunctions(value, cQMetadata));

                                case 'timestamp':
                                    newQueryStatement[parsedColumn] = setSequelizeFunctions(value, cQMetadata, { setTimestamp: true });
                                    return newQueryStatement;
                            }
                        }
                    }
                    else
                    {
                        // if key is a symbol or key without function operator ('::')
                        newQueryStatement[key] = setSequelizeFunctions(value, cQMetadata);
                    }
                }
                else
                {
                    // if value is primitive value and contains '::' then is a function
                    if (typeof key !== 'symbol' && key.indexOf('::') > -1)
                    {
                        const [column, ...functions] = key.split('::');
                        for (const [index, fn] of functions.entries())
                        {
                            /********************************************************************************
                            *   return function instance of object, should be a array position, example:
                            *   [ Op.or]: [
                            *       {
                            *         name: 'Hello'
                            *       }
                            *   ]
                            *
                            *   [Op.or]: [
                            *       Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), 'Hello')
                            *   ]
                            ********************************************************************************/
                            switch (fn)
                            {
                                // return function instance of object
                                case 'unaccent':
                                    return Sequelize.where(Sequelize.fn('unaccent', Sequelize.col(column)), Sequelize.fn('unaccent', value));

                                case 'cast':
                                    return Sequelize.where(Sequelize.cast(Sequelize.col(column), functions[index + 1]), value);

                                case 'timestamp':
                                    newQueryStatement[column] = value;
                                    return newQueryStatement;
                            }
                        }
                    }
                    else
                    {
                        if (options.setUnaccentValues)
                        {
                            newQueryStatement[key] = Sequelize.fn('unaccent', value);
                        }
                        else if (options.setTimestamp)
                        {
                            newQueryStatement[key] = value;
                        }
                        else if (
                            typeof value === 'string' &&
                            cQMetadata?.timezone &&
                            value.match(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/)
                        )
                        {
                            // add timezone to query statement
                            newQueryStatement[key] = dayjs.tz(value, cQMetadata.timezone).tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
                        }
                        else
                        {
                            newQueryStatement[key] = value;
                        }
                    }
                }
                return newQueryStatement;
            }, {});
    }
    else
    {
        // noting to evaluate
        return queryStatement;
    }
};