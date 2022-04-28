import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OAuthFindClientByIdQuery } from '../../domain/cqrs/queries/o-auth-find-client-by-id.query';
import { clients } from '../../domain/persistence/seeds/o-auth-client.seed';

@QueryHandler(OAuthFindClientByIdQuery)
export class OAuthFindClientByIdQueryHandler implements IQueryHandler<OAuthFindClientByIdQuery>
{
    execute(query: OAuthFindClientByIdQuery): any
    {
        return clients.find(client => client.id === query.id);
    }
}