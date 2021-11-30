declare interface Array<T>
{
    removeItem(value: T): Array<T>;
}

Array.prototype.removeItem = function <T>(value: T): Array<T>
{
    const index = this.indexOf(value);
    if (index > -1) this.splice(index, 1);

    return this;
};