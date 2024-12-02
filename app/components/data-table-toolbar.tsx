import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DatatableFacetedFilter } from '@/types/datatable';
import { Table } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilterEnabled?: boolean;
  globalFilterPlaceholder?: string;
  filters?: DatatableFacetedFilter[];
}

export function DataTableToolbar<TData>({
  table,
  globalFilterEnabled = false,
  globalFilterPlaceholder = 'Search...',
  filters: rawFilters = [],
}: DataTableToolbarProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState<string>(
    table.getState().globalFilter ?? '',
  );

  const isFiltered = table.getState().columnFilters.length > 0;

  const filters = rawFilters.filter((filter) => table.getColumn(filter.id));

  const debouncedGlobalFilter = useDebounce(globalFilter, 400);

  useEffect(() => {
    table.setGlobalFilter(debouncedGlobalFilter);
  }, [debouncedGlobalFilter]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {globalFilterEnabled && (
          <Input
            className="h-8 w-[150px] lg:w-[250px]"
            placeholder={globalFilterPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
          />
        )}

        {filters.map((filter) => (
          <DataTableFacetedFilter
            key={filter.id}
            column={table.getColumn(filter.id)}
            title={filter.title}
            options={filter.options}
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
