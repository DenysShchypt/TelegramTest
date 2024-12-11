import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '../utils/hooks/redux-hooks';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import { PrivateRoute } from '../routes/PrivateRouter';
import { PublicRoute } from '../routes/PublicRoute';
import { refreshUser } from '../redux/auth/auth.thunks';
import { useAuth } from '../utils/hooks/useAuth';

const AuthPage = React.lazy(() => import('../pages/Auth/Auth'));
const HomePage = React.lazy(() => import('../pages/Home/Home'));
const ChatsPage = React.lazy(() => import('../pages/Chats/Chats'));
const ChatMessagesPage = React.lazy(
  () => import('../pages/ChatMessages/ChatMessages')
);
const ErrorPageComponent = React.lazy(
  () => import('../pages/ErrorPage/ErrorPage')
);
const App: FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isLoggedIn } = useAuth();
  useEffect(() => {
    if (!isLoggedIn) dispatch(refreshUser());
  }, [dispatch, isLoggedIn]);

  return isLoading ? (
    <b>Refreshing user...</b>
  ) : (
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
        <Route
          path="/chats/:id"
          element={<PrivateRoute component={<ChatMessagesPage />} />}
        />
      </Route>
      <Route path="*" element={<ErrorPageComponent />} />
    </Routes>
  );
};

export default App;
