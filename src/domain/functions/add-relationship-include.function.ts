import { QueryStatement } from '..';

export const addRelationshipInclude = (
    query: QueryStatement,
    tenantRelationship: string,
): QueryStatement =>
{
    query.include = [
        ...(query.include ? query.include : []),
        {
            association: tenantRelationship,
            required   : true,
        },
    ];

    return query;
};
