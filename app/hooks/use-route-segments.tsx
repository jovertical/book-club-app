import { useMemo } from 'react';
import { useLocation } from 'react-router';

export function useRouteSegments(basePath: string) {
  const location = useLocation();

  const segments = useMemo(
    () => location.pathname.replace(basePath, '').split('/').filter(Boolean),
    [location.pathname, basePath],
  );

  return segments;
}
