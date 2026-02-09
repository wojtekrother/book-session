import { Outlet } from 'react-router-dom';
import Header from '../../components/ui/Header';

export default function Root() {
  return (
    <>

      <div className='w-3xl mx-auto bg-blue-50'>
        <Header />
        <div className="m-1 pb-20">
          <Outlet />
        </div>
      </div>
    </>
  );
}
