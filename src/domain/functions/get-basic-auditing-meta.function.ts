import { getAnonymousSystemAccount } from '../functions';
import { AuditingMeta } from '../types';

export const getBasicAuditingMeta = (): AuditingMeta => {
  return {
    account: getAnonymousSystemAccount(),
  };
};
