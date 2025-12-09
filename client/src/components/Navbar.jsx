import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Clinic Booking</h1>
                <ul className="flex space-x-6">
                    <li><Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link></li>
                    <li><Link to="/doctors" className="text-gray-600 hover:text-blue-600 font-medium">Doctors</Link></li>
                    <li><Link to="/booking" className="text-gray-600 hover:text-blue-600 font-medium">Book Appointment</Link></li>
                    <li><Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link></li>
                    <li><Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Register</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
