import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { isPlainObject } from 'lodash';
import { Sequelize } from 'sequelize';
import {
  CQMetadata,
  DateTime,
  LiteralObject,
  QueryStatement,
} from '../../../..';
dayjs.extend(utc);
dayjs.extend(timezone);

export const setSequelizeFunctions = (
  currentStatement: any,
  cQMetadata: CQMetadata,
  options: {
    setUnaccentValues?: boolean;
    setTimestamp?: boolean;
  } = {
    setUnaccentValues: false,
    setTimestamp: false,
  },
): LiteralObject => {
  // propagate options through arrays as well
  if (Array.isArray(currentStatement)) {
    return currentStatement.map((val) =>
      setSequelizeFunctions(
        val as unknown as QueryStatement,
        cQMetadata,
        options,
      ),
    );
  }

  if (!isPlainObject(currentStatement)) return currentStatement;

  // Reflect.ownKeys: includes symbols (i.e., Sequelize operators like Op.or)
  for (const key of Reflect.ownKeys(currentStatement)) {
    const value = currentStatement[key];

    // sequelize function application zone by key
    // process function-style keys e.g. 'name::unaccent', 'status::cast::varchar', 'createdAt::timestamp'
    if (typeof key === 'string' && key.includes('::')) {
      const [rawColumn, ...functions] = key.split('::');
      const parsedColumn =
        rawColumn.startsWith('$') && rawColumn.endsWith('$')
          ? rawColumn.slice(1, -1)
          : rawColumn;

      // iterate over functions to apply them in sequence
      for (const [index, fn] of functions.entries()) {
        switch (fn) {
          // performs a comparison that is insensitive to accents and other diacritics
          case 'unaccent':
            if (isPlainObject(value) || Array.isArray(value)) {
              // return Sequelize.where(...) at this level
              currentStatement[rawColumn] = Sequelize.where(
                Sequelize.fn('unaccent', Sequelize.col(parsedColumn)),
                setSequelizeFunctions(value, cQMetadata, {
                  ...options,
                  setUnaccentValues: true,
                }),
              );
            } else {
              currentStatement[rawColumn] = Sequelize.where(
                Sequelize.fn('unaccent', Sequelize.col(parsedColumn)),
                Sequelize.fn('unaccent', value),
              );
            }
            delete currentStatement[key];
            return currentStatement;

          // casts to the specified type
          case 'cast':
            const castType = functions[index + 1];
            if (isPlainObject(value) || Array.isArray(value)) {
              currentStatement[rawColumn] = Sequelize.where(
                Sequelize.cast(Sequelize.col(parsedColumn), castType as any),
                setSequelizeFunctions(
                  value as QueryStatement,
                  cQMetadata,
                  options,
                ),
              );
            } else {
              currentStatement[rawColumn] = Sequelize.where(
                Sequelize.cast(Sequelize.col(parsedColumn), castType as any),
                value as unknown as string,
              );
            }
            delete currentStatement[key];
            return currentStatement;

          case 'timestamp':
            if (isPlainObject(value) || Array.isArray(value)) {
              currentStatement[rawColumn] = setSequelizeFunctions(
                value as QueryStatement,
                cQMetadata,
                { ...options, setTimestamp: true },
              );
            } else {
              currentStatement[rawColumn] = value;
            }

            delete currentStatement[key];
            return currentStatement;
        }
      }
    }

    // sequelize function application zone by value
    if (!isPlainObject(value) && !Array.isArray(value)) {
      if (options.setUnaccentValues)
        currentStatement[key] = Sequelize.fn('unaccent', value);
      if (options.setTimestamp) currentStatement[key] = value;
      if (DateTime.isTimestamp(value) && cQMetadata?.timezone)
        currentStatement[key] = dayjs
          .tz(value as string, cQMetadata.timezone)
          .tz(process.env.TZ ?? dayjs.tz.guess?.() ?? 'UTC')
          .format('YYYY-MM-DD HH:mm:ss');
    } else {
      // non-function key, non-function value or symbol key
      currentStatement[key] = setSequelizeFunctions(value, cQMetadata, options);
    }
  }

  return currentStatement;
};
