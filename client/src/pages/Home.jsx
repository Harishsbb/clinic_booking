import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FaBars, FaTimes } from 'react-icons/fa';

import PatientDashboard from '../components/PatientDashboard';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (userId && role === 'user') {
    return (
      <>
        <nav className="bg-white shadow-sm py-4 px-4 lg:px-8 flex justify-between items-center relative z-20">
          <div className="text-2xl font-bold text-primary-600 font-heading flex items-center gap-2">
            <span className="text-3xl">M</span> MediCare+
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700 font-medium hidden sm:block">Hello, {localStorage.getItem('name')}</span>
            <Button variant="ghost" onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>Logout</Button>
          </div>
        </nav>
        <PatientDashboard />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Navbar (Simplified for Home) */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-4 lg:px-8 flex justify-between items-center relative z-20">
        <div className="text-2xl font-bold text-primary-600 font-heading flex items-center gap-2">
          <span className="text-3xl">M</span> MediCare+
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4 flex flex-col gap-4 md:hidden animate-fade-in">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-center">Login</Button>
            </Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full justify-center">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto gap-12">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-heading">
            Your Health, <br />
            <span className="text-primary-600">Our Priority</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
            Book appointments with the best doctors in town. We provide top-notch healthcare services with a patient-centric approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/doctors">
              <Button size="lg" className="w-full sm:w-auto">View Doctors</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Book Appointment</Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 relative w-full">
          <div className="absolute inset-0 bg-primary-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <img
            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Doctor with patient"
            className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 w-full object-cover"
          />
        </div>
      </div>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary-600 font-heading mb-4">MediCare+</h3>
              <p className="text-gray-500 text-sm">Providing quality healthcare services with a personal touch.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
                <li><Link to="/doctors" className="hover:text-primary-600">Doctors</Link></li>
                <li><Link to="/register" className="hover:text-primary-600">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>123 Health Street</li>
                <li>Medical District, City</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediCare+. All rights reserved.</p>
            <div className="mt-4">
              <Link to="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Hospital Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
