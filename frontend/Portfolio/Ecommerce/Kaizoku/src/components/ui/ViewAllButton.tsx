import React from 'react';
import { Link } from 'react-router-dom';

export const ViewAllButton: React.FC = () => {
  return (
    <Link to="/products" className="inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm hover:bg-[#DFA09D] hover:text-black hover:border-[#DFA09D] transition-all duration-300">
      View All Products
    </Link>
  );
};
