import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

export abstract class MailerTransportService
{
    abstract getTransport(): TransportType;
}
