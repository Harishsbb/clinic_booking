import React from 'react';

const Input = ({
    label,
    id,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    className={`
                        block w-full px-4 py-2 rounded-lg border 
                        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} 
                        bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 transition-all duration-200
                        disabled:bg-gray-50 disabled:text-gray-500
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
