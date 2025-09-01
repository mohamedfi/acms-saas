import React from 'react';

export const Card = ({ className = '', ...props }) => (
    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg ${className}`} {...props} />
);

export const CardHeader = ({ className = '', ...props }) => (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
    <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }) => (
    <div className={`px-6 py-4 ${className}`} {...props} />
);
