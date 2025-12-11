import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaBars, FaSignOutAlt } from 'react-icons/fa';

const Topbar = ({ onMenuClick }) => {
    const [user, setUser] = useState({ name: 'Guest', role: 'Visitor' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (name) {
            setUser({ name, role: role || 'User' });
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            navigate('/');
            window.location.reload(); // Ensure clean state
        }
    };

    return (
        <div className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-500 hover:text-primary-600 transition-colors"
                >
                    <FaBars className="text-xl" />
                </button>


            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                <button className="relative p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
                    <FaBell className="text-xl" />
                    <span className="absolute top-1 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 cursor-pointer group focus:outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 border-2 border-transparent group-hover:border-primary-200 transition-all">
                            <FaUserCircle className="text-3xl" />
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-100 dark:border-gray-700 animate-fade-in z-50">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
