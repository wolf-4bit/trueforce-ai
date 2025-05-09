import React from 'react';

interface SortDropdownProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: 'newest' | 'oldest' | 'a-z' | 'z-a';
}

const SortDropdown: React.FC<SortDropdownProps> = ({ 
  onChange, 
  defaultValue = 'newest' 
}) => {
  return (
    <select
      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white focus:outline-none cursor-pointer appearance-none hover:bg-gray-50 transition-colors"
      onChange={onChange}
      defaultValue={defaultValue}
      style={{ 
        backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", 
        backgroundRepeat: "no-repeat", 
        backgroundPosition: "right 0.5rem center", 
        backgroundSize: "1.5em 1.5em", 
        paddingRight: "2.5rem" 
      }}
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="a-z">A-Z</option>
      <option value="z-a">Z-A</option>
    </select>
  );
};

export default SortDropdown; 