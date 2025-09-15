import { join } from 'node:path';

export class Fs
{
    public static storagePublicAbsoluteDirectoryPath(
        relativePathSegments: string[],
    ): string
    {
        return join(Fs.storagePublicBasePath(), ...relativePathSegments);
    }

    public static storagePublicAbsoluteDirectoryURL(
        relativePathSegments: string[],
    ): string
    {
        return `${Fs.storagePublicBaseURL()}/${relativePathSegments.join('/')}`;
    }

    public static storagePublicAbsolutePath(
        relativePathSegments: string[],
        filename: string,
    ): string
    {
        return join(Fs.storagePublicBasePath(), ...relativePathSegments, filename);
    }

    public static storagePublicAbsoluteURL(
        relativePathSegments: string[],
        filename: string,
    ): string
    {
        return `${Fs.storagePublicAbsoluteDirectoryURL(relativePathSegments)}/${filename}`;
    }

    public static storagePublicBasePath(): string
    {
        return join(process.cwd(), process.env.STORAGE_ACCOUNT_PUBLIC_PATH);
    }

    public static storagePublicBaseURL(): string
    {
        return `${process.env.STORAGE_ACCOUNT_URL}/${process.env.STORAGE_ACCOUNT_PUBLIC_PATH}`;
    }

    public static storagePublicRelativeURL(
        relativePathSegments: string[],
        filename: string,
    ): string
    {
        return `${relativePathSegments.join('/')}/${filename}`;
    }
}