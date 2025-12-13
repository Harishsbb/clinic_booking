import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
