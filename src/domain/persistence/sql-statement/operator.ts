export enum Operator
{
    // concatenation
    and = '[and]',                          // (a = 5) AND (b = 6)
    or = '[or]',                            // (a = 5) OR (b = 6)

    // utils
    col = '[col]',                          // = "user"."organization_id" (PG example) or "user.organization_id" (MySQL example)
    join = '[join]',

    // Basics
    startsWith = '[startsWith]',            // LIKE 'hat%'
    endsWith = '[endsWith]',                // LIKE '%hat'
    substring = '[substring]',              // LIKE '%hat%'
    not = '[not]',                          // IS NOT TRUE
    is = '[is]',                            // IS NULL
    in = '[in]',                            // IN [1, 2]
    notIn = '[notIn]',                      // NOT IN [1, 2]

    // comparisons
    eq = '[eq]',                            // = 3
    ne = '[ne]',                            // != 20
    gte = '[gte]',                          // >= 6
    gt = '[gt]',                            // > 6
    lte = '[lte]',                          // <= 10
    lt = '[lt]',                            // < 10

    // Other operators
    between = '[between]',                  // BETWEEN 6 AND 10
    notBetween = '[notBetween]',            // NOT BETWEEN 11 AND 15
    like = '[like]',                        // LIKE '%hat'
    notLike = '[notLike]',                  // NOT LIKE '%hat'
    regexp = '[regexp]',                    // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
    notRegexp = '[notRegexp]',              // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
    all = '[all]',                          // > ALL (SELECT 1)

    // Other operators
    values = '[values]',
    placeholder = '[placeholder]',

    // Other operators (Only PG)
    iLike = '[iLike]',                      // ILIKE '%hat' (case insensitive) (PG only)
    notILike = '[notILike]',                // NOT ILIKE '%hat'  (PG only)
    iRegexp = '[iRegexp]',                  // ~* '^[h|a|t]' (PG only)
    notIRegexp = '[notIRegexp]',            // !~* '^[h|a|t]' (PG only)
    overlap = '[overlap]',                  // && [1, 2) (PG range overlap (have points in common) operator)
    contains = '[contains]',                // @> '2'::integer  (PG range contains element operator) or @> [1, 2] (PG range contains range operator)
    contained = '[contained]',              // <@ [1, 2]        (PG range is contained by operator)
    adjacent = '[adjacent]',                // -|- [1, 2]       (PG range is adjacent to operator)
    strictLeft = '[strictLeft]',            // << [1, 2]        (PG range strictly left of operator)
    strictRight = '[strictRight]',          // >> [1, 2)        (PG range strictly right of operator)
    noExtendRight = '[noExtendRight]',      // &< [1, 2)        (PG range does not extend to the right of operator)
    noExtendLeft = '[noExtendLeft]',        // &> [1, 2)        (PG range does not extend to the left of operator)
    any = '[any]',                          // ANY ARRAY[2, 3]::INTEGER (PG only)
}