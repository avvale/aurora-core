export abstract class CoreGetLangsService
{
    abstract get<T = any>(): Promise<T[]>;
    abstract reset(): Promise<void>;
}