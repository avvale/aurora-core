import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAccount = createParamDecorator(
    (data: unknown, context: ExecutionContext) =>
    {
        if (context['contextType'] === 'graphql')
        {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req.user;
        }
        else if (context['contextType'] === 'http')
        {
            return context.switchToHttp().getRequest().user;
        }
    }
);