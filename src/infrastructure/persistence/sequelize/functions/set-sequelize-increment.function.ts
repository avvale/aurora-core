import { Sequelize } from 'sequelize';
import { LiteralObject } from '../../../../domain/types';

export const setSequelizeIncrementFunction = (
  payload: LiteralObject,
): LiteralObject => {
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'number') {
      // add "" to column name to be able camel case column names
      payload[key] = Sequelize.literal(`"${key}" + ${value}`);
    }
  }
  return payload;
};
