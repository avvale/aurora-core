import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Timezone = createParamDecorator(
    (data: unknown, context: ExecutionContext) =>
    {
        if (context['contextType'] === 'graphql')
        {
            const request = GqlExecutionContext.create(context).getContext().req;
            return request.header('X-Timezone') ? request.header('X-Timezone') : process.env.TZ;
        }
        else if (context['contextType'] === 'http')
        {
            const request = context.switchToHttp().getRequest();
            return request.header('X-Timezone') ? request.header('X-Timezone') : process.env.TZ;
        }
    }
);