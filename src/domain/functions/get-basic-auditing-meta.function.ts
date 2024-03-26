import { AuditingMeta } from '../aurora.types';
import { getAnonymousSystemAccount } from './get-anonymous-system-account.function';

export const getBasicAuditingMeta = (): AuditingMeta =>
{
    return {
        account: getAnonymousSystemAccount(),
    };
};