import React from 'react';
import { ChevronDownIcon } from '../../dashboard/icons/DashboardIcons';

interface StatusFilterProps {
  statusFilter: 'all' | 'Active' | 'Inactive';
  onChange: (status: 'all' | 'Active' | 'Inactive') => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, onChange }) => {
  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span>Status:</span>
        <span className={`font-medium ${
          statusFilter === 'Active' ? 'text-green-600' : 
          statusFilter === 'Inactive' ? 'text-red-600' : 'text-gray-700'
        }`}>
          {statusFilter === 'all' ? 'All' : statusFilter}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      <ul 
        tabIndex={0} 
        className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-md w-40 z-[1]"
      >
        <li>
          <a 
            className={`${statusFilter === 'all' ? 'active bg-gray-100' : ''} hover:bg-gray-100`} 
            onClick={() => onChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a 
            className={`${statusFilter === 'Active' ? 'active bg-gray-100' : ''} hover:bg-gray-100`} 
            onClick={() => onChange('Active')}
          >
            Active
          </a>
        </li>
        <li>
          <a 
            className={`${statusFilter === 'Inactive' ? 'active bg-gray-100' : ''} hover:bg-gray-100`} 
            onClick={() => onChange('Inactive')}
          >
            Inactive
          </a>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter; 