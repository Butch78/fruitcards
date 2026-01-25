interface TableQueryOptions<T extends object> {
  data: T[];
  query: Record<string, string | string[] | undefined>;
  searchableFields?: (keyof T)[];
  customFilter?: (item: T, search: string) => boolean;
}

export function handleTableQuery<T extends object>({ data, query, searchableFields, customFilter }: TableQueryOptions<T>) {
  const page = parseInt(query.page as string || '1');
  const pageSize = parseInt(query.pageSize as string || '10');
  const search = (query.search as string || '').toLowerCase();
  const sortBy = query.sortBy as keyof T || '';
  const sortDir = query.sortDir === 'desc' ? 'desc' : 'asc';

  let result: T[] = data;

  // Apply custom filter first (if provided)
  if (customFilter) {
    result = result.filter((item) => customFilter(item, search));
  }

  // Then apply search filter (if search is present)
  if (search && searchableFields && searchableFields.length > 0) {
    result = result.filter((item) =>
      searchableFields.some((field) => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(search);
      })
    );
  }

  if (sortBy && result.length > 0 && sortBy in result[0]) {
    result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDir === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (sortDir === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;
  const paginatedData = result.slice(offset, offset + pageSize);

  return {
    data: paginatedData,
    total: totalItems,
    page: page,
    pageSize,
    totalPages,
  };
}
