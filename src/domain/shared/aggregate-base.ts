import { LiteralObject } from '@nestjs/common';
import { UuidValueObject } from '../value-objects/uuid.value-object';
import { TimestampValueObject } from '../value-objects/timestamp.value-object';

export interface AggregateBase
{
    id?: UuidValueObject;
    createdAt?: TimestampValueObject;
    updatedAt?: TimestampValueObject;
    deletedAt?: TimestampValueObject;

    toDTO(): LiteralObject;
}