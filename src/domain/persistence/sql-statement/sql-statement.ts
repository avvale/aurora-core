import { IndexHints } from './index-hints';

export type Any = any;

export interface IndexHint
{
    type: IndexHints;
    values: string[];
}

export class QueryStatement
{
    /**
     * SQL raw, to execute complex queries, the database engine will not be taken into account.
     */
    rawSQL?: string;

    /**
     * specific information required for a ORM. example: {metadata: { type: QueryTypes.SELECT }}
     */
    metadata?: any;

    /**
     * Attribute has to be matched for rows to be selected for the given action.
     */
    where?: any;

    /**
     * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
     * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
     * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
     * have in the returned instance
     */
    attributes?: any;

    /**
     * A list of associations to eagerly load using a left join (a single association is also supported). Supported is either
     * `{ include: Model1 }`, `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
     * `{ include: [{ all: true }]}`.
     * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
     * the as attribute when eager loading Y).
     */
    include?: any;

    /**
     * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
     * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
     * first element is the column / function to order by, the second is the direction. For example:
     * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
     */
    order?: any;

    /**
     * GROUP BY in sql
     */
    group?: any;

    /**
     * Limit the results
     */
    limit?: number;

    /**
     * Skip the results;
     */
    offset?: number;

    /**
     * Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
     * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
     * locks with joins. See [transaction.LOCK for an example](transaction#lock)
     */
    lock?: any;

    /**
     * Skip locked rows. Only supported in Postgres.
     */
    skipLocked?: boolean;

    /**
     * Return raw result. See sequelize.query for more information.
     */
    raw?: boolean;

    /**
     * Select group rows after groups and aggregates are computed.
     */
    having?: any;

    /**
     * Use sub queries (internal)
     */
    subQuery?: boolean;

    /**
     * MySQL only
     */
    indexHints?: IndexHint[];
}