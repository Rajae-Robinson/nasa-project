import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
