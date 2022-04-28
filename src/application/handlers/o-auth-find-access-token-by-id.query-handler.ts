import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OAuthFindAccessTokenByIdQuery } from '../../domain/cqrs/queries/o-auth-find-access-token-by-id.query';
import { accessTokens } from '../../domain/persistence/seeds/o-auth-access-token.seed';

@QueryHandler(OAuthFindAccessTokenByIdQuery)
export class OAuthFindAccessTokenByIdQueryHandler implements IQueryHandler<OAuthFindAccessTokenByIdQuery>
{
    execute(query: OAuthFindAccessTokenByIdQuery): any
    {
        return accessTokens.find(account => account.id === query.id);
    }
}