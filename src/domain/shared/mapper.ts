import { LiteralObject } from '@nestjs/common';
import { AggregateBase } from './aggregate-base';
import { CQMetadata } from '../aurora.types';

export interface IMapper
{
    mapModelToAggregate(object: LiteralObject, cQMetadata?: CQMetadata): AggregateBase;

    mapModelsToAggregates(objects: LiteralObject[], cQMetadata?: CQMetadata): AggregateBase[];

    mapAggregateToResponse(aggregate: AggregateBase): LiteralObject;

    mapAggregatesToResponses(aggregates: AggregateBase[]): LiteralObject[];
}