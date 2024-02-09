import * as dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export const nowTimestamp = (): string =>
{
    return dayjs().format('YYYY-MM-DD H:mm:ss');
};