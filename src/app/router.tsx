import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { Spinner } from '@/components/ui/Spinner';
import { RequireMembership } from '@/features/admin/RequireMembership';
import { HomePage } from '@/routes/HomePage';
import { NotFoundPage } from '@/routes/NotFoundPage';

// The admin bundle only matters to a handful of members; keep it off the
// critical path for everyone else.
const AdminPage = lazy(() =>
  import('@/routes/AdminPage').then((module) => ({ default: module.AdminPage })),
);
const LoginPage = lazy(() =>
  import('@/routes/LoginPage').then((module) => ({ default: module.LoginPage })),
);

function RouteFallback() {
  return (
    <div className="container flex justify-center py-32">
      <Spinner className="text-accent size-7" />
    </div>
  );
}

const deferred = (element: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events', element: <Navigate to="/#events" replace /> },
      { path: 'research', element: <Navigate to="/#research" replace /> },
      { path: 'projects', element: <Navigate to="/#projects" replace /> },
      { path: 'members', element: <Navigate to="/#members" replace /> },
      { path: 'login', element: deferred(<LoginPage />) },
      {
        element: <RequireMembership />,
        children: [{ path: 'admin', element: deferred(<AdminPage />) }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
