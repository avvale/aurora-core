/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import * as fs from 'node:fs';

@ApiTags('[core] version')
@Controller('core/version')
export class CoreVersionController
{
    @Get()
    @ApiOperation({ summary: 'Get server version' })
    @ApiCreatedResponse({ description: 'Version of server obtained from the package.json file' })
    async main()
    {
        const packageFile = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));

        return {
            version: packageFile.version,
        };
    }
}