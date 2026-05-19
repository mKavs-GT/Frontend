import React from 'react';

const Tag = ({ children }) => {
  return (
    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
      {children}
    </span>
  );
};

export default Tag;
