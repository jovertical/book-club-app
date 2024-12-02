'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useRouteSegments } from '@/hooks/use-route-segments';
import { toTitleCase } from '@/lib/utils/string';
import React from 'react';
import { NavLink } from 'react-router';

export const AppBreadcrumbs = () => {
  const segments = useRouteSegments('/app');

  const linkSegments = segments.map((segment, index) => ({
    title: toTitleCase(segment),
    path: '/app/' + segments.slice(0, index + 1).join('/'),
    isActive: index === segments.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {linkSegments.map((segment) => (
          <React.Fragment key={segment.path}>
            <BreadcrumbItem className="hidden md:block">
              <NavLink to={segment.path}>
                <BreadcrumbLink asChild>
                  {segment.isActive ? (
                    <BreadcrumbPage>{segment.title}</BreadcrumbPage>
                  ) : (
                    segment.title
                  )}
                </BreadcrumbLink>
              </NavLink>
            </BreadcrumbItem>

            {!segment.isActive && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
