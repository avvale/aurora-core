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
        let constraint = request.body['constraint'];

        if (data?.i18N) constraint = Object.assign({}, constraint, { include: { association: data.i18N, required: true, where: { langId: '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a' }}});

        return constraint;
    }
);