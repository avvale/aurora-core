import { OnApplicationBootstrap } from '@nestjs/common';

export abstract class CoreGetLangsService implements OnApplicationBootstrap {
  abstract get<T = any>(): Promise<T[]>;
  abstract init(): Promise<void>;
  abstract onApplicationBootstrap(): void;
}
