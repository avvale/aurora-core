import { Sequelize } from 'sequelize';
import { CQMetadata, LiteralObject, QueryStatement } from '../../../..';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMESTAMP_REGEX = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown>
{
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function maybeConvertTimestamp(value: unknown, cQMetadata?: CQMetadata): unknown
{
    if (
        typeof value === 'string' &&
        cQMetadata?.timezone &&
        TIMESTAMP_REGEX.test(value)
    )
    {
        // Fallback to system timezone if process.env.TZ is not defined
        const targetTz = process.env.TZ ?? (dayjs.tz.guess?.() ?? 'UTC');
        return dayjs.tz(value, cQMetadata.timezone).tz(targetTz).format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
}

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
    // propagate options through arrays as well
    if (Array.isArray(queryStatement))
    {
        return queryStatement.map(val => setSequelizeFunctions(val as unknown as QueryStatement, cQMetadata, options));
    }

    if (isPlainObject(queryStatement))
    {
        const result: LiteralObject = {};

        // Reflect.ownKeys: includes symbols (i.e., Sequelize operators like Op.or)
        for (const key of Reflect.ownKeys(queryStatement))
        {
            const value = (queryStatement as Record<PropertyKey, unknown>)[key];

            // process function-style keys e.g. 'name::unaccent', 'createdAt::timestamp'
            if (typeof key === 'string' && key.includes('::'))
            {
                const [rawColumn, ...functions] = key.split('::');
                const parsedColumn = rawColumn.startsWith('$') && rawColumn.endsWith('$') ? rawColumn.slice(1, -1) : rawColumn;

                for (const [index, fn] of functions.entries())
                {
                    switch (fn)
                    {
                        case 'unaccent':
                            if (isPlainObject(value) || Array.isArray(value))
                            {
                                // return Sequelize.where(...) at this level
                                return Sequelize.where(
                                    Sequelize.fn('unaccent', Sequelize.col(parsedColumn)),
                                    setSequelizeFunctions(value as QueryStatement, cQMetadata, { ...options, setUnaccentValues: true }),
                                );
                            }
                            else
                            {
                                return Sequelize.where(
                                    Sequelize.fn('unaccent', Sequelize.col(parsedColumn)),
                                    Sequelize.fn('unaccent', value as unknown as string),
                                );
                            }

                        case 'cast':
                            {
                                const castType = functions[index + 1];
                                if (isPlainObject(value) || Array.isArray(value))
                                {
                                    return Sequelize.where(
                                        Sequelize.cast(Sequelize.col(parsedColumn), castType as any),
                                        setSequelizeFunctions(value as QueryStatement, cQMetadata, options),
                                    );
                                }
                                else
                                {
                                    return Sequelize.where(
                                        Sequelize.cast(Sequelize.col(parsedColumn), castType as any),
                                        value as unknown as string,
                                    );
                                }
                            }

                        case 'timestamp':
                            if (isPlainObject(value) || Array.isArray(value))
                            {
                                result[parsedColumn] = setSequelizeFunctions(value as QueryStatement, cQMetadata, { ...options, setTimestamp: true });
                            }
                            else
                            {
                                result[parsedColumn] = value;
                            }
                            // continue to next key
                            continue;
                    }
                }
            }

            // process table-referenced columns using Sequelize.col, e.g. 'User.name'
            if (typeof key === 'string' && key.includes('.') && !key.includes('::'))
            {
                const rawCol = key;
                const parsedCol = rawCol.startsWith('$') && rawCol.endsWith('$') ? rawCol.slice(1, -1) : rawCol;

                if (isPlainObject(value) || Array.isArray(value))
                {
                    return Sequelize.where(
                        Sequelize.col(parsedCol),
                        setSequelizeFunctions(value as QueryStatement, cQMetadata, options),
                    );
                }
                else
                {
                    const processed = options.setTimestamp ? value : maybeConvertTimestamp(value, cQMetadata);
                    return Sequelize.where(Sequelize.col(parsedCol), processed as any);
                }
            }

            // non-function key or symbol key
            if (isPlainObject(value) || Array.isArray(value))
            {
                (result as any)[key as any] = setSequelizeFunctions(value as QueryStatement, cQMetadata, options);
            }
            else
            {
                if (options.setUnaccentValues)
                {
                    (result as any)[key as any] = Sequelize.fn('unaccent', value);
                }
                else if (options.setTimestamp)
                {
                    (result as any)[key as any] = value;
                }
                else
                {
                    (result as any)[key as any] = maybeConvertTimestamp(value, cQMetadata);
                }
            }
        }

        return result;
    }

    // nothing to evaluate for primitives
    return queryStatement as unknown as LiteralObject;
};
