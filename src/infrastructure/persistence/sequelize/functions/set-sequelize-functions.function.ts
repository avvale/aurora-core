import { Sequelize } from 'sequelize';
import { LiteralObject, QueryStatement } from '../../../..';

export const setSequelizeFunctions = (
    queryStatement: QueryStatement,
    options: {
        setUnaccentValues?: boolean;
    } = {
        setUnaccentValues: false,
    },
): LiteralObject =>
{
    if (Array.isArray(queryStatement))
    {
        return queryStatement.map(val => setSequelizeFunctions(val));
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
                            /********************************************************************************
                            *   return function instance of object, should be a array position, example:
                            *   [ Op.or]: [
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
                                    return Sequelize.where(Sequelize.fn('unaccent', Sequelize.col(column)), setSequelizeFunctions(value, { setUnaccentValues: true }));

                                case 'cast':
                                    return Sequelize.where(Sequelize.cast(Sequelize.col(column), functions[index + 1]), setSequelizeFunctions(value));
                            }
                        }
                    }
                    else
                    {
                        newQueryStatement[key] = setSequelizeFunctions(value);
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
                            }
                        }

                    }
                    else
                    {
                        // if parent call is unaccent, then the nested values as unaccent
                        newQueryStatement[key] = options.setUnaccentValues ?  Sequelize.fn('unaccent', value) : value;
                    }
                }
                return newQueryStatement;
            }, {});
    }
    else
    {
        return queryStatement;
    }
};