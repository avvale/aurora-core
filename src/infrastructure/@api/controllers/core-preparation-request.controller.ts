/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controller for GCP to manage application live
 */
@ApiTags('[core] gcp')
@Controller('_ah/warmup')
export class CorePreparationRequestController {
  @Get()
  @ApiOperation({ summary: 'GCP app engine instance management' })
  @ApiCreatedResponse({
    description: 'Request called by GCP to keep the instance alive.',
  })
  async main() {
    // request called by GCP to keep the instance alive
    return { status: true };
  }
}
