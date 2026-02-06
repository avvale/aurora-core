import * as _ from 'lodash';

export const diff = <T = any>(newObj: T, origObj: T): T => {
  const changes = (newObj, origObj): any => {
    let arrayIndexCounter = 0;
    return _.transform(newObj, (result, value, key) => {
      if (!_.isEqual(value, origObj[key])) {
        const resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          _.isObject(value) && _.isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  };
  return changes(newObj, origObj);
};
