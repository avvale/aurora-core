import { AuditingMeta } from '../aurora.types';

export abstract class AuditingRunner
{
    abstract create(
        auditingMeta: AuditingMeta,
        now: string,
        event: string,
        modelPath: string,
        modelName: string,
        auditableId: string,
        oldValue: any,
        newValue: any,
    ): void
}