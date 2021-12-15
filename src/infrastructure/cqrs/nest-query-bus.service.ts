import { Injectable } from '@nestjs/common';
import { QueryBus as NestQueryBusImplementation, ICommand } from '@nestjs/cqrs';
import { IQueryBus } from '../../domain/cqrs';

@Injectable()
export class NestQueryBus implements IQueryBus
{
    constructor(
        private readonly queryBus: NestQueryBusImplementation
    ) {}

    async ask<T extends ICommand>(query: T): Promise<any>
    {
        return await this.queryBus.execute(query);
    }
}
