import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as _ from 'lodash';
import * as mime from 'mime';
import { nanoid } from 'nanoid';
import { createWriteStream, unlink } from 'node:fs';
import * as path from 'path';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { LiteralObject } from '../aurora.types';
declare const Buffer: any;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export class Utils
{
    public static now(): dayjs.Dayjs
    {
        return dayjs();
    }

    // @deprecated
    // Use nowTimestamp function instead
    public static nowTimestamp(): string
    {
        return dayjs().format('YYYY-MM-DD H:mm:ss');
    }

    public static nowDate(): string
    {
        return dayjs().format('YYYY-MM-DD');
    }

    public static dateFromFormat(date: string, format: string = 'YYYY-MM-DD H:mm:ss'): dayjs.Dayjs
    {
        return dayjs(date, format);
    }

    public static sha1(data: string): string
    {
        const generator = crypto.createHash('sha1');
        generator.update(data);

        return generator.digest('hex');
    }

    // @deprecated
    // Use uuid function instead
    public static uuid(seed?: string): string
    {
        if (seed)
        {
            const uuidSpaceName = '3eb6ecd7-2f06-4d41-934c-3f813c96982a';
            return uuidv5(seed, uuidSpaceName);
        }

        return uuidv4();
    }

    /**
     * @deprecated Use nanoid() from import { nanoid } from 'nanoid';
     */
    public static nanoid(): string
    {
        return nanoid();
    }

    static wait(time: number): Promise<void>
    {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    public static base64Encode(data: string): string
    {
        return Buffer.from(data).toString('base64');
    }

    public static base64Decode(data: string): string
    {
        return Buffer.from(data, 'base64').toString('utf-8');
    }

    /**
     * @deprecated The method should not be used
     */
    public static diff(newObj, origObj): any
    {
        const changes = (newObj, origObj): any =>
        {
            let arrayIndexCounter = 0;
            return _.transform(newObj, (result, value, key) =>
            {
                if (!_.isEqual(value, origObj[key]))
                {
                    const resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key;
                    result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value;
                }
            });
        };
        return changes(newObj, origObj);
    }

    /**
     * @deprecated Use Array.removeItem instead
     */
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

    // determines if two arrays have a common item
    public static arraysIntersects<T = any>(arr1: T[], arr2: T[]): boolean
    {
        const arrayUniqueValues = new Set(arr2);
        return [...new Set(arr1)].some(x => arrayUniqueValues.has(x));
    }

    public static arraysHasSameValues<T = any>(arr1: T[], arr2: T[]): boolean
    {
        if (arr1.length === arr2.length)
        {
            return arr1.every(element =>
            {
                if (arr2.includes(element)) return true;
                return false;
            });
        }
        return false;
    }

    public static arrayGroup<T>(arr: T[], n: number): T[][]
    {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += n)
        {
            result.push(arr.slice(i, i + n));
        }
        return result;
    }

    // map deeply object keys

    /**
     * @param obj object to map keys
     * @param fn function to get key
     * @param getKeys by default use Reflect.ownKeys to get also non-enumerable properties like Symbols but can use Object.keys too
     * @returns object with mapped keys
     */
    public static deepMapKeys(
        obj: unknown,
        fn: (key) => string,
        getKeys = Reflect.ownKeys,
    ): LiteralObject
    {
        return Array.isArray(obj)
            ? obj.map(val => Utils.deepMapKeys(val, fn))
            : typeof obj === 'object'
                ? getKeys(obj).reduce((acc, current) =>
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
            case 'image/webp':
            case 'image/svg+xml':
                return true;
                break;
            default:
                return false;
        }
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

    public static isValidJson(json: string): boolean
    {
        try
        {
            JSON.parse(json);
        }
        catch (e)
        {
            return false;
        }
        return true;
    }

    /**
     * @param path path to save file
     * @param stream stream to save
     * @returns Promise
     */
    public static storageStream(path: string | URL, stream: any): Promise<unknown>
    {
        return new Promise((resolve, reject) =>
        {
            // Create a stream to which the upload will be written.
            const writeStream = createWriteStream(path);

            // When the upload is fully written, resolve the promise.
            writeStream.on('finish', resolve);

            // If there's an error writing the file, remove the partially written file
            // and reject the promise.
            writeStream.on('error', error =>
            {
                unlink(path, () =>
                {
                    reject(error);
                });
            });

            // In Node.js <= v13, errors are not automatically propagated between piped
            // streams. If there is an error receiving the upload, destroy the write
            // stream with the corresponding error.
            stream.on('error', error => writeStream.destroy(error));

            // Pipe the upload into the write stream.
            stream.pipe(writeStream);
        });
    }

    /*
    review this method
    public static findKeyPath (ob: LiteralObject, key: string): string
    {
        const path = [];
        const keyExists = obj =>
        {
            if (!obj || (typeof obj !== 'object' && !Array.isArray(obj)))
            {
                return false;
            }
            else if (obj.hasOwnProperty(key))
            {
                return true;
            }
            else if (Array.isArray(obj))
            {
                const parentKey = path.length ? path.pop() : '';

                for (let i = 0; i < obj.length; i++)
                {
                    path.push(`${parentKey}[${i}]`);
                    const result = keyExists(obj[i]);
                    if (result)
                    {
                        return result;
                    }
                    path.pop();
                }
            }
            else
            {
                for (const k in obj)
                {
                    if ((<any>Object).values(Operator).includes(k))
                    {
                        path.push(`['${k}']`);
                    }
                    else
                    {
                        path.push(k);
                    }

                    const result = keyExists(obj[k]);
                    if (result)
                    {
                        return result;
                    }
                    path.pop();
                }
            }
            return false;
        };

        keyExists(ob);

        return path.join('.');
    }
*/
}