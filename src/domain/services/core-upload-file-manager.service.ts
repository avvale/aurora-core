import { CoreFile, CoreFileUploaded } from '../types';

export abstract class CoreUploadFileManagerService
{
    abstract uploadFile(filePayload: CoreFileUploaded): Promise<CoreFile>;
    abstract uploadFiles(filePayloads: CoreFileUploaded[]):  Promise<CoreFile[]>;
}
