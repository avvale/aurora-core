// get all nested elements related by parentId
export const getNestedObjectsFromParentId = <T extends { id: string; parentId: string; } = any>(data: T[], parentId: string): T[] =>
{
    let children = [];
    for (let i = 0; i < data.length; i++)
    {
        if (data[i].parentId === parentId)
        {
            children.push(data[i]);
            children = children.concat(getNestedObjectsFromParentId(data, data[i].id));
        }
    }
    return children;
};