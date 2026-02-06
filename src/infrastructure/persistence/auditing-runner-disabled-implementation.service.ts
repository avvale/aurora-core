import { Injectable } from '@nestjs/common';
import { AuditingMeta, AuditingRunner } from '../../domain';

@Injectable()
export class AuditingRunnerDisabledImplementationService extends AuditingRunner {
  create(
    auditingMeta: AuditingMeta,
    now: string,
    event: string,
    modelPath: string,
    modelName: string,
    auditableId: string,
    oldValue: any,
    newValue: any,
  ): void {
    //
  }
}
