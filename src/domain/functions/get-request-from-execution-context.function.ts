import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const getRequestFromExecutionContext = <T = any>(context: ExecutionContext): T =>
{
    if (context['contextType'] === 'graphql')
    {
        return GqlExecutionContext.create(context).getContext().req;
    }
    else if (context['contextType'] === 'http')
    {
        return context.switchToHttp().getRequest();
    }
};