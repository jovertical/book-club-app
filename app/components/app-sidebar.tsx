import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, BookUser, Book, Tags } from 'lucide-react';
import { NavLink } from 'react-router';

export function AppSidebar() {
  const items = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      title: 'Authors',
      href: '/authors',
      icon: BookUser,
    },
    {
      title: 'Books',
      href: '/books',
      icon: Book,
    },
    {
      title: 'Genres',
      href: '/genres',
      icon: Tags,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader></SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Better Reads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div>
                      <NavLink
                        to={`/app${item.href}`}
                        className="flex justify-center items-center gap-2"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="whitespace-nowrap">{item.title}</span>
                      </NavLink>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: 'John Doe',
            email: 'john.doe+x4@example.com',
            picture:
              'https://s.gravatar.com/avatar/3445ab1c48ac97979c14550e54f557e9?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjd.png',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
