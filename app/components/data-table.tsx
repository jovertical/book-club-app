import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table-toolbar';
import { Skeleton } from '@/components/ui/skeleton';
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
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
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
import { useVirtualizer } from '@tanstack/react-virtual';
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  rowKey?: keyof TData;
  estimatedRowHeight: number;
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
  estimatedRowHeight,
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

  const [cursor, setCursor] = useState<number>(0);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = useState<SortingState>(
    initialSorting ? [initialSorting] : [],
  );

  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    DatatableFetchResult<TData>
  >({
    queryKey: [fetchKey, cursor, sorting, globalFilter, columnFilters],
    queryFn: async () => {
      return await fetchFnAction({
        cursor,
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
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.total ?? 0;
  const totalFetched = flatData.length;

  // Called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerReferenceElement?: HTMLDivElement | null) => {
      if (!containerReferenceElement) return;

      const { scrollHeight, scrollTop, clientHeight } =
        containerReferenceElement;

      // Once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
      if (
        scrollHeight - scrollTop - clientHeight < 500 &&
        !isFetching &&
        totalFetched < totalDBRowCount
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      globalFilter,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

    if (table.getRowModel().rows.length > 0) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  // Since this table option is derived from table row model state,
  // we're using the table.setOptions utility
  table.setOptions((previous) => ({
    ...previous,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const firstRow = rows[0];

  useEffect(() => {
    if (rows.length > 0) {
      console.log(rows);
    }
  }, [rows.length]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => estimatedRowHeight, // Estimate row height for accurate scrollbar dragging
    getScrollElement: () => containerRef.current,
    // Measure dynamic row height, except in firefox because it measures table border height incorrectly:
    measureElement: navigator.userAgent.includes('Firefox')
      ? undefined
      : (element) => element?.getBoundingClientRect().height,
    overscan: 5,
  });

  if (isLoading) {
    return <div className="text-sm text-opacity-80">Loading...</div>;
  }

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
        className="overflow-auto relative no-scrollbar"
        onScroll={(event) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement)
        }
        style={{
          // Set's the component's height to a fixed height without considering
          // the page's height after scroll (the actual behavior when for example with `h-screen` or `h-full`)
          height: window.innerHeight - 220,
        }}
      >
        <Table className="grid">
          <TableHeader className="grid sticky top-0 z-10">
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

          <TableBody
            className="grid relative"
            style={{
              height: `${rowVirtualizer.getTotalSize() + (isFetching ? estimatedRowHeight : 0)}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];

              return (
                <TableRow
                  key={(rowKey ? row.original[rowKey] : row.id) as string}
                  data-index={virtualRow.index} // Needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} // Measure dynamic row height
                  className="flex absolute w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, // This should always be a `style` as it changes on scroll
                  }}
                  // data-state={row.getIsSelected() && "selected"}
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

            {isFetching && (
              <TableRow
                key={`fetch-more-row`}
                className="flex absolute bottom-0 inset-x-0 w-full"
                style={{ height: `${estimatedRowHeight}px` }}
              >
                {firstRow?.getVisibleCells().map((cell, cellIndex) => {
                  const { meta = {} } = cell.column.columnDef || {};

                  const cellUiType = (
                    'cellUiType' in meta ? meta.cellUiType : undefined
                  ) as string;

                  return (
                    <TableCell
                      key={`fetch-more-cell-${cellIndex}`}
                      className="flex items-center"
                      style={{ width: cell.column.getSize() }}
                    >
                      {cellUiType === 'checkbox' ? (
                        <Skeleton className="h-4 w-4 rounded-sm" />
                      ) : cellUiType === 'resourceWithImage' ? (
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-[120px]" />
                            <Skeleton className="h-2.5 w-[200px]" />
                          </div>
                        </div>
                      ) : (
                        <Skeleton className="h-3.5 w-3/4" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
