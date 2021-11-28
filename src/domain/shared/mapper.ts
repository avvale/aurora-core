import { AggregateBase } from './aggregate-base';
import { ObjectLiteral, CQMetadata } from '../aurora.types';

export interface IMapper
{
    mapModelToAggregate(object: ObjectLiteral, cQMetadata?: CQMetadata): AggregateBase;

    mapModelsToAggregates(objects: ObjectLiteral[], cQMetadata?: CQMetadata): AggregateBase[];

    mapAggregateToResponse(aggregate: AggregateBase): ObjectLiteral;

    mapAggregatesToResponses(aggregates: AggregateBase[]): ObjectLiteral[];
}