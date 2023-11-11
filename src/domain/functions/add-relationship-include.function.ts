import { QueryStatement } from '..';

export const addRelationshipInclude = (
    query: QueryStatement,
    relationship: string,
): QueryStatement =>
{
    query.include = [
        ...(query.include ? query.include : []),
        {
            association: relationship,
            required   : true,
        },
    ];

    return query;
};
