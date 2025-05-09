import React from 'react';
import SearchBar from '../../common/SearchBar';
import StatusFilter from './StatusFilter';
import TagsFilter from './TagsFilter';
import SortDropdown from './SortDropdown';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'Active' | 'Inactive';
  handleStatusFilterChange: (status: 'all' | 'Active' | 'Inactive') => void;
  tagFilter: string[];
  availableTags: string[];
  handleTagFilterChange: (tag: string) => void;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  getTagClass: (tag: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  handleStatusFilterChange,
  tagFilter,
  availableTags,
  handleTagFilterChange,
  handleSortChange,
  getTagClass
}) => {
  const handleClearAllTags = () => {
    // Set tag filter to empty array
    tagFilter.forEach(tag => handleTagFilterChange(tag));
  };

  return (
    <div className="px-6 py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="w-full md:w-96">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search cases..."
        />
      </div>
      
      
      <div className="flex flex-wrap items-center gap-2">
        
        <StatusFilter 
          statusFilter={statusFilter} 
          onChange={handleStatusFilterChange} 
        />

        
        <TagsFilter 
          tagFilter={tagFilter}
          availableTags={availableTags}
          onChange={handleTagFilterChange}
          onClearAll={handleClearAllTags}
          getTagClass={getTagClass}
        />

        
        <SortDropdown onChange={handleSortChange} />
      </div>
    </div>
  );
};

export default FilterBar; 