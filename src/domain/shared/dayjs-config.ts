import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setTimeZoneApplication(configService: ConfigService, dayjs): void
{
    // check that exist timezone in environment file
    if (!configService.get<string>('APP_TIMEZONE'))
        throw new InternalServerErrorException('APP_TIMEZONE variable is not defined in environment file');

    // check valid timezone in environment file
    if (!dayjs().tz(configService.get<string>('APP_TIMEZONE'))) 
        throw new InternalServerErrorException(`APP_TIMEZONE environment value has an incorrect value: ${configService.get<string>('APP_TIMEZONE')}`);

    // set data source timezone for application
    process.env.TZ = configService.get<string>('APP_TIMEZONE');

    // set timezone, this timezone will be used for:
    // - create data in application scope, (createdAt, updatedAt, deletedAt, etc.)
    // - default timezone for dates received, if has not defined X-Timezone header
    // - data will be returned with this timezone, if has not defined X-Timezone header
    dayjs.tz.setDefault(process.env.TZ);
}
