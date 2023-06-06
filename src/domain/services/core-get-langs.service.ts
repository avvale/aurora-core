export abstract class CoreGetLangsService
{
    abstract get<T = any>(): Promise<T>;
}