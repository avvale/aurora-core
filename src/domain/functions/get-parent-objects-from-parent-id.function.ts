// get all nested elements related by parentId
export const getParentObjectsFromParentId = <
  T extends { id: string; parentId: string } = any,
>(
  data: T[],
  id: string,
): T[] => {
  const object = data.find((obj) => obj.id === id);

  if (!object) return [];
  if (!object.parentId) return [object];

  return [object, ...getParentObjectsFromParentId(data, object.parentId)];
};
