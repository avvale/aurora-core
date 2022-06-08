import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// normally user is implements for @apps/o-auth/shared/strategies/jwt.strategy.ts in validate method
export const CurrentAccount = createParamDecorator(
    (data: { accountContainer: string; } = { accountContainer: 'user' }, context: ExecutionContext) =>
    {
        if (context['contextType'] === 'graphql')
        {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req[data.accountContainer];
        }
        else if (context['contextType'] === 'http')
        {
            return context.switchToHttp().getRequest()[data.accountContainer];
        }
    },
);