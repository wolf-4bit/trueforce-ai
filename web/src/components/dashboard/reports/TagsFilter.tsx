import React from 'react';
import { ChevronDownIcon } from '../../dashboard/icons/DashboardIcons';

interface TagsFilterProps {
  tagFilter: string[];
  availableTags: string[];
  onChange: (tag: string) => void;
  onClearAll: () => void;
  getTagClass: (tag: string) => string;
}

const TagsFilter: React.FC<TagsFilterProps> = ({ 
  tagFilter, 
  availableTags, 
  onChange, 
  onClearAll,
  getTagClass 
}) => {
  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span>Tags:</span>
        <span className="font-medium text-gray-700">
          {tagFilter.length > 0 ? `${tagFilter.length} selected` : 'All'}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      <div 
        tabIndex={0} 
        className="dropdown-content p-2 shadow-lg bg-base-100 rounded-md w-64 z-[1]"
      >
        <div className="p-2 max-h-60 overflow-y-auto">
          {availableTags.map(tag => (
            <div key={tag} className="form-control">
              <label className="cursor-pointer label flex justify-start gap-2 hover:bg-gray-50 rounded-md transition-colors">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm" 
                  checked={tagFilter.includes(tag)}
                  onChange={() => onChange(tag)}
                />
                <span className={`text-xs px-2 py-1 rounded-full ${getTagClass(tag)}`}>
                  {tag}
                </span>
              </label>
            </div>
          ))}
        </div>
        {tagFilter.length > 0 && (
          <div className="mt-2 pt-2 border-t flex justify-end">
            <button 
              className="btn btn-xs btn-outline" 
              onClick={onClearAll}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsFilter; 