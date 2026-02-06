/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreGetSearchKeyLangHandler } from '../handlers';

@ApiTags('[core] search key lang')
@Controller('core/search-key-lang')
export class CoreGetSearchKeyLangController {
  constructor(private readonly handler: CoreGetSearchKeyLangHandler) {}

  @Get()
  @ApiOperation({ summary: 'Get search key lang' })
  @ApiCreatedResponse({
    description: 'The record has been successfully returned.',
  })
  async main() {
    return await this.handler.main();
  }
}
