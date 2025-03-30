export const getBasicAuth = (
    username: string,
    password: string,
): string =>
{
    return 'Basic ' + Buffer
        .from(`${username}:${password}`)
        .toString('base64');
};