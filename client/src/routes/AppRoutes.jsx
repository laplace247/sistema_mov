import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../context/ProtectedRoute';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Servicios from '../components/Servicios';
import Registro from '../components/Registro';
import Grabaciones from '../components/Grabaciones';
import Live from '../components/Live';
import Acerca from '../components/Acerca';
import NotFoundPage from '../components/NotFoundPage';
import Signup from '../components/SignUp';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/servicios" element={<ProtectedRoute><Servicios /></ProtectedRoute>} />
      <Route path="/registro" element={<ProtectedRoute><Registro /></ProtectedRoute>} />
      <Route path="/grabaciones" element={<ProtectedRoute><Grabaciones /></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><Live /></ProtectedRoute>} />
      <Route path="/acerca" element={<ProtectedRoute><Acerca /></ProtectedRoute>} />
      <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
    </Routes>
  );
}