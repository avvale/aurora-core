import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ICommandBus {
  abstract dispatch<T, R = any>(command: T): Promise<R>;
}
