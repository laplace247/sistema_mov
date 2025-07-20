import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Servicios from './components/Servicios';
import Registro from './components/Registro';
import Grabaciones from './components/Grabaciones';
import Live from './components/Live';
import Acerca from './components/Acerca';
import NotFoundPage from './components/NotFoundPage';
import Signup from './components/Signup';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/grabaciones" element={<Grabaciones />} />
        <Route path="/live" element={<Live />} />
        <Route path="/acerca" element={<Acerca/>} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}
