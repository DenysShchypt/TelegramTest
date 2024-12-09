import React, { FC } from 'react';
// import { useAppDispatch } from "../utils/hooks/redux-hooks";
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import { PrivateRoute } from '../routes/PrivateRouter';
import { PublicRoute } from '../routes/PublicRoute';

const AuthPage = React.lazy(() => import('../pages/Auth/Auth'));
const HomePage = React.lazy(() => import('../pages/Home/Home'));
const ChatsPage = React.lazy(() => import('../pages/Chats/Chats'));
const ErrorPageComponent = React.lazy(
  () => import('../pages/ErrorPage/ErrorPage')
);
const App: FC = () => {
  // const dispatch = useAppDispatch();
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   // const checkUser = async () => {
  //   //   await dispatch(checkCurrentUser());
  //   setIsLoading(false);
  //   // };

  //   // checkUser();
  // }, [dispatch]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/register"
          element={<PublicRoute redirectTo="/chats" component={<AuthPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute redirectTo="/chats" component={<AuthPage />} />}
        />
        <Route
          path="/chats"
          element={<PrivateRoute component={<ChatsPage />} />}
        />
      </Route>
      <Route path="*" element={<ErrorPageComponent />} />
    </Routes>
  );
};

export default App;
