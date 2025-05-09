import React from 'react';
import { Case } from '../../../service/models/Case';
import Pagination from '../../common/Pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface CaseTableProps {
  cases: Case[];
  onCaseClick?: (caseId: string | number) => void;
  pagination?: PaginationProps;
}

const CaseTable: React.FC<CaseTableProps> = ({ cases, onCaseClick, pagination }) => {
  // Get tag color based on category
  const getTagClass = (tag: string) => {
    switch (tag) {
      case 'Casualties':
      case 'Violent':
      case 'Homicide':
        return 'bg-red-100 text-red-600';
      case 'Theft':
        return 'bg-blue-100 text-blue-600';
      case 'Narcotics':
        return 'bg-purple-100 text-purple-600';
      case 'Fraud':
      case 'Corruption':
        return 'bg-yellow-100 text-yellow-600';
      case 'Cyber Crime':
      case 'Data Breach':
        return 'bg-green-100 text-green-600';
      case 'Arson':
        return 'bg-orange-100 text-orange-600';
      case 'International':
      case 'Organized Crime':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Handle row click
  const handleRowClick = (caseId: string | number) => {
    if (onCaseClick) {
      onCaseClick(caseId);
    }
  };

  // Get officer avatars
  const getOfficerAvatars = (caseItem: Case) => {
    // Use officers array if available
    const officers = caseItem.officers || [];
    
    // Generate an array of all available avatars
    const avatars = [...officers.map(officer => ({
      id: officer.id,
      name: officer.name,
      avatar: officer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(officer.name)}&background=4F46E5&color=fff`,
      department: officer.department
    }))];
    
    // Add officerName as a fallback if officers array is empty
    if (avatars.length === 0 && caseItem.officerName) {
      avatars.push({
        id: 'default',
        name: caseItem.officerName,
        avatar: caseItem.officerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(caseItem.officerName)}&background=4F46E5&color=fff`,
        department: caseItem.department
      });
    }
    
    // Add some mock officers if needed (for demo purposes)
    if (avatars.length === 0) {
      avatars.push({
        id: 'default',
        name: 'Unassigned',
        avatar: `https://ui-avatars.com/api/?name=Unassigned&background=9CA3AF&color=fff`,
        department: 'No Department'
      });
    }
    
    return avatars;
  };

  if (cases.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mx-auto text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No cases found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Case Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Case Summary
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Officers
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((caseItem) => (
              <tr 
                key={caseItem.id} 
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(caseItem.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{caseItem.name}</div>
                      <div className="text-sm text-gray-500">{caseItem.description || 'No description'}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(caseItem.reportTime)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {caseItem.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTagClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                  <a 
                    href={caseItem.summaryUrl} 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Navigating to summary: ${caseItem.summaryUrl}`);
                    }}
                  >
                    {caseItem.summary || 'No summary available'}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-3 overflow-hidden">
                    {getOfficerAvatars(caseItem).slice(0, 5).map((officer, index) => (
                      <div key={index} className="tooltip" data-tip={`${officer.name}${officer.department ? ` • ${officer.department}` : ''}`}>
                        <img 
                          className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm hover:z-10 transition-all duration-200 hover:ring-blue-200"
                          src={officer.avatar}
                          alt={officer.name} 
                        />
                      </div>
                    ))}
                    {getOfficerAvatars(caseItem).length > 5 && (
                      <div className="tooltip" data-tip={`${getOfficerAvatars(caseItem).length - 5} more officers`}>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-300 hover:z-10 transition-all duration-200">
                          +{getOfficerAvatars(caseItem).length - 5}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caseItem.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {caseItem.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown dropdown-left">
                    <button className="text-gray-600 hover:text-gray-900">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                        />
                      </svg>
                    </button>
                    <ul className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-md w-40">
                      <li><a className="text-sm">View details</a></li>
                      <li><a className="text-sm">Update status</a></li>
                      <li><a className="text-sm text-red-600">Delete case</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        {pagination ? (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
          />
        ) : (
          <div className="text-sm text-gray-500 text-center">
            Pagination not available
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseTable; 