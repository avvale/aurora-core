import { LiteralObject } from '../types';
import { TimestampValueObject } from '../value-objects/timestamp.value-object';
import { UuidValueObject } from '../value-objects/uuid.value-object';

export interface AggregateBase
{
    id?: UuidValueObject;
    createdAt?: TimestampValueObject;
    updatedAt?: TimestampValueObject;
    deletedAt?: TimestampValueObject;

    toDTO(): LiteralObject;
    toRepository(): LiteralObject;
}