import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './features/dashboard/Home.tsx';
import EventsListPage from './features/event/EventDetails.tsx';
import EventsListPage from './features/event/EventsList.tsx';
import Root from './features/dashboard/Layout.tsx';
import EventProvider from './context/EventContext.tsx';
import UserContextProvider from './context/UserContext.tsx';
import LoginPage from './pages/Login.tsx';
import Loggout from './components/ui/Logout.tsx';
import MyEventsPage from './features/user/MyEvents.tsx';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'events', element: <EventsListPage /> },
      { path: 'events/:id', element: <EventsListPage /> },
      { path: 'user/events', element: <MyEventsPage /> },
      { path: 'user/login', element: <LoginPage /> },
      { path: 'user/logout', element : <Loggout/>},
    ],
  },
]);

function App() {
  return (
    <UserContextProvider>
      <EventProvider >
        <RouterProvider router={Router} />
      </EventProvider>
    </UserContextProvider>
  );
}

export default App;


