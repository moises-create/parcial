import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Page404 from '../pages/Page404';
import CanvaPage from '../pages/CanvaPage';
import CanvaListPage from '../pages/CanvaListPage';
import NavBar from '../components/navbar/Navbar';
import PrivateRoute from './PrivateRoute';

const PublicRoute = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/canvas" element={<CanvaListPage />} />
          <Route path="/canvas/:canvaId" element={<CanvaPage />} />
        </Route>
        
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PublicRoute;