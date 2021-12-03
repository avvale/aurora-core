import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Constraint = createParamDecorator(
    (data: unknown, context: ExecutionContext) =>
    {
        let request;

        if (context['contextType'] === 'graphql')
        {
            request = GqlExecutionContext.create(context).getContext().req;
        }
        else if (context['contextType'] === 'http')
        {
            request = context.switchToHttp().getRequest();
        }

        return request.body['constraint'];
    }
);