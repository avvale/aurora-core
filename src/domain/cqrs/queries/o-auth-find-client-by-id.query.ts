import { CQMetadata, QueryStatement } from '../../..';

export class OAuthFindClientByIdQuery
{
    constructor(
        public readonly id: string,
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}