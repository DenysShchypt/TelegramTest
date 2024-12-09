import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from '../AppBar/AppBar';

const Layout: FC = () => {
  return (
    <div>
      <AppBar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
