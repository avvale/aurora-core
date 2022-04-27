import { CQMetadata, QueryStatement } from '../../..';

export class OAuthFindAccessTokenByIdQuery
{
    constructor(
        public readonly id: string,
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}