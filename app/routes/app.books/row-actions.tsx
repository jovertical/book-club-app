'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { BookSchema } from '@/schema/book.schema';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { NavLink } from 'react-router';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const newToast = (title: string, message: string, isError?: boolean) => ({
  ...(isError && { variant: 'destructive' as 'default' | 'destructive' }),
  title,
  description: message,
  duration: 3000,
});

export function RowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const book = BookSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
      >
        <DropdownMenuItem asChild>
          <NavLink
            to={`/app/books/${book.id}/edit`}
            className="flex gap-2"
          >
            Edit
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            toast(newToast('Success!', 'The book was deleted.'));
          }}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
