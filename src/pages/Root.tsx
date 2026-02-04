import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function Root() {
  return (
    <>

      <div className='w-3xl mx-auto bg-blue-50'>
        <Header />
        <div className="m-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}
