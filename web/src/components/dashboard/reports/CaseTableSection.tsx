import React from 'react';
import FilterBar from './FilterBar';
import CaseTable from '../tables/CaseTable';
import { Case } from '../../../service/models/Case';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface CaseTableSectionProps {
  cases: Case[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'Active' | 'Inactive';
  handleStatusFilterChange: (status: 'all' | 'Active' | 'Inactive') => void;
  tagFilter: string[];
  availableTags: string[];
  handleTagFilterChange: (tag: string) => void;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  getTagClass: (tag: string) => string;
  paginationData: PaginationData;
  onCaseClick: (caseId: number | string) => void;
}

const CaseTableSection: React.FC<CaseTableSectionProps> = ({
  cases,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  handleStatusFilterChange,
  tagFilter,
  availableTags,
  handleTagFilterChange,
  handleSortChange,
  getTagClass,
  paginationData,
  onCaseClick
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          tagFilter={tagFilter}
          availableTags={availableTags}
          handleTagFilterChange={handleTagFilterChange}
          handleSortChange={handleSortChange}
          getTagClass={getTagClass}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-500">Loading cases...</p>
        </div>
      ) : (
        <CaseTable 
          cases={cases} 
          onCaseClick={onCaseClick}
          pagination={paginationData}
        />
      )}
    </div>
  );
};

export default CaseTableSection; 