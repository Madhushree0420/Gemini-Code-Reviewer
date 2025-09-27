import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-full" aria-label="Loading...">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
  </div>
);
