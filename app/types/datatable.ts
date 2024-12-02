export interface DatatableFetchResult<TData> {
  data: TData[];
  meta: {
    total: number;
  };
}

export type DatatableFetchFn<
  TData,
  TFilters extends Record<string, string> = Record<string, string>,
> = (options: {
  cursor: number;
  size: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  filters?: TFilters;
}) => Promise<DatatableFetchResult<TData>>;

export interface DatatableFacetedFilter {
  id: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
