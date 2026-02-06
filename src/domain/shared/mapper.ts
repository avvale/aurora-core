import { CQMetadata, LiteralObject } from '../types';
import { AggregateBase } from './aggregate-base';

export interface IMapper {
  mapModelToAggregate(
    object: LiteralObject,
    cQMetadata?: CQMetadata,
  ): AggregateBase;

  mapModelsToAggregates(
    objects: LiteralObject[],
    cQMetadata?: CQMetadata,
  ): AggregateBase[];

  mapAggregateToResponse(aggregate: AggregateBase): LiteralObject;

  mapAggregatesToResponses(aggregates: AggregateBase[]): LiteralObject[];
}
