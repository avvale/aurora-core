import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Any')
export class Any implements CustomScalar<any, any>
{
    description = 'Any custom scalar type';

    parseValue(value: any): any
    {
        return value;
    }

    serialize(value: any): any
    {
        return value;
    }

    parseLiteral(ast: ValueNode): any
    {
        if (ast.kind === Kind.INT) return <number><unknown>ast.value;

        if (ast.kind === Kind.FLOAT) return <number><unknown>ast.value;

        if (ast.kind === Kind.STRING) return <string><unknown>ast.value;

        if (ast.kind === Kind.BOOLEAN) return <boolean><unknown>ast.value;

        return null;
    }
}