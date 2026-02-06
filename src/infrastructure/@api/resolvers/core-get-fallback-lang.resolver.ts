/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Query, Resolver } from '@nestjs/graphql';
import { CoreGetFallbackLangHandler } from '../handlers';

@Resolver()
export class CoreGetFallbackLangResolver {
  constructor(private readonly handler: CoreGetFallbackLangHandler) {}

  @Query('coreGetFallbackLang')
  main() {
    return this.handler.main();
  }
}
