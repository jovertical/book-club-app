import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table-toolbar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { filtersToObject } from '@/lib/utils/datatable';
import {
  DatatableFetchFn,
  DatatableFetchResult,
  DatatableFacetedFilter,
} from '@/types/datatable';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnSort,
  VisibilityState,
  SortingState,
  ColumnFiltersState,
  OnChangeFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useRef, useState, useMemo } from 'react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  rowKey?: keyof TData;
  fetchKey: string;
  fetchFnAction: DatatableFetchFn<TData>;
  fetchSize?: number;
  onRefetch?: () => void;
  initialSorting?: ColumnSort;
  globalFilterEnabled?: boolean;
  globalFilterPlaceholder?: string;
  initialGlobalFilter?: string;
  filters?: DatatableFacetedFilter[];
  initialColumnFilters?: ColumnFiltersState;
  meta?: Record<string, unknown>;
}

export function DataTable<TData, TValue>({
  columns,
  rowKey,
  fetchKey,
  fetchFnAction,
  fetchSize = 10,
  onRefetch,
  initialSorting,
  globalFilterEnabled,
  globalFilterPlaceholder,
  initialGlobalFilter = '',
  filters,
  initialColumnFilters = [],
  meta,
}: DataTableProps<TData, TValue>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = useState<SortingState>(
    initialSorting ? [initialSorting] : [],
  );

  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<DatatableFetchResult<TData>>({
      queryKey: [fetchKey, sorting, globalFilter, columnFilters],
      queryFn: async ({ pageParam = 0 }) => {
        return await fetchFnAction({
          cursor: pageParam as number,
          size: fetchSize,
          ...(sorting.length > 0 && {
            sort_by: sorting[0].id,
            sort_order: sorting[0].desc ? 'desc' : 'asc',
          }),
          ...(globalFilter && { search: globalFilter }),
          filters: filtersToObject(columnFilters, false),
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.meta?.next,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      columnVisibility,
      sorting,
      globalFilter,
      columnFilters,
    },
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    meta: {
      ...meta,
      onRefetch,
    },
  });

  // Scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
  };

  // Since this table option is derived from table row model state,
  // we're using the table.setOptions utility
  table.setOptions((previous) => ({
    ...previous,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        globalFilterEnabled={globalFilterEnabled}
        globalFilterPlaceholder={globalFilterPlaceholder}
        filters={filters}
      />

      <div
        ref={containerRef}
        className="overflow-auto no-scrollbar"
      >
        <Table className="grid">
          <TableHeader className="grid">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="flex w-full"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="flex items-center"
                    style={{ width: header.getSize() }}
                  >
                    {!header.isPlaceholder &&
                      flexRender(
                        typeof header.column.columnDef.header === 'function' ? (
                          header.column.columnDef.header
                        ) : (
                          <DataTableColumnHeader
                            column={header.column}
                            title={header.column.columnDef.header ?? ''}
                          />
                        ),
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="grid">
            {rows.map((row) => {
              return (
                <TableRow
                  key={(rowKey ? row.original[rowKey] : row.id) as string}
                  className="flex w-full"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="flex"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex w-full justify-center py-2.5">
          <Button
            className="text-sm"
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage || isLoading}
          >
            {isLoading
              ? 'Loading...'
              : isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                  ? 'Load More'
                  : 'Nothing more to load'}
          </Button>
        </div>
      </div>
    </div>
  );
}
