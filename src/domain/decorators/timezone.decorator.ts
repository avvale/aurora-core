import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Timezone = createParamDecorator(
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

        return request.header('X-Timezone') ? request.header('X-Timezone') : process.env.TZ;
    }
);