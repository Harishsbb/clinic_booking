import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import PatientLogin from './pages/PatientLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import './App.css';

import { ThemeProvider } from './context/ThemeContext';
import ExtraHospital from './pages/ExtraHospital';
import HospitalDetails from './pages/HospitalDetails';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* Protected/Layout Routes */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/doctors" element={
            <Layout>
              <Doctors />
            </Layout>
          } />
          <Route path="/hospitals" element={
            <Layout>
              <ExtraHospital />
            </Layout>
          } />
          <Route path="/hospitals/:id" element={
            <Layout>
              <HospitalDetails />
            </Layout>
          } />
          <Route path="/booking" element={
            <Layout>
              <Booking />
            </Layout>
          } />
          <Route path="/payment" element={
            <Layout>
              <Payment />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

