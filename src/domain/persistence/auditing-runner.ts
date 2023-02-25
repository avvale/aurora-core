import { AuditingMeta } from '../aurora.types';

export abstract class IAuditingRunner
{
    abstract create(
        auditingMeta: AuditingMeta,
        now: string,
    ): void
}