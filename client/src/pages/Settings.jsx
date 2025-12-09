import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import { FaMoon, FaSun } from 'react-icons/fa';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-8">Settings</h2>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Customize how the application looks.</p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
                            }`}
                    >
                        <span className="sr-only">Toggle Dark Mode</span>
                        <span
                            className={`${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                                } inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 flex items-center justify-center`}
                        >
                            {theme === 'dark' ? (
                                <FaMoon className="text-primary-600 text-xs" />
                            ) : (
                                <FaSun className="text-yellow-500 text-xs" />
                            )}
                        </span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
