import { RowActions } from './row-actions';
import { Badge } from '@/components/ui/badge';
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
    size: 300,
  },
  {
    id: 'author',
    header: 'Author',
    cell: ({ row }) => toTitleCase(row.original.author?.name ?? '') ?? '---',
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'genres',
    header: 'Genres',
    cell: ({ row }) => (
      <div className="flex justify-start gap-1.5 flex-wrap">
        {row.original.genres?.map((genre, genreIdx) => (
          <Badge
            key={genreIdx}
            variant="outline"
            className="px-2 h-7"
          >
            {genre.name}
          </Badge>
        ))}
      </div>
    ),
    size: 300,
    enableSorting: false,
    enableHiding: false,
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
