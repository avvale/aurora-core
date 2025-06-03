import { LiteralObject } from '../../../../domain/types';
import { Sequelize } from 'sequelize';

export const setSequelizeIncrementFunction = (
    payload: LiteralObject,
): LiteralObject =>
{
    for (const [key, value] of Object.entries(payload))
    {
        if (typeof value === 'number')
        {
            // add "" to column name to be able camel case column names
            payload[key] = Sequelize.literal(`"${key}" + ${value}`);
        }
    }
    return payload;
};