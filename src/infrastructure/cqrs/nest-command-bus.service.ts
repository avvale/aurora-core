import { Injectable } from '@nestjs/common';
import {
  ICommand,
  CommandBus as NestCommandBusImplementation,
} from '@nestjs/cqrs';
import { ICommandBus } from '../../domain/cqrs';

@Injectable()
export class NestCommandBus implements ICommandBus {
  constructor(private readonly commandBus: NestCommandBusImplementation) {}

  async dispatch<T extends ICommand>(command: T): Promise<any> {
    return await this.commandBus.execute(command);
  }
}
