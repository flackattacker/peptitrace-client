import React from 'react';
import Layout from './Layout';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default PublicRoute; 