import * as path from 'path';
import * as sharp from 'sharp';
import * as exifReader from 'exif-reader';

export class ImageManager
{
    public static async dimensions(path: string): Promise<{width: number, height: number}>
    {
        const metadata = await sharp(path).metadata();

        return {
            width : metadata.width,
            height: metadata.height,
        };
    }

    // allow read exif from absolute file path or exif buffer
    public static async exif(prop: string | Buffer)
    {
        const buffer = prop instanceof Buffer ? prop : (await sharp(prop).metadata()).exif;

        try
        {
            return exifReader(buffer);
        }
        catch (error)
        {
            return null;
        }
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

    public static async loadImage(path: string): Promise<sharp.Sharp>
    {
        return await sharp(path);
    }

    public static changeFormat(
        image: sharp.Sharp,
        format: string,
        options? : sharp.PngOptions | sharp.JpegOptions
    ): sharp.Sharp
    {
        switch (format)
        {
            case 'jpeg':
            case 'jpg':
                return image.jpeg(options);
            case 'png':
                return image.png(options);
            default:
                return image;
        }
    }

    public static crop(
        image: sharp.Sharp,
        region: sharp.Region
    ): sharp.Sharp
    {
        return image.extract(region);
    }

    public static resize(
        image: sharp.Sharp,
        width?: number | null,
        height?: number | null,
        options?: sharp.ResizeOptions

    ): sharp.Sharp
    {
        return image.resize(width, height, options);
    }

    public static cropAttachment(attachment, attachmentFamily, crop)
    {
        const image = sharp(path.join(attachment.library.pathname, attachment.library.filename));

        // TODO IGUALAR TIPOS SERGÚN MIME
        // set image format from attachment family (jpg, png, gif, etc.)
        if (attachmentFamily.format.toLowerCase() !== attachment.extension)
        {
            image.jpeg({
                quality: attachmentFamily.quality
            });

            // change data from attachment object
            // attachment.extension = 'jpeg'
            // etc ...
        }

        // crop image
        image.extract({
            left  : crop.x,
            top   : crop.y,
            width : crop.width,
            height: crop.height
        });

        // TODO, VALIDAR ESTO
        // resize image
        if (attachmentFamily.width === null || attachmentFamily.height === null)
        {
            // resize al tamaño del attachment family
        }
        else
        {
            // resize al tamaño indicado en el
        }

        // salvamos la imagen
        image.toFile('output.webp', (err, info) => {/**/});

        // get new properties from image cropped
        // attachment.with = info.width

        return {
            attachment      : '',
            attachmentFamily: '',
            crop            : 'crop'
        };
    }
}
