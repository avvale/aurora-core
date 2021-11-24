import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ConstraintOptions
{
    i18N: string;
}

export const Constraint = createParamDecorator(
    (data: ConstraintOptions, context: ExecutionContext) =>
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

        // get body constraint
        return request.body['constraint'];
    }
);