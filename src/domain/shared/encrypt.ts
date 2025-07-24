import { base64Decode, base64Encode, sha1 } from '../functions';

export class Encrypt
{
    /**
     * Encrypts the given data using SHA-1.
     * @param data The data to encrypt.
     * @returns The SHA-1 hash of the data.
     */
    public static sha1(data: string): string
    {
        return sha1(data);
    }

    /**
     * Encodes the given data to Base64 format.
     * @param data The data to encode.
     * @returns The Base64 encoded string.
     */
    public static base64Encode(data: string): string
    {
        return base64Encode(data);
    }

    /**
     * Decodes the given Base64 encoded data.
     * @param data The Base64 encoded string to decode.
     * @returns The decoded string.
     */
    public static base64Decode(data: string): string
    {
        return base64Decode(data);
    }
}