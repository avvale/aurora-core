import { snakeCase } from 'lodash';
import {
  annotateModelWithIndex,
  IndexFieldOptions,
  IndexOptions,
} from 'sequelize-typescript';

declare type IndexDecoratorOptions = IndexOptions &
  Pick<IndexFieldOptions, Exclude<keyof IndexFieldOptions, 'name'>>;

type AnnotationFunction = <T>(target: T, propertyName: string) => void;

/**
 * Support @UnderscoredIndex('index_name')
 */
export function UnderscoredIndex(name: string): AnnotationFunction;

/**
 * Support @UnderscoredIndex({ name: 'index_name', unique: true })
 */
export function UnderscoredIndex(
  indexOptions: IndexOptions,
): AnnotationFunction;

/**
 * Support @UnderscoredIndex
 */
export function UnderscoredIndex<T>(
  target: T,
  propertyName: string,
  indexDecoratorOptions?: IndexDecoratorOptions,
): void;

/**
 * Overloaded decorator to support all variants of @UnderscoredIndex
 */
export function UnderscoredIndex<T>(
  ...args: unknown[]
): AnnotationFunction | void {
  if (arguments.length >= 2) {
    const type: T = <T>args[0];
    const key: string = <string>args[1];
    const indexDecoratorOptions: IndexDecoratorOptions = <
      IndexDecoratorOptions
    >args[2];
    annotateModelWithIndex(type, snakeCase(key), indexDecoratorOptions);
  } else {
    return <Type>(target: Type, propertyName: string) => {
      const indexDecoratorOptions: IndexDecoratorOptions = <
        IndexDecoratorOptions
      >args[0];
      annotateModelWithIndex(
        target,
        snakeCase(propertyName),
        indexDecoratorOptions,
      );
    };
  }
}
