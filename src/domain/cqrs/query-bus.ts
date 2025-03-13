import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IQueryBus
{
    abstract ask<T, R = any>(command: T): Promise<R>;
}