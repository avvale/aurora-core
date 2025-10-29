import { Sequelize } from 'sequelize';

type AggSpec = {
    as: string;           // resulting alias
    col?: string;         // target column (required if no args)
    fn: string;           // 'count' | 'sum' | 'max' | 'min' | 'avg' | ...
    distinct?: boolean;   // optional: COUNT DISTINCT (or DISTINCT in the first arg)
    args?: Array<
        | string
        | number
        | { col: string }
        | { fn: string; args?: any[] }
    >;                    // optional: for functions with multiple args (COALESCE, etc.)
};

function isAggSpec(x: any): x is AggSpec
{
    return !!x && typeof x === 'object' && 'fn' in x && 'as' in x && (('col' in x) || ('args' in x));
}

function buildExprFromArg(arg: any): any
{
    if (arg == null || typeof arg === 'number' || typeof arg === 'string') return arg;
    if (typeof arg === 'object')
    {
        if ('col' in arg) return Sequelize.col(arg.col);
        if ('fn' in arg)
        {
            const a = (arg.args ?? []).map((z: any) => buildExprFromArg(z));
            return Sequelize.fn(String(arg.fn).toUpperCase(), ...a);
        }
    }
    return arg;
}

function buildAggTuple(spec: AggSpec): any[]
{
    const FN = String(spec.fn).toUpperCase();

    // Build arguments
    let args: any[] = (spec.args ?? []).map(a => buildExprFromArg(a));

    // If there are no arguments and there is a column, use the column as the only argument.
    if (!args.length && spec.col)
    {
        const baseCol = Sequelize.col(spec.col);
        const firstArg = spec.distinct ? Sequelize.fn('DISTINCT', baseCol) : baseCol;
        args = [firstArg];
    }
    else if (args.length && spec.distinct)
    {
        // If there are arguments and they request DISTINCT, we apply it to the FIRST argument if it is a column.
        const first = args[0];
        const wrapped =
            // If it is already a column or a simple expression, we wrap it
            first && typeof first === 'object' && first.constructor?.name !== 'Fn'
                ? Sequelize.fn('DISTINCT', first)
                : Sequelize.fn('DISTINCT', first);
        args[0] = wrapped;
  }

  const expr = Sequelize.fn(FN, ...args);
  return [expr, spec.as];
}

/**
 * Transform attributes:
 * - Array: converts only AggSpec objects to [fn(col/args), 'as'] and leaves strings and tuples ["name","alias"] intact.
 * - Object { include, exclude? }: only processes include.
 */
export function transformAttributes(attributes: any)
{
    // Case: attributes is an array
    if (Array.isArray(attributes))
    {
        return attributes.map(item => (isAggSpec(item) ? buildAggTuple(item) : item));
    }

    // Case: attributes is an object with include
    if (attributes && typeof attributes === 'object' && Array.isArray(attributes.include))
    {
        return {
            ...attributes,
            include: attributes.include.map((item: any) => (isAggSpec(item) ? buildAggTuple(item) : item)),
        };
    }

    // Any other case: return as is
    return attributes;
}