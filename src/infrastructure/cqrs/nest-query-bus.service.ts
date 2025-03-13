import { Injectable } from '@nestjs/common';
import { QueryBus as NestQueryBusImplementation, ICommand } from '@nestjs/cqrs';
import { IQueryBus } from '../../domain/cqrs';

@Injectable()
export class NestQueryBus implements IQueryBus
{
    constructor(
        private readonly queryBus: NestQueryBusImplementation
    ) {}

    async ask<T extends ICommand, R = any>(query: T): Promise<R>
    {
        return await this.queryBus.execute(query);
    }
}
