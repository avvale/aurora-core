/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { memoryUsage } from 'node:process';

@ApiTags('[core] status')
@Controller('core/status')
export class CoreStatusController {
  @Get()
  @ApiOperation({ summary: 'Get node status' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  async main() {
    const mu = memoryUsage();

    return {
      totalMemory: this.setFormat(mu['rss']) + ' Gb',
      totalNodeMemory: this.setFormat(mu['heapTotal']) + ' Gb',
      nodeMemoryUsed: this.setFormat(mu['heapUsed']) + ' Gb',
      externalMemoryUsed: this.setFormat(mu['external']) + ' Gb',
      BuffersMemoryUsed: this.setFormat(mu['arrayBuffers']) + ' Gb',
    };
  }

  setFormat(value: number): number {
    return Math.round((value / 1024 / 1024 / 1024) * 100) / 100;
  }
}
