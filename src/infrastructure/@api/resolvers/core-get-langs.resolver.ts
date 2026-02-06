/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Query, Resolver } from '@nestjs/graphql';
import { CoreGetLangsHandler } from '../handlers';

@Resolver()
export class CoreGetLangsResolver {
  constructor(private readonly handler: CoreGetLangsHandler) {}

  @Query('coreGetLangs')
  async main() {
    return await this.handler.main();
  }
}
