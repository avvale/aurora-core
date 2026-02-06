import { QueryStatement } from '../persistence';
import { CQMetadata } from '../types';

export abstract class ICriteria {
  abstract implements(
    queryStatement?: QueryStatement,
    cQMetadata?: CQMetadata,
  ): QueryStatement;

  abstract mergeQueryConstraintStatement(
    query: QueryStatement,
    constraint: QueryStatement,
  ): QueryStatement;
}
