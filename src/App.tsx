import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './features/dashboard/Home.tsx';
import Root from './features/dashboard/Layout.tsx';
import UserContextProvider from './context/old/UserContext.old.tsx';
import Loggout from './components/ui/Logout.tsx';
import MyEventsPage from './features/user/MyEvents.tsx';
import LoginPage from './features/user/Login.tsx';
import EventDetailsPage from './features/event/details/EventDetails.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventsListPage from './features/event/list/EventsListPage.tsx';


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'events', element: <EventsListPage />,  },
      { path: 'events/:id', element: <EventDetailsPage /> },
      { path: 'user/events', element: <MyEventsPage /> },
      { path: 'user/login', element: <LoginPage /> },
      { path: 'user/logout', element: <Loggout /> },
    ],
  },
]);

// Create a client
export const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        {/* <EventProvider > */}
          <RouterProvider router={Router} />
        {/* </EventProvider> */}
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;


