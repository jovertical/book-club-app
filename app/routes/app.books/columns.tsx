import { RowActions } from './row-actions';
import { toTitleCase } from '@/lib/utils/string';
import { Book } from '@/schema/book.schema';
import { ColumnDef } from '@tanstack/react-table';
import { format as formatDate } from 'date-fns';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => toTitleCase(row.getValue('title')) ?? '---',
    enableSorting: true,
    enableHiding: false,
    size: 200,
  },
  {
    accessorKey: 'info',
    header: 'Info',
    enableSorting: false,
    enableHiding: false,
    size: 350,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt'), 'PPpp'),
    size: 200,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} />,
  },
];
