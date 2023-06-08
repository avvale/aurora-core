export abstract class CoreGetFallbackLangService
{
    abstract get<T = any>(): Promise<T[]>;
    abstract reset(): Promise<void>;
}