/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { env } from 'node:process';
import { getPackageFile } from '../../../domain/functions';

@ApiTags('[core] environment information')
@Controller('core/environment-information')
export class CoreEnvironmentInformationController {
  @Get()
  @ApiOperation({ summary: 'Get server environment information' })
  @ApiCreatedResponse({
    description: 'Version of server obtained from the package.json file',
  })
  async main() {
    const packageFile = getPackageFile();

    return {
      name: packageFile.name,
      version: packageFile.version,
      environment: env.NODE_ENV,
    };
  }
}
