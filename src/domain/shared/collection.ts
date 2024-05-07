export const collection = <T = any>(items: T[]): Collection<T> => new Collection<T>(items);

class Collection<T>
{
    private _items: Set<T>;

    constructor(items: T[])
    {
        this._items = new Set(items);
    }

    items(): Set<T>
    {
        return this._items;
    }

    deleteItems(items: T[], confirm: () => boolean = () => true): this
    {
        if (!confirm()) return this;

        items.forEach(value => this._items.delete(value));
        return this;
    }

    delete(item: T, confirm: () => boolean = () => true): this
    {
        if (!confirm()) return this;

        this._items.delete(item);
        return this;
    }

    toArray(): T[]
    {
        return Array.from(this._items);
    }

    has(item: T): boolean
    {
        return this._items.has(item);
    }

    addItems(items: T[], confirm: () => boolean = () => true): this
    {
        if (!confirm()) return this;

        items.forEach(value => this._items.add(value));
        return this;
    }

    add(item: T, confirm: () => boolean = () => true): this
    {
        if (!confirm()) return this;

        this._items.add(item);
        return this;
    }

    clear(confirm: () => boolean = () => true): this
    {
        if (!confirm()) return this;

        this._items.clear();
        return this;
    }

    values(): IterableIterator<T>
    {
        return this._items.values();
    }

    entries(): IterableIterator<[T, T]>
    {
        return this._items.entries();
    }
}