type GroupedItems<T> = { [key: string]: T[] };

export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
): GroupedItems<T> {
  const groupedItems: GroupedItems<T> = {};
  items.forEach((item) => {
    const key = getKey(item);
    const array = groupedItems[key];
    array ? array.push(item) : (groupedItems[key] = [item]);
  });
  return groupedItems;
}
