import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

export default function Route() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <AppBreadcrumbs />
          </div>
        </header>

        <main className="w-full h-screen md:max-w-7xl p-4 md:p-10 pb-8 md:pb-16">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
