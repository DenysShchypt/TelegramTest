import { Navigate, useLocation } from 'react-router-dom';

import React, { ReactElement } from 'react';
import { useAuth } from '../utils/hooks/useAuth';

interface PropTypes {
  component: ReactElement;
}

export const PrivateRoute: React.FC<PropTypes> = ({ component: Component }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    Component
  );
};
