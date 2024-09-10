// src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
      <Header />
      <main>
        <ToastContainer/>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
