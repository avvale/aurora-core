import { Scalar, CustomScalar } from '@nestjs/graphql';
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
// const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs');

@Scalar('Upload', type => UploadScalar)
export class UploadScalar implements CustomScalar<any, any>
{
    description = 'Upload custom scalar type';

    parseValue(value: any): any
    {

        return; //GraphQLUpload.parseValue(value);
    }

    serialize(value: any): any
    {
        return; // GraphQLUpload.serialize(value);
    }

    parseLiteral(ast: any): any
    {
        return; // GraphQLUpload.parseLiteral(ast, null);
    }
}