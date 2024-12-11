import { Navigate } from 'react-router-dom';

import React, { ReactElement } from 'react';
import { useAuth } from '../utils/hooks/useAuth';

interface PropTypes {
  component: ReactElement;
  redirectTo: string;
}

export const PublicRoute: React.FC<PropTypes> = ({
  component: Component,
  redirectTo = '/',
}) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
