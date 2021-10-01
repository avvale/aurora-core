import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@Scalar('Upload', type => Upload)
export class Upload implements CustomScalar<any, any>
{
    description = 'Upload custom scalar type';

    parseValue(value: any): any
    {
        return GraphQLUpload.parseValue(value);
    }

    serialize(value: any): any
    {
        return GraphQLUpload.serialize(value);
    }

    parseLiteral(ast: any): any
    {
        return GraphQLUpload.parseLiteral(ast, null);
    }
}