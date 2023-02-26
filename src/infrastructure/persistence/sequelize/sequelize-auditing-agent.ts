import { BadRequestException, Logger } from '@nestjs/common';
import { AuditingMeta, AuditingSideEffectEvent, Utils } from '../../../domain';
import * as _ from 'lodash';

export class SequelizeAuditingAgent
{
    public static registerSideEffect(
        instance : any,
        options  : any,
        event    : AuditingSideEffectEvent,
        modelPath: string,
        modelName: string,
    ): void
    {
        const auditingMeta: AuditingMeta = options.auditing;

        if (!auditingMeta)
        {
            Logger.log(`Event ${event} of ${modelName} model, is not audited`);
            return;
        }

        let dataValues;
        let previousDataValues;

        // upsert return a array instances, but sequelize only allows upsert one record
        if (
            event === AuditingSideEffectEvent.UPSERTED &&
            Array.isArray(instance) &&
            instance.length > 0
        ) instance = instance[0];

        // manage instance data
        if (
            event === AuditingSideEffectEvent.CREATED ||
            event === AuditingSideEffectEvent.UPDATED ||
            event === AuditingSideEffectEvent.DELETED ||
            event === AuditingSideEffectEvent.RESTORED ||
            event === AuditingSideEffectEvent.UPSERTED
        )
        {
            if (
                !('dataValues' in instance) ||
                !('_previousDataValues' in instance)
            )
                throw new BadRequestException(`The instance for hook with event ${event} ane model ${modelName} does not defined.`);

            dataValues         = _.omit(instance.dataValues, ['createdAt', 'updatedAt', 'deletedAt']);
            previousDataValues = _.omit(instance._previousDataValues, ['createdAt', 'updatedAt', 'deletedAt']);
        }

        if (
            event === AuditingSideEffectEvent.BULK_CREATED
        )
        {
            if (
                Array.isArray(instance) &&
                instance.length > 0 &&
                !('dataValues' in instance[0]) ||
                !('_previousDataValues' in instance[0])
            )
                throw new BadRequestException(`The instance for hook with event ${event} ane model ${modelName} does not defined.`);

            dataValues         = instance.map(item => _.omit(item.dataValues, ['createdAt', 'updatedAt', 'deletedAt']));
            previousDataValues = instance.map(item => _.omit(instance._previousDataValues, ['createdAt', 'updatedAt', 'deletedAt']));
        }

        const now                        = Utils.nowTimestamp();
        let oldValue: any                = {};
        let newValue: any                = {};
        let auditableId;

        switch (event)
        {
            case AuditingSideEffectEvent.CREATED:
                newValue = dataValues;
                auditableId = dataValues.id;
                break;

            case AuditingSideEffectEvent.BULK_CREATED:
                newValue = dataValues;
                break;

            case AuditingSideEffectEvent.UPDATED:
                newValue = Utils.diff(SequelizeAuditingAgent.parseObject(dataValues), SequelizeAuditingAgent.parseObject(previousDataValues));
                oldValue = Utils.diff(SequelizeAuditingAgent.parseObject(previousDataValues), SequelizeAuditingAgent.parseObject(dataValues));
                auditableId = dataValues.id;
                break;

            case AuditingSideEffectEvent.DELETED:
                oldValue = dataValues;
                auditableId = dataValues.id;
                break;
        }

        // execute auditing runner
        auditingMeta.auditingRunner.create(
            auditingMeta,
            now,
            event,
            modelPath,
            modelName,
            auditableId,
            oldValue,
            newValue,
        );
    }

    private static parseObject(object: any): any
    {
        return JSON.parse(JSON.stringify(object));
    }
}