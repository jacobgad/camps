type GetFilteredListProps<T> = {
  list: T[];
  search: string;
  getSearchableFields: (item: T) => string[];
};

export function getFilteredList<T>({
  search,
  list,
  getSearchableFields,
}: GetFilteredListProps<T>) {
  const keywords = search
    .toLocaleLowerCase()
    .split(" ")
    .filter((s) => s !== "");

  if (keywords.length === 0) return list;

  return list.filter((item) => {
    const words = getSearchableFields(item)
      .join(" ")
      .toLocaleLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.startsWith(kw)));
  });
}
