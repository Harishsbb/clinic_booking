import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';

const Topbar = ({ onMenuClick }) => {
    const [user, setUser] = useState({ name: 'Guest', role: 'Visitor' });

    useEffect(() => {
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (name) {
            setUser({ name, role: role || 'User' });
        }
    }, []);

    return (
        <div className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-500 hover:text-primary-600 transition-colors"
                >
                    <FaBars className="text-xl" />
                </button>

                <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-2 w-full max-w-xs lg:w-96 border border-gray-200 dark:border-gray-600 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all hidden sm:flex">
                    <FaSearch className="text-gray-400 dark:text-gray-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                <button className="relative p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
                    <FaBell className="text-xl" />
                    <span className="absolute top-1 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 border-2 border-transparent group-hover:border-primary-200 transition-all">
                        <FaUserCircle className="text-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
