import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('Upload', (type) => UploadScalar)
export class UploadScalar implements CustomScalar<any, any> {
  description = 'Upload custom scalar type';

  async parseValue(value: any): Promise<any> {
    const GraphQLUpload = await this.importGraphQLUpload();
    return GraphQLUpload.parseValue(value);
  }

  async serialize(value: any): Promise<any> {
    const GraphQLUpload = await this.importGraphQLUpload();
    return GraphQLUpload.serialize(value);
  }

  async parseLiteral(ast: any): Promise<any> {
    const GraphQLUpload = await this.importGraphQLUpload();
    return GraphQLUpload.parseLiteral(ast, null);
  }

  private async importGraphQLUpload(): Promise<
    typeof import('graphql-upload/GraphQLUpload.mjs')
  > {
    const { default: GraphQLUpload } = await (eval(
      "import('graphql-upload/GraphQLUpload.mjs')",
    ) as Promise<typeof import('graphql-upload/GraphQLUpload.mjs')>);

    return GraphQLUpload;
  }
}
