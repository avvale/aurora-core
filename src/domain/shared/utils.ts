import { LiteralObject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as mime from 'mime';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
declare const Buffer: any;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export class Utils
{
    public static arrayRemoveItem<T = any>(arr: T[], value: T | T[]): T[]
    {
        let arrValues: T[];
        if (Array.isArray(value))
        {
            arrValues = value;
        }
        else
        {
            if (value)
            {
                arrValues = [value];
            }
            else
            {
                return [];
            }
        }

        return arr.filter(ele => !arrValues.includes(ele));
    }

    public static now(): dayjs.Dayjs
    {
        return dayjs();
    }

    public static nowTimestamp(): string
    {
        return dayjs().format('YYYY-MM-DD H:mm:ss');
    }

    public static nowDate(): string
    {
        return dayjs().format('YYYY-MM-DD');
    }

    public static sha1(data: string): string
    {
        const generator = crypto.createHash('sha1');
        generator.update(data);

        return generator.digest('hex');
    }

    public static base64Encode(data: string): string
    {
        return Buffer.from(data).toString('base64');
    }

    public static base64Decode(data: string): string
    {
        return Buffer.from(data, 'base64').toString('utf-8');
    }

    // http://jsfiddle.net/drzaus/9g5qoxwj/
    public static deepDiff(a: LiteralObject, b: LiteralObject, result: LiteralObject, reversible: boolean = false): void
    {
        _.each(a, function(value, key)
        {
            // is is a array use equals prototype definition to compare
            if (Array.isArray(value))
            {
                if (value.equals(b[key])) return;
                result[key] = a[key];
            }

            // already checked this or equal...
            // eslint-disable-next-line no-prototype-builtins
            if (result.hasOwnProperty(key) || b[key] === value) return;
            // but what if it returns an empty object? still attach?
            result[key] = _.isObject(value) ? Utils.diff(value, b[key], reversible) : value;
        });
    }

    // http://jsfiddle.net/drzaus/9g5qoxwj/
    public static shallowDiff(a: LiteralObject, b: LiteralObject): LiteralObject
    {
        return _.omitBy(a, (value, key) =>
        {
            return b[key] === value;
        });
    }

    // http://jsfiddle.net/drzaus/9g5qoxwj/
    public static diff(a: LiteralObject, b: LiteralObject, reversible: boolean = false): LiteralObject
    {
        const r = {};
        Utils.deepDiff(a, b, r, reversible);
        if(reversible) Utils.deepDiff(b, a, r, reversible);
        return r;
    }

    // map deeply object keys
    public static deepMapKeys(obj, fn): LiteralObject
    {
        return Array.isArray(obj)
            ? obj.map(val => Utils.deepMapKeys(val, fn))
            : typeof obj === 'object'
                ? Object.keys(obj).reduce((acc, current) =>
                {
                    const key = fn(current);
                    const val = obj[current];
                    acc[key] = val !== null && typeof val === 'object' ? Utils.deepMapKeys(val, fn) : val;
                    return acc;
                }, {})
                : obj;
    }

    public static deepMapKeysOperators(obj, fn): LiteralObject
    {
        return Array.isArray(obj) ?
            obj.map(val => Utils.deepMapKeysOperators(val, fn)) :
            typeof obj === 'object' &&
            obj.constructor.name !== 'Fn' &&    // avoid manage Sequelize.fn
            obj.constructor.name !== 'Cast' ?   // avoid manage Sequelize.cast
                Object.keys(obj).reduce((acc, current) =>
                {
                    const key = fn(current);
                    const val = obj[current];
                    acc[key] = val !== null && typeof val === 'object' ? Utils.deepMapKeysOperators(val, fn) : val;
                    return acc;
                }, {})
                : obj;
    }

    public static deepMapValues(obj, fn: (val, key) => any): LiteralObject
    {
        if (Array.isArray(obj))
        {
            return obj.map(function(val, key)
            {
                return (typeof val === 'object') ? Utils.deepMapValues(val, fn) : fn(val, key);
            });
        }
        else if (typeof obj === 'object')
        {
            // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/null
            const res = obj === null ? null : {};
            for (const key in obj)
            {
                const val = obj[key];
                if (typeof val === 'object')
                {
                    res[key] = Utils.deepMapValues(val, fn);
                }
                else
                {
                    res[key] = fn(val, key);
                }
            }
            return res;
        }
        else
        {
            return obj;
        }
    }

    public static hash(password: string, saltRounds = 10): string
    {
        return bcrypt.hashSync(password, saltRounds);
    }

    public static mimeFromExtension(extension: string): string
    {
        // set to lowercase and delete . character
        extension = extension.toLowerCase().replace(/\./g, '');

        return mime.getType(extension);
    }

    public static isImageMime(mime: string): boolean
    {
        switch (mime)
        {
            case 'image/gif':
            case 'image/jpeg':
            case 'image/pjpeg':
            case 'image/png':
            case 'image/svg+xml':
                return true;
                break;
            default:
                return false;
        }
    }

    public static uuid(): string
    {
        return uuidv4();
    }

    public static randomString(length: number, chars: string): string
    {
        let mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        let result = '';
        for (let i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    public static basePath(...relativePath): string
    {
        return path.join(process.cwd(), ...relativePath);
    }

    public static asset(...relativePath): string
    {
        return relativePath.join('/');
    }
}