import React, { useState } from 'react';
import { Search } from 'lucide-react'; // Konsisten dengan ikon lainnya

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 mx-8 mt-4 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl border border-gray-100">
      {/* Logo/Title */}
      <div className="text-lg font-semibold text-gray-800">Dashboard Admin</div>

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2 space-x-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Cari sesuatu..."
          className="w-full text-sm text-gray-700 bg-transparent outline-none focus:ring-0"
        />
      </div>
    </div>
  );
};

export default Header;
