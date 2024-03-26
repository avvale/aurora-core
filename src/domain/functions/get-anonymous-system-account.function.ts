import { AuditingAccount } from '../aurora.types';

export const getAnonymousSystemAccount = (): AuditingAccount =>
{
    return {
        id   : 'cedbd346-1911-4639-9ff1-e059ef675e19',
        email: 'system@aurorajs.dev',
    };
};