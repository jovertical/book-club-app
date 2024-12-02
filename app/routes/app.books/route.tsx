import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as api from '@/lib/api';
import { Book } from '@/schema/book.schema';
import { DatatableFetchFn } from '@/types/datatable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'Book Club | Books' },
    { name: 'description', content: 'List of books' },
  ];
}

const getBooks: DatatableFetchFn<Book> = async (options) => {
  const response = await api.get<Book[]>('/books', {
    cursor: options.cursor.toString(),
    size: options.size.toString(),
    ...(options.sort_by && { sort_by: options.sort_by }),
    ...(options.sort_order && { sort_order: options.sort_order }),
  });

  return response;
};

export default function BooksIndex() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="space-y-6 flex-1">
        <div className="container flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center sm:space-y-0 md:h-16">
          <div className="space-y-0.5 w-full md:w-1/2">
            <h2 className="text-2xl font-bold tracking-tight">List of books</h2>
            <p className="text-muted-foreground">Here is a list of all books</p>
          </div>

          <div className="ml-auto flex w-auto space-x-2 sm:justify-end">
            <Button
              size="sm"
              asChild
            >
              <Link to="/app/books/create">
                <Plus /> Add book
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <DataTable
          columns={columns}
          rowKey="id"
          estimatedRowHeight={56}
          fetchKey="users"
          fetchSize={15}
          fetchFnAction={getBooks}
          globalFilterEnabled
          globalFilterPlaceholder="Filter books..."
          // filters={filters}
        />
      </div>
    </QueryClientProvider>
  );
}
