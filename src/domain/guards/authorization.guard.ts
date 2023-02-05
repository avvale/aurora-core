import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export abstract class AuthorizationGuard implements CanActivate
{
    abstract canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
}
