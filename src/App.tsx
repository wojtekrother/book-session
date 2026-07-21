import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './features/dashboard/Home.tsx';
import Root from './features/dashboard/Layout.tsx';
import MyEventsPage from './features/user/MyEvents.tsx';
import LoginPage from './features/user/Login_v2.tsx';
import EventDetailsPage from './features/event/details/EventDetails.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventsListPage from './features/event/list/EventsListPage.tsx';
import RegisterPage from './features/user/Register.tsx';
import Loggout from './shared/components/ui/Logout.tsx';
import { useEffect } from 'react';
import { supabase } from './services/api/supabase.ts';
import { userKeys as userKeys } from './services/api/UserApiQuery.ts';


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'events', element: <EventsListPage />, },
      { path: 'events/:id', element: <EventDetailsPage /> },
      { path: 'user/events', element: <MyEventsPage /> },
      { path: 'user/register', element: <RegisterPage /> },
      { path: 'user/login', element: <LoginPage /> },
      { path: 'user/logout', element: <Loggout /> },
    ],
  },
]);

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000
    }
  }
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
    import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (!session) {
        queryClient.setQueryData(userKeys.loggedIn, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Router} />
    </QueryClientProvider>
  );
}

export default App;


