import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserMd, FaCalendarAlt, FaCog, FaSignOutAlt, FaCreditCard, FaTimes, FaHospital } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
            : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => window.innerWidth < 1024 && onClose && onClose()}
            className={`flex items-center gap-3 px-6 py-3.5 transition-all duration-200 group ${isActive(to)}`}
        >
            <Icon className={`text-xl transition-colors duration-200 ${location.pathname === to ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-500 dark:group-hover:text-primary-400'}`} />
            <span className={`font-medium ${location.pathname === to ? '' : 'text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>{label}</span>
        </Link>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 shadow-sm transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2 font-heading">
                        <span className="text-3xl">M</span> MediCare+
                    </h1>
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    <div className="px-6 mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    </div>

                    <NavItem to="/dashboard" icon={FaHome} label="Dashboard" />
                    <NavItem to="/doctors" icon={FaUserMd} label="Doctors" />
                    <NavItem to="/hospitals" icon={FaHospital} label="Hospitals" />
                    <NavItem to="/booking" icon={FaCalendarAlt} label="Appointment" />
                    <NavItem to="/payment" icon={FaCreditCard} label="Payment" />

                    <div className="mt-8 px-6 mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</p>
                    </div>

                    <NavItem to="/settings" icon={FaCog} label="Settings" />

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-3.5 text-red-500 hover:bg-red-50 transition-colors mt-2"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
