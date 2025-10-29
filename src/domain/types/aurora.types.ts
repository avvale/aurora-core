import { QueryStatement } from '../persistence/sql-statement/sql-statement';
import { AuditingRunner } from '../persistence/auditing-runner';

export interface AuditingAccount
{
    id: string;
    email: string;
}

export interface AuditingMeta<T extends AuditingAccount = AuditingAccount>
{
    ip?: string;
    auditingRunner?: AuditingRunner;
    userAgent?: string;
    method?: string;
    baseUrl?: string;
    params?: { [key: string]: any; };
    query?: { [key: string]: any; };
    body?: { [key: string]: any; };
    account: T;
    operationId?: string;
    operationSort?: number;
    tags?: string[] | ((oldValue: any, newValue: any, auditingMeta: AuditingMeta) => string[]);
    // property to define the id that the side effect will be created,
    // used to define the id in the rollback action and related to the
    // affected side effects
    id?: string;
}

export enum AuditingSideEffectEvent
{
    CREATED = 'CREATED',
    BULK_CREATED = 'BULK_CREATED',
    UPDATED = 'UPDATED',
    BULK_UPDATED = 'BULK_UPDATED',
    DELETED = 'DELETED',
    BULK_DELETED = 'BULK_DELETED',
    RESTORED = 'RESTORED',
    BULK_RESTORED = 'BULK_RESTORED',
    UPSERTED = 'UPSERTED'
}

export enum CoreSearchKeyLang
{
    ID = 'id',
    IETF = 'ietf',
    ISO6392 = 'iso6392',
    ISO6393 = 'iso6393',
}

export interface CQMetadata
{
    timezone?: string;
    repositoryOptions?: LiteralObject;
    meta?: LiteralObject;
    excludeMapModelToAggregate?: boolean;
}

export interface DataValueObject
{
    addTimezone?: string;
    currentDate?: boolean;
    currentTimestamp?: boolean;
    haveToDecrypt?: boolean;
    haveToEncrypt?: boolean;
    removeTimezone?: string;
}

export interface HookResponse
{
    queryStatement?: QueryStatement;
    cQMetadata?: CQMetadata;
}

export interface Jwt
{
    jit: string;            // id from this token
    aci: string;            // account id
    iss: string;            // name to identify who belong this token
    iat: number;            // timestamp when this token was issued
    nbf: number;            // token accepted not before this timestamp
    exp: number|null;       // timestamp when expired this token
    scopes?: string;        // scope that belong client
}

export interface LiteralObject
{
    [key: string]: any;
}

export interface MapperOptions
{
    eagerLoading: boolean;
}

export enum PromiseSettledResultStatus
{
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected',
}

export interface SeederBoundedContext
{
    id: string;
    name: string;
    root: string;
    sort: number;
    isActive: boolean;
}

export interface SeederPermission
{
    id: string;
    name: string;
    boundedContextId: string;
    roleIds?: string[];
}

export interface ValidationRules
{
    name?: string;
    nullable?: boolean;
    undefinable?: boolean;
    length?:number;
    minLength?: number;
    maxLength?: number;
    enumOptions?: string[];
    decimals?: number[];
    unsigned?: boolean;
    default?: any;
}