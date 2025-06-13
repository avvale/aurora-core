import * as dayjs from 'dayjs';

export const dateFromFormat = (
    date: string,
    format: string = 'YYYY-MM-DD H:mm:ss',
    strict: boolean = false,
): dayjs.Dayjs =>
{
    return dayjs(date, format, strict);
};
