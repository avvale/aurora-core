export const isValidJson = (json: string): boolean =>
{
    try
    {
        JSON.parse(json);
        return true;
    }
    catch (e)
    {
        return false;
    }
};
