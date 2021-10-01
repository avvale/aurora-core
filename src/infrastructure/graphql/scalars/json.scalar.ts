import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';

@Scalar('JSON')
export class Json implements CustomScalar<any, any>
{
    description = 'Any custom scalar type';

    serialize(value: any): Object
    {
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    }

    parseValue(value: any): Object
    {
        return value;
    }

    parseLiteral(ast: ValueNode): Object
    {
        return <Object><unknown>ast['value'];
    }
}