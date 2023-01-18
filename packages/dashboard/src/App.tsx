import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/ui/navigation/Layout';
import './styles/global.scss';

const App = () => {
  return (
    <>
      <Layout>
        <Outlet />  
        </Layout>
    </>
  );
};
export default App;
