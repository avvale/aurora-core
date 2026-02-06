import { Injectable } from '@nestjs/common';
import { AggregateBase } from '../../../domain/shared/aggregate-base';
import { TimestampValueObject } from '../../../domain/value-objects/timestamp.value-object';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require('clean-deep');

@Injectable()
export abstract class MockSeeder<Aggregate extends AggregateBase> {
  public readonly aggregateName: string;
  public collectionSource: Aggregate[];
  public deletedAtInstance: TimestampValueObject;

  get collectionResponse(): any[] {
    return this.collectionSource.map((item) =>
      cleanDeep(item.toDTO(), {
        nullValues: false,
        emptyStrings: false,
        emptyObjects: false,
        emptyArrays: false,
      }),
    );
  }
}
